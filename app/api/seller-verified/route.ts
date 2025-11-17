import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { id, password } = await req.json();

    // basic validation
    if (!id || typeof password !== "string" || password.trim() === "") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    // find user
    const seller = await User.findById(id);
    if (!seller) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    // update password directly (NO HASH)
    await User.updateOne(
      { _id: id },
      { $set: { password: hashedPassword, verified: true } }
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Set Password Error:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}
