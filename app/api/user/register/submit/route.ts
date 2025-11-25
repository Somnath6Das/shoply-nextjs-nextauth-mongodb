import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to DB

    await User.create({
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    });
    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
