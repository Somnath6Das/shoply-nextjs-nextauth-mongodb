import Category from "@/models/Category";
import { connectToDatabase } from "@/lib/db";

type SimpleCategory = {
  _id: string;
  main: string;
  subs: string[];
};
import CreateProduct from "@/components/seller/product/CreateProduct"; // Adjust the import path as needed

export default async function CreateProductPage() {
  await connectToDatabase();
  const categories = await Category.find().sort({ main: 1 }).lean();

  const simple: SimpleCategory[] = categories.map((cat: any) => ({
    _id: cat._id.toString(),
    main: cat.main,
    subs: cat.subs || [],
  }));

  return <CreateProduct categories={simple} />;
}
