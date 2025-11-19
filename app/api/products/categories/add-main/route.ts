import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { main, sub } = await req.json();

    if (!main) {
      return NextResponse.json(
        { error: "Main category required" },
        { status: 400 }
      );
    }

    // Check if main category exists
    let mainCategory = await Category.findOne({ name: main, parent: null });

    // Create main category if not exists
    if (!mainCategory) {
      mainCategory = await Category.create({
        name: main,
        parent: null,
      });
    }

    // If no sub category provided → done
    if (!sub) {
      return NextResponse.json({ success: true, mainCategory });
    }

    // Check if sub already exists under this parent
    const existingSub = await Category.findOne({
      name: sub,
      parent: mainCategory._id,
    });

    if (existingSub) {
      return NextResponse.json({
        success: true,
        message: "Sub category already exists",
      });
    }

    // Create new sub category
    const newSub = await Category.create({
      name: sub,
      parent: mainCategory._id,
    });

    return NextResponse.json({ success: true, mainCategory, newSub });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
