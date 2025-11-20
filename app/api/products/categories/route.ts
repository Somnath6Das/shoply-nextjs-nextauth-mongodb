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

    const formattedMain = main.trim();
    const formattedSub = sub?.trim();

    const existing = await Category.findOne({ main: formattedMain });

    if (existing) {
      if (formattedSub && !existing.subs.includes(formattedSub)) {
        existing.subs.push(formattedSub);
        await existing.save();
      }

      return NextResponse.json({ success: true });
    }

    await Category.create({
      main: formattedMain,
      subs: formattedSub ? [formattedSub] : [],
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("🔥 API ERROR:", err);
    return NextResponse.json(
      { error: "Server Error", details: err.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE MAIN OR SUB
export async function DELETE(req: Request) {
  await connectToDatabase();
  const { main, sub } = await req.json();

  if (!main)
    return NextResponse.json({ error: "Main required" }, { status: 400 });

  const category = await Category.findOne({ main });

  if (!category)
    return NextResponse.json({ error: "Category not found" }, { status: 404 });

  // ⭐ DELETE SUB
  if (sub) {
    await Category.updateOne({ main }, { $pull: { subs: sub } });
    return NextResponse.json({ success: true });
  }

  // ⭐ DELETE MAIN
  await Category.deleteOne({ main });

  return NextResponse.json({ success: true });
}
