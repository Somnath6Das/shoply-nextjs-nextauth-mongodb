"use server";

import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Types } from "mongoose";

export async function placeOrder(data: {
  productId: string;
  variantId: string;
  sellerId: string;
  qty: number;
  price: number;
}) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return { error: "You must be signed in" };
    }

    const userId = session?.user.id;

    const order = await Order.create({
      userId,
      items: [
        {
          productId: new Types.ObjectId(data.productId),
          variantId: new Types.ObjectId(data.variantId),
          sellerId: new Types.ObjectId(data.sellerId),
          quantity: data.qty,
          price: data.price,
        },
      ],
      totalAmount: data.qty * data.price,
    });

    return { success: true, orderId: order._id.toString() };
  } catch (error) {
    console.error("Order error:", error);
    return { error: "Failed to place order" };
  }
}
