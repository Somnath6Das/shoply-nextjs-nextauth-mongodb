import { connectToDatabase } from "./db";
import User from "../models/User";

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
      // Update username and password if changed
      existingAdmin.username = username;
      existingAdmin.password = password;
      await existingAdmin.save();
      console.log("🔄 Admin credentials updated");
    }
  } catch (error) {
    console.error("❌ Error creating/updating admin:", error);
  }
}
