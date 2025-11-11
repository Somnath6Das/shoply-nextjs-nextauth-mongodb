import { connectToDatabase } from "./db";
import User from "../models/User";
import bcrypt from "bcryptjs";

export async function createAdmin() {
  await connectToDatabase();
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn("⚠️ Missing ADMIN_USERNAME or ADMIN_PASSWORD in .env");
    return;
  }
  try {
    const existingAdmin = await User.findOne({ role: "admin" });
    if (!existingAdmin) {
      await User.create({
        username,
        password,
        role: "admin",
      });
      console.log("✅ Admin account created automatically");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.log(error);
  }
}
