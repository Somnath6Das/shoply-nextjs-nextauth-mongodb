import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { Types } from "mongoose";

export default async function Profile() {
  await connectToDatabase();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-10">Please sign in</div>;
  }

  // Get ALL orders (sorted newest first)
  const orders = await Order.find({
    userId: new Types.ObjectId(session.user.id),
  })
    .sort({ createdAt: -1 })
    .lean();

  return <div className="bg-gray-100 min-h-screen p-6"></div>;
}
