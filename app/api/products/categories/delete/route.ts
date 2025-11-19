import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();

    const { catId } = await req.json();

    if (!catId || !Types.ObjectId.isValid(catId)) {
      return NextResponse.json(
        { error: "Invalid or missing category ID" },
        { status: 400 }
      );
    }

    // Delete the main category
    const deleted = await Category.findOneAndDelete({
      _id: catId,
      parent: null,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Main category not found" },
        { status: 404 }
      );
    }

    // Also delete subcategories under this parent
    await Category.deleteMany({ parent: catId });

    return NextResponse.json(
      { success: true, message: "Main category deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
