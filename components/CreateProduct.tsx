"use client";

import { useState } from "react";
import { addMainCategory, handleAddSub } from "@/app/actions/category";
import { createProductAction } from "@/features/product";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "@/features/uploads";

type Categories = {
  _id: string;
  main: string;
  subs: string[];
};
type OptionType = {
  name: string;
  values: string[];
};
type VariantType = {
  combination: Record<string, string>;
  price: string;
  stock: string;
  images: string[];
};
export default function CreateProductPage({
  categories,
}: {
  categories: Categories[];
}) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [newMain, setNewMain] = useState("");
  const [newSub, setNewSub] = useState("");
  const [options, setOptions] = useState<OptionType[]>([]);
  const [variants, setVariants] = useState<VariantType[]>([]);
  const [allImages, setAllImages] = useState<string[]>([]);

  const handleAddMain = async () => {
    if (!newMain.trim()) return alert("Enter main category");

    const form = new FormData();
    form.append("main", newMain);

    await addMainCategory(form);

    setNewMain("");
    router.refresh();
  };

  const AddSubCategory = async () => {
    if (!mainCategory) return alert("Select main category");
    if (!newSub.trim()) return alert("Enter subcategory");

    const form = new FormData();
    form.append("main", mainCategory);
    form.append("sub", newSub);

    await handleAddSub(mainCategory, newSub);

    setNewSub("");
    router.refresh();
  };
  const addOption = () => setOptions([...options, { name: "", values: [] }]);
  // ✅ Add variant
  const addVariant = () =>
    setVariants([
      ...variants,
      { combination: {}, price: "", stock: "", images: [] },
    ]);
  // ✅ Handle variant image selection
  const handleVariantImageSelect = (vi: number, imageUrl: string) => {
    const updated = [...variants];
    updated[vi].images = [imageUrl];
    setVariants(updated);
  };
  const handleUploadImages = async (files: File[]) => {
    const uploaded: string[] = [];

    for (const file of files) {
      const imageUrl = await uploadImage(file);
      uploaded.push(imageUrl);
    }

    setAllImages((prev) => [...prev, ...uploaded]);
  };
  const handleSubmit = async () => {
    await createProductAction({
      name,
      description,
      mainCategory,
      subCategory,
      options,
      variants,
      allImages,
    });

    router.push("/seller/dashboard/products");
  };

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-2xl">Create Product</h2>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
      />

      {/* CATEGORY MANAGEMENT UI — unchanged */}
      <div className="border rounded-md p-4">
        <h3 className="font-semibold mb-3 text-lg">Category Management</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="New Main Category"
            value={newMain}
            onChange={(e) => setNewMain(e.target.value)}
            className="border rounded-md px-3 py-2 flex-1"
          />
          <button
            type="button"
            onClick={handleAddMain}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Main
          </button>
        </div>

        <select
          value={mainCategory}
          onChange={(e) => {
            setMainCategory(e.target.value);
            setSubCategory("");
          }}
          required
          className="border rounded-md px-3 py-2 w-full mb-3"
        >
          <option value="">Select Main Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.main}>
              {cat.main}
            </option>
          ))}
        </select>

        {mainCategory && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="New Subcategory"
              value={newSub}
              onChange={(e) => setNewSub(e.target.value)}
              className="border rounded-md px-3 py-2 flex-1"
            />
            <button
              type="button"
              onClick={AddSubCategory}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Add Sub
            </button>
          </div>
        )}

        {mainCategory && (
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            required
            className="border rounded-md px-3 py-2 w-full"
          >
            <option value="">Select Subcategory</option>
            {categories
              .find((c) => c.main === mainCategory)
              ?.subs.map((sub, idx) => (
                <option key={idx} value={sub}>
                  {sub}
                </option>
              ))}
          </select>
        )}
      </div>

      {/* IMAGE UPLOAD — same UI */}
      <div>
        <label className="block font-semibold mb-2">Product Images</label>

        <div className="flex gap-3 flex-wrap">
          {/* Upload Button */}
          <label className="w-24 h-24 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 relative">
            <span className="text-3xl text-gray-500">+</span>

            <input
              type="file"
              multiple
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) =>
                handleUploadImages(Array.from(e.target.files || []))
              }
            />
          </label>

          {/* Preview Thumbnails */}
          {allImages.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <Image
                src={img}
                width={100}
                height={100}
                alt=""
                className="w-full h-full object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={() =>
                  setAllImages(allImages.filter((_, i) => i !== idx))
                }
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs w-5 h-5 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* All options + variants UI — unchanged */}
      <button
        type="button"
        onClick={addOption}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Add Option (e.g. Color, Size)
      </button>
      {options.map((opt, i) => (
        <div key={i} className="relative space-y-2 border p-3 rounded">
          <button
            type="button"
            onClick={() => setOptions(options.filter((_, idx) => idx !== i))}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
          >
            ×
          </button>
          <h4 className="font-semibold">Add Option {i + 1}</h4>
          <input
            type="text"
            placeholder="Option Name (e.g. Color, Size)"
            value={opt.name}
            onChange={(e) => {
              const updated = [...options];
              updated[i].name = e.target.value;
              setOptions(updated);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Values (comma separated or hyphen seperated) "
            value={opt.values.join(",")}
            onChange={(e) => {
              const updated = [...options];
              updated[i].values = e.target.value.split(",");
              setOptions(updated);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addVariant}
        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-2"
      >
        Add Variant
      </button>

      {/* Variants */}
      {variants.map((variant, vi) => (
        <div key={vi} className="relative border p-3 rounded space-y-3">
          <button
            type="button"
            onClick={() => setVariants(variants.filter((_, idx) => idx !== vi))}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
          >
            ×
          </button>

          <h4 className="font-semibold">Variant {vi + 1}</h4>

          {options.map((opt, oi) => (
            <div key={oi}>
              <label className="block text-sm font-medium mb-1">
                {opt.name}
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-2 py-2"
                value={variant.combination[opt.name] || ""}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[vi].combination[opt.name] = e.target.value;
                  setVariants(updated);
                }}
              >
                <option value="">Select {opt.name}</option>
                {opt.values.map((val, idx) => (
                  <option key={idx} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <input
            type="text"
            placeholder="Price"
            value={variant.price}
            onChange={(e) => {
              const updated = [...variants];
              updated[vi].price = e.target.value;
              setVariants(updated);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          <input
            type="text"
            placeholder="Stock"
            value={variant.stock}
            onChange={(e) => {
              const updated = [...variants];
              updated[vi].stock = e.target.value;
              setVariants(updated);
            }}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          {/* Variant Images */}
          <label className="block text-sm font-medium mb-1">Select Image</label>
          <div className="flex gap-2 flex-wrap">
            {allImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => handleVariantImageSelect(vi, img)}
                className={`relative w-20 h-20 border-3 rounded-lg overflow-hidden cursor-pointer ${
                  variant.images.includes(img)
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
              >
                <Image
                  src={img}
                  alt="thumbnail"
                  width={60}
                  height={60}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* (Your entire UI stays exactly the same here...) */}
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 ml-2"
      >
        Save Product
      </button>
    </div>
  );
}
