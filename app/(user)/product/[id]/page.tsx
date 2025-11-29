import { ObjectId } from "mongodb";
import Product from "@/models/Product";
import { connectToDatabase } from "@/lib/db";
import ProductMain from "@/components/home/ProductMain";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    notFound();
  }

  await connectToDatabase();

  const product = await Product.findOne({ _id: new ObjectId(id) }).lean();

  if (!product) {
    notFound();
  }

  return <ProductMain product={JSON.parse(JSON.stringify(product))} />;
}
