"use server";

import Address from "@/models/Address";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getAddress() {
  await connectToDatabase();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return null;

  const address = await Address.findOne({ userId: session.user.id }).lean();

  return JSON.parse(JSON.stringify(address));
}

export async function saveAddress(formData: FormData) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) throw new Error("Not authenticated");

  const name = formData.get("name") as string;
  const location = formData.get("location") as string;
  const pin = formData.get("pin") as string;
  const phone = formData.get("phone") as string;

  // Allow only ONE per user → upsert
  await Address.findOneAndUpdate(
    { userId: session.user.id },
    { userId: session.user.id, name, location, pin, phone },
    { upsert: true, new: true }
  );

  revalidatePath("/");
}
