import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectToDatabase();

    let body;
    try {
      body = await req.json();
      // console.log("BODY RECEIVED:", body);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const saved = await Product.create({
      sellerId: session.user.id,
      name: body.name,
      description: body.description,
      deliveryInDays: body.deliveryInDays,
      category: body.category,
      options: body.options,
      variants: body.variants,
      allImages: body.allImages,
    });

    return NextResponse.json({ product: saved }, { status: 201 });
  } catch (err: any) {
    console.error("Product create error:", err);
    return NextResponse.json(
      { error: err.message || "Product creation failed" },
      { status: 500 }
    );
  }
}
