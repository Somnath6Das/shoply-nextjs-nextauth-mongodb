"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";

interface PlaceOrderInput {
  productId: string;
  variantId: string;
  sellerId: string;
  deliveryInDays: string;
  qty: number;
  price: number;
  combination: Record<string, string>;
  itemName: string;
  image: string;
  address: {
    name: string;
    location: string;
    pin: string;
    phone: string;
  };
}

export async function placeOrder(data: PlaceOrderInput) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const totalAmount = data.price * data.qty;

    const order = await Order.create({
      userId: session.user.id,
      sellerId: data.sellerId,
      items: [
        {
          productId: data.productId,
          variantId: data.variantId,
          deliveryInDays: data.deliveryInDays,
          ItemName: data.itemName,
          image: data.image,

          quantity: data.qty,
          price: data.price,
          combination: data.combination,
        },
      ],
      address: [data.address],
      totalAmount,
      status: "pending",
    });

    // Convert Mongoose document to plain object
    const plainOrder = {
      _id: order._id.toString(),
      userId: order.userId.toString(),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
    };

    return { success: true, order: plainOrder };
  } catch (err: any) {
    console.error("Order creation error:", err);
    return { success: false, error: err.message || "Failed to place order" };
  }
}
