import { addMainCategory, deleteMainCategory } from "@/app/actions/category";
import Form from "next/form";

type Categories = {
  _id: string;
  name: string;
};

export default function AddCategory({
  categories,
}: {
  categories: Categories[];
}) {
  return (
    <div className="border rounded-xl p-5 space-y-4 ">
      <h3 className="font-semibold text-lg text-blue-700">
        Add a New Main Category
      </h3>

      {/* ADD CATEGORY */}
      <Form action={addMainCategory}>
        <div className="flex gap-2">
          <input
            type="text"
            name="main"
            placeholder="e.g. Mobile, Laptop, Air Condition"
            className="border rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Main
          </button>
        </div>
      </Form>

      {/* DELETE CATEGORY */}
      {categories.length > 0 && (
        <div className="space-y-2 mt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Existing Main Categories
          </label>

          {categories.map((cat) => (
            <Form key={cat._id} action={deleteMainCategory}>
              <div className="flex justify-between items-center bg-white border px-3 py-2 rounded-md">
                <span className="text-gray-800 font-medium">{cat.name}</span>

                {/* Each form has its own catId */}
                <input type="hidden" name="catId" value={cat._id} />

                <button type="submit" className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </Form>
          ))}
        </div>
      )}
    </div>
  );
}
