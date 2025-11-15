// app/admin/messages/page.tsx (server component)
import SellerMsg from "@/models/SellerMsg";
import { connectToDatabase } from "@/lib/db";

export default async function MessagesPage() {
  await connectToDatabase();

  const messages = await SellerMsg.find().sort({ createdAt: -1 });

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg._id}>
          <p>{msg.sellerName}</p>
          <p>{msg.email}</p>
          <p>{msg.message}</p>
        </div>
      ))}
    </div>
  );
}
