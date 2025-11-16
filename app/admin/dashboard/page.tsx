// app/admin/messages/page.tsx (server component)
import SellerMsg from "@/models/SellerMsg";
import { connectToDatabase } from "@/lib/db";
import MsgsList from "@/components/admin/MsgList";

export default async function MessagesPage() {
  await connectToDatabase();

  const messages = await SellerMsg.find().sort({ createdAt: -1 });

  return <MsgsList messages={messages} />;
}
