import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { role, email, sellerName, password } = await req.json();

    if (!role || !email) {
      return NextResponse.json(
        { error: "Role and email required" },
        { status: 400 }
      );
    }

    // Validation based on role
    if (role === "user" && !email)
      return NextResponse.json(
        { error: "Email required for user" },
        { status: 400 }
      );
    if (role === "seller" && (!email || !sellerName))
      return NextResponse.json(
        { error: "Email and seller name required for seller" },
        { status: 400 }
      );

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Account already exists" },
        { status: 400 }
      );
    }
    if (role === "user") {
      const newUser = new User({
        role,
        email,
        password,
      });
      await newUser.save();
      return NextResponse.json(
        { message: "User Registered successfully" },
        { status: 201 }
      );
    }

    if (role === "seller") {
      const newUser = new User({
        role,
        email,
        sellerName,
        password,
      });
      await newUser.save();
      return NextResponse.json(
        { message: "Seller Registered successfully" },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
