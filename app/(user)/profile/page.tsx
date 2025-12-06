import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { redirect } from "next/navigation";
import OrderCard from "@/components/home/OrderCard";
import Logout from "@/components/Logout";
import Image from "next/image";

interface OrderItem {
  productId: string;
  variantId: string;
  ItemName: string;
  image: string;
  deliveryInDays: number;
  quantity: number;
  price: number;
  combination: Record<string, string>;
  _id: string;
}

interface OrderAddress {
  name: string;
  location: string;
  pin: string;
  phone: string;
  _id: string;
}

interface SerializedOrder {
  _id: string;
  userId: string;
  sellerId: string;
  items: OrderItem[];
  address: OrderAddress[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!session?.user?.id) {
    return;
  }

  let orders: SerializedOrder[] = [];

  try {
    await connectToDatabase();

    const ordersData = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Serialize the orders
    orders = ordersData.map((order: any) => ({
      _id: order._id.toString(),
      userId: order.userId.toString(),
      sellerId: order.sellerId.toString(),
      items: order.items.map((item: any) => ({
        productId: item.productId.toString(),
        variantId: item.variantId.toString(),
        ItemName: item.ItemName,
        image: item.image,
        deliveryInDays: Number(item.deliveryInDays) || 0,
        quantity: item.quantity,
        price: item.price,
        combination:
          item.combination instanceof Map
            ? Object.fromEntries(item.combination)
            : item.combination,
        _id: item._id.toString(),
      })),
      address: order.address.map((addr: any) => ({
        name: addr.name,
        location: addr.location,
        pin: addr.pin,
        phone: addr.phone,
        _id: addr._id.toString(),
      })),
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch orders:", error);
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="bg-white rounded-lg border p-12 text-center">
          <p className="text-gray-600 text-lg">No orders yet</p>
          <p className="text-gray-500 mt-2">
            Your orders will appear here once you make a purchase
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <div className="flex items-center space-x-3">
          <Image
            src={"/images/user.png"}
            alt="user"
            width={30}
            height={30}
            className="object-contain"
          />
          <h1 className="text-base font-semibold text-black bg-gray-200 px-2 py-0.5 rounded-md">
            {email}
          </h1>
          <Logout path="/" />
        </div>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
}
