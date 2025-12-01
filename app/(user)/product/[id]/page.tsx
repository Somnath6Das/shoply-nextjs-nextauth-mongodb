import { ObjectId } from "mongodb";
import Product from "@/models/Product";
import { connectToDatabase } from "@/lib/db";
import ProductMain from "@/components/home/ProductMain";
import { notFound } from "next/navigation";
import User from "@/models/User";

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

  const product = (await Product.findOne({
    _id: new ObjectId(id),
  }).lean()) as any;

  if (!product) {
    notFound();
  }

  const seller = await User.findOne({ _id: product.sellerId }).lean();

  return (
    <ProductMain
      product={JSON.parse(JSON.stringify(product))}
      seller={JSON.parse(JSON.stringify(seller))}
    />
  );
}
