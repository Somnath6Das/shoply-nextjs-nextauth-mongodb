import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import { Types } from "mongoose";
import { redirect } from "next/navigation";

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
    const seller = await User.findById(id);

    if (!seller) {
      return NextResponse.json(
        { error: "Seller Account not found" },
        { status: 404 }
      );
    }

    // Delete document
    const res = await User.findByIdAndDelete(id);
    // console.log(res.data, res.status);

    return NextResponse.json(
      { message: "Seller Account deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete seller account Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while deleting seller Account" },
      { status: 500 }
    );
  }
}
