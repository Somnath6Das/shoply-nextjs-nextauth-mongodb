import { NextResponse } from "next/server";
import Product from "@/models/Product";
import { connectToDatabase } from "@/lib/db";

function shuffle(array: unknown[]) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

export async function GET() {
  try {
    await connectToDatabase(); // <-- IMPORTANT

    const result = await Product.aggregate([
      {
        $group: {
          _id: "$category.main",
          items: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          mainCategory: "$_id",
          items: 1,
        },
      },
    ]);

    // Shuffle items inside each category
    const randomized = result.map((cat) => ({
      ...cat,
      items: shuffle(cat.items),
    }));

    // Shuffle the category order
    const finalResult = shuffle(randomized);

    return NextResponse.json(finalResult);
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
