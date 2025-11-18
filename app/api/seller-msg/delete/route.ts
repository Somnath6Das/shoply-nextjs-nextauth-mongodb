import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import SellerMsg from "@/models/SellerMsg";
import { Types } from "mongoose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Missing id or reason" },
        { status: 400 }
      );
    }
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    // Find message to get seller email
    const message = await SellerMsg.findById(id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    // Delete document
    const res = await SellerMsg.findByIdAndDelete(id);
    // console.log(res.data, res.status);

    return NextResponse.json(
      { message: "Seller message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete seller message Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting seller message." },
      { status: 500 }
    );
  }
}
