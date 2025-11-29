import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Address from "@/models/Address";

export async function POST(req: Request) {
  await connectToDatabase();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await Address.deleteOne({ userId: session.user.id });

  return NextResponse.json({ success: true });
}
