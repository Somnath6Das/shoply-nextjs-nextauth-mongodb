import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Product from "@/models/Product";
import { connectToDatabase } from "@/lib/db"; // your Mongo connection file
// import Address from "@/models/Address";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase(); // Ensure DB is connected

    const { searchParams } = new URL(req.url);
    const variantId = searchParams.get("id");

    if (!variantId) {
      return NextResponse.json(
        { error: "Variant ID is required" },
        { status: 400 }
      );
    }

    // Ensure DB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL!);
    }

    // Find the product containing this variant
    const product = (await Product.findOne(
      { "variants._id": variantId },
      { __v: 0 } // optional: remove internal field
    ).lean()) as any;

    if (!product) {
      return NextResponse.json(
        { error: "Variant not found in any product" },
        { status: 404 }
      );
    }

    // Find the exact variant inside the array
    const variant = product.variants.find(
      (v: any) => String(v._id) === String(variantId)
    );

    if (!variant) {
      return NextResponse.json(
        { error: "Variant exists but could not be extracted" },
        { status: 404 }
      );
    }
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id)
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json({
      product,
      variant,
    });
  } catch (error) {
    console.error("Variant API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
