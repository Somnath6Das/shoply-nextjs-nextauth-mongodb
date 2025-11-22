import { authOptions } from "@/lib/auth";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Products() {
  const session = await getServerSession(authOptions);
  const products = await Product.find({
    sellerId: session?.user?.id,
  })
    .sort({ createdAt: -1 })
    .lean();
  console.log(products);
  return (
    <div className="p-4">
      <Link
        href="/seller/dashboard/products/create"
        className="bg-[#5e3e89] text-white px-4 py-2 rounded-lg hover:bg-[#4a2f6b] transition-all duration-200"
      >
        Create Product
      </Link>
    </div>
  );
}
