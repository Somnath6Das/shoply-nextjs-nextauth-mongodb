import { useState } from "react";

export default function SelectCategory({ categories }) {
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [newSub, setNewSub] = useState("");
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
      <div className="border rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-lg text-green-700">
          Add a Subcategory
        </h3>

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select Main Category
        </label>
        <select
          value={mainCategory}
          onChange={(e) => {
            setMainCategory(e.target.value);
            setSubCategory("");
          }}
          className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-green-400"
        >
          <option value="">-- Select Main Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.main}>
              {cat.main}
            </option>
          ))}
        </select>

        {/* Add new subcategory */}
        {mainCategory && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
              New Subcategory Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Samsung, iPhone, Dell"
                value={newSub}
                onChange={(e) => setNewSub(e.target.value)}
                className="border rounded-md px-3 py-2 flex-1 focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleAddSub}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Add Sub
              </button>
            </div>

            {/* List existing subcategories */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Existing Subcategories under “{mainCategory}”
              </label>
              <div className="space-y-1">
                {categories
                  .find((c) => c.main === mainCategory)
                  ?.subs.map((sub, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white border px-3 py-2 rounded-md"
                    >
                      <span className="text-gray-800">{sub}</span>
                      <button
                        onClick={() => handleDeleteSub(mainCategory, sub)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
      {mainCategory && (
        <div className="border rounded-xl p-5 bg-green-100">
          <h3 className="font-semibold text-lg ">Selected Category Summary</h3>
          <p className="mt-2 text-gray-700">
            <span className="font-medium">Main Category:</span> {mainCategory}
          </p>
          {subCategory && (
            <p className="text-gray-700">
              <span className="font-medium">Subcategory:</span> {subCategory}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
