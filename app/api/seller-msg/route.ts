import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SellerMsg from "@/models/SellerMsg";
import User from "@/models/User";
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, sellerName, message } = await req.json();

    if (!email || !sellerName || !message) {
      return NextResponse.json(
        { error: "email, seller name and message required" },
        { status: 400 }
      );
    }

    // Check existing
    const existingMsg = await SellerMsg.findOne({ email: email.toLowerCase() });

    if (existingMsg) {
      return NextResponse.json(
        { error: "Message already sent" },
        { status: 400 }
      );
    }
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      role: "seller",
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "You are already a seller" },
        { status: 400 }
      );
    }

    const sellerMsg = new SellerMsg({
      email: email.toLowerCase(),
      sellerName,
      message,
    });
    await sellerMsg.save();
    return NextResponse.json(
      { message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
