import AddCategory from "@/components/seller/AddCategory";
import { connectToDatabase } from "@/lib/db";
import Category from "@/models/Category";

export default async function Categories() {
  await connectToDatabase();

  let categories = await Category.find({ parent: null }).sort({ name: 1 });

  categories = categories.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
  }));

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3">
          Category Management
        </h2>
        <AddCategory categories={categories} />
      </div>
      {/* List all main categories */}
    </div>
  );
}
