"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { uploadImage } from "@/features/uploads";
import { updateProductAction } from "@/app/actions/product";
import { addMainCategory, handleAddSub } from "@/app/actions/category";

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

type ProductType = {
  _id: string;
  name: string;
  description?: string;
  deliveryInDays?: string;
  category?: { main?: string; sub?: string };
  options?: OptionType[];
  variants?: VariantType[];
  allImages?: string[];
};

export default function EditProductPage({
  product,
  categories,
}: {
  product: ProductType;
  categories: Categories[];
}) {
  const router = useRouter();

  // Prefill state from product
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [deliveryInDays, setDeliveryInDays] = useState(
    product?.deliveryInDays || ""
  );

  const [mainCategory, setMainCategory] = useState(
    product?.category?.main || ""
  );
  const [subCategory, setSubCategory] = useState(product?.category?.sub || "");

  const [newMain, setNewMain] = useState("");
  const [newSub, setNewSub] = useState("");

  const [options, setOptions] = useState<OptionType[]>(
    product?.options?.length ? product.options : []
  );

  const [variants, setVariants] = useState<VariantType[]>(
    product?.variants?.length ? product.variants : []
  );

  const [allImages, setAllImages] = useState<string[]>(
    product?.allImages?.length ? product.allImages : []
  );

  // Track raw input for option values
  const [optionInputs, setOptionInputs] = useState<string[]>(
    product?.options?.length
      ? product.options.map((opt) => opt.values.join(", "))
      : []
  );

  // CATEGORY: add main category (uses server action)
  const handleAddMain = async () => {
    if (!newMain.trim()) return alert("Enter main category");

    const form = new FormData();
    form.append("main", newMain);
    await addMainCategory(form);

    setNewMain("");
    router.refresh();
  };

  // CATEGORY: add subcategory (uses server action)
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

  // Options handlers
  const addOption = () => {
    setOptions((prev) => [...prev, { name: "", values: [] }]);
    setOptionInputs((prev) => [...prev, ""]);
  };

  const removeOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx));
    setOptionInputs((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateOptionName = (idx: number, nameVal: string) => {
    const updated = [...options];
    updated[idx].name = nameVal;
    setOptions(updated);
  };

  const updateOptionValues = (idx: number, csv: string) => {
    // Update the raw input
    const updatedInputs = [...optionInputs];
    updatedInputs[idx] = csv;
    setOptionInputs(updatedInputs);

    // Parse into array for the actual option
    const updated = [...options];
    updated[idx].values = csv
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    setOptions(updated);
  };

  // Variants handlers
  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      { combination: {}, price: "", stock: "", images: [] },
    ]);

  const removeVariant = (idx: number) =>
    setVariants((prev) => prev.filter((_, i) => i !== idx));

  const updateVariantField = (
    vi: number,
    field: "price" | "stock",
    value: string
  ) => {
    const updated = [...variants];
    updated[vi][field] = value;
    setVariants(updated);
  };

  const updateVariantCombination = (
    vi: number,
    optName: string,
    val: string
  ) => {
    const updated = [...variants];
    if (!updated[vi].combination) updated[vi].combination = {};
    updated[vi].combination[optName] = val;
    setVariants(updated);
  };

  const handleVariantImageSelect = (vi: number, imageUrl: string) => {
    const updated = [...variants];
    updated[vi].images = [imageUrl];
    setVariants(updated);
  };

  // Image upload
  const handleUploadImages = async (files: File[]) => {
    if (!files || files.length === 0) return;
    const uploaded: string[] = [];
    for (const file of files) {
      const imageUrl = await uploadImage(file);
      uploaded.push(imageUrl);
    }
    setAllImages((prev) => [...prev, ...uploaded]);
  };

  const removeAllImage = (idx: number) =>
    setAllImages((prev) => prev.filter((_, i) => i !== idx));

  // Submit update
  const handleSubmit = async () => {
    const payload = {
      name,
      description,
      deliveryInDays,
      category: { main: mainCategory, sub: subCategory },
      options,
      variants,
      allImages,
    };

    try {
      await updateProductAction(product._id, payload);
      router.push("/seller/dashboard/products");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Update failed");
    }
  };

  return (
    <div className="p-5 space-y-4">
      <h2 className="text-2xl">Edit Product</h2>
      <div className="flex flex-col gap-3">
        <label>
          Product name
          <input
            type="text"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
        <label>
          Description
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 h-24"
          />
        </label>
        <label>
          Delivery in days
          <input
            type="number"
            placeholder="Delivery in days"
            value={deliveryInDays}
            onChange={(e) => setDeliveryInDays(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
        </label>
      </div>

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

      <div>
        <label className="block font-semibold mb-2">Product Images</label>

        <div className="flex gap-3 flex-wrap">
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
                onClick={() => removeAllImage(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs w-5 h-5 rounded-full"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

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
            onClick={() => removeOption(i)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold"
          >
            ×
          </button>
          <h4 className="font-semibold">Add Option {i + 1}</h4>
          <input
            type="text"
            placeholder="Option Name (e.g. Color, Size)"
            value={opt.name}
            onChange={(e) => updateOptionName(i, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="Values (comma separated)"
            value={optionInputs[i] || ""}
            onChange={(e) => updateOptionValues(i, e.target.value)}
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

      {variants.map((variant, vi) => (
        <div key={vi} className="relative border p-3 rounded space-y-3">
          <button
            type="button"
            onClick={() => removeVariant(vi)}
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
                value={variant.combination?.[opt.name] || ""}
                onChange={(e) =>
                  updateVariantCombination(vi, opt.name, e.target.value)
                }
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
            onChange={(e) => updateVariantField(vi, "price", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          <input
            type="text"
            placeholder="Stock"
            value={variant.stock}
            onChange={(e) => updateVariantField(vi, "stock", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />

          <label className="block text-sm font-medium mb-1">Select Image</label>
          <div className="flex gap-2 flex-wrap">
            {allImages.map((img, idx) => {
              const selected = variant.images?.includes(img);
              return (
                <div
                  key={idx}
                  onClick={() => handleVariantImageSelect(vi, img)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    selected ? "border-blue-500" : "border-gray-300"
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
              );
            })}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 ml-2"
      >
        Update Product
      </button>
    </div>
  );
}
