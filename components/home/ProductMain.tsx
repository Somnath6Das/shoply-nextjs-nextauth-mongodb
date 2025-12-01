// components/home/ProductMain.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type ProductRaw = any;

export default function ProductMain({
  product: rawProduct,
}: {
  product: ProductRaw;
}) {
  // Normalize DB data (trim values) to avoid mismatches like " 512gb"
  const product = useMemo(() => {
    const p = JSON.parse(JSON.stringify(rawProduct));
    // trim option values
    if (Array.isArray(p.options)) {
      p.options = p.options.map((opt: any) => ({
        ...opt,
        name: String(opt.name).trim(),
        values: Array.isArray(opt.values)
          ? opt.values.map((v: string) => String(v).trim())
          : [],
      }));
    } else {
      p.options = [];
    }

    // trim variant combination values and coerce numeric fields
    if (Array.isArray(p.variants)) {
      p.variants = p.variants.map((v: any) => {
        const comb: Record<string, string> = {};
        if (v.combination) {
          for (const k of Object.keys(v.combination)) {
            comb[k] = String(v.combination[k]).trim();
          }
        }
        return {
          ...v,
          combination: comb,
          price: typeof v.price === "string" ? v.price.trim() : v.price,
          stock: Number(String(v.stock ?? 0).trim()),
          images: Array.isArray(v.images)
            ? v.images.map((i: any) => String(i))
            : [],
          _id: v._id,
        };
      });
    } else {
      p.variants = [];
    }

    // ensure allImages array
    p.allImages = Array.isArray(p.allImages)
      ? p.allImages.map((i: any) => String(i))
      : [];

    // ensure deliveryInDays numeric
    p.deliveryInDays = Number(String(p.deliveryInDays ?? 0).trim());

    return p;
  }, [rawProduct]);

  // Local UI state
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string>
  >({});
  const [selectedVariant, setSelectedVariant] = useState<any | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  // On mount: if there is any natural default, set it to first variant (keeps UI filled)
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedVariant(product.variants[0]);
      setSelectedOptions(product.variants[0].combination);
      setQuantity(1);
    }
  }, [product]);

  // Helper: try to find the best variant given partial selections
  const findBestVariantFor = (partialSelection: Record<string, string>) => {
    const keys = Object.keys(partialSelection);
    if (keys.length === 0) return null;

    // 1) Try to find variant that matches ALL provided selected keys (exact match)
    const exactMatch = product.variants.find((v: any) =>
      Object.entries(partialSelection).every(
        ([k, val]) => v.combination[k] === val
      )
    );
    if (exactMatch) return exactMatch;

    // 2) If partial selection (not all options selected), find ANY variant that matches the provided keys
    // This enables auto-completing the rest of the options
    const partialMatch = product.variants.find((v: any) => {
      return keys.every((k) => v.combination[k] === partialSelection[k]);
    });

    return partialMatch || null;
  };

  // When user selects an option value:
  const handleOptionSelect = (optionName: string, value: string) => {
    const trimmed = String(value).trim();
    const updatedSelection = { ...selectedOptions, [optionName]: trimmed };

    // Try to find best variant that fits this partial selection
    const matched = findBestVariantFor(updatedSelection);

    if (matched) {
      // If matched, set selected options to full combination of found variant
      setSelectedVariant(matched);
      setSelectedOptions({ ...matched.combination });
      // reset quantity to 1 (safe)
      setQuantity(1);
    } else {
      // no matching variant: keep partial selection only
      setSelectedOptions(updatedSelection);
      setSelectedVariant(null);
      setQuantity(1);
    }
  };
  let displayImage = "";
  if (!selectedVariant || (selectedVariant && selectedVariant.stock === 0)) {
    displayImage = "/placeholder.png";
  } else {
    displayImage = selectedVariant?.images?.[0] ?? product.allImages?.[0];
  }
  // Display image: variant image if available otherwise first product image or placeholder

  // Delivery date: today + deliveryInDays
  const deliveryDateText = useMemo(() => {
    const days = Number(product.deliveryInDays || 0);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [product.deliveryInDays]);

  // Quantity options based on selectedVariant stock
  const maxStock = selectedVariant?.stock ?? 0;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (quantity > maxStock) setQuantity(Math.max(1, maxStock));
  }, [maxStock, quantity]);

  // Buy Now / Add to Cart handlers (implement with your own logic)
  const handleBuyNow = () => {
    if (!selectedVariant) {
      alert("Please select a valid variant");
      return;
    }
    // Example redirect to checkout with variant id and qty
    const vid = selectedVariant._id;
    console.log(vid);
    window.location.href = `/checkout?variantId=${encodeURIComponent(
      vid
    )}&qty=${quantity}`;
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      alert("Please select a valid variant");
      return;
    }
    // Implement your add to cart API call here.
    // Example: POST /api/cart { variantId, qty }
    alert(
      `Added ${quantity} of variant ${selectedVariant._id} to cart (implement API)`
    );
  };

  return (
    <div className="p-5 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Image + thumbnails */}
      <div>
        <div className="border rounded p-4 flex items-center justify-center">
          {/* using next/image, ensure displayImage is in allowed domains or local */}
          <Image
            src={displayImage}
            alt={product.name}
            width={600}
            height={600}
            className="object-contain"
          />
        </div>

        <div className="flex gap-3 mt-4">
          {Array.from(
            new Set([...(selectedVariant?.images ?? []), ...product.allImages])
          ).map((img: string, i: number) => (
            <button
              key={img + i}
              onClick={() => {
                // clicking a thumbnail should set that image as main (keep selectedVariant unchanged)
                setSelectedVariant((prev: any) => {
                  if (!prev) return { ...product.variants[0], images: [img] };
                  return { ...prev, images: [img] };
                });
              }}
              className="w-20 h-20 border rounded overflow-hidden"
            >
              <Image
                src={img}
                alt={`thumb-${i}`}
                width={80}
                height={80}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Info, options, qty, buy */}
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        {product.description && (
          <p className="text-gray-600 mt-2">{product.description}</p>
        )}

        <div className="mt-4">
          <div className="text-2xl font-bold">
            {selectedVariant ? (
              `₹${selectedVariant.price}`
            ) : (
              <span className="text-gray-400">Select options</span>
            )}
          </div>

          <div className="mt-2 text-sm text-gray-700">
            {selectedVariant ? (
              selectedVariant.stock > 0 ? (
                <span className="text-green-700 font-medium">
                  In stock ({selectedVariant.stock})
                </span>
              ) : (
                <span className="text-red-600 font-medium">Out of stock</span>
              )
            ) : (
              <span className="text-gray-400">Select options to see stock</span>
            )}
          </div>

          {!selectedVariant ||
          (selectedVariant && selectedVariant.stock === 0) ? (
            <div className="mt-2 text-sm text-red-700">
              Currently Not Avaiable
            </div>
          ) : (
            <div className="mt-2 text-sm text-blue-700">
              Delivery by <strong>{deliveryDateText}</strong>
            </div>
          )}
        </div>

        <hr className="my-5" />

        {/* Options selectors */}
        <div className="space-y-4">
          {product.options.map((opt: any) => (
            <div key={opt.name}>
              <div className="font-medium mb-2 capitalize">{opt.name}</div>
              <div className="flex gap-3 flex-wrap">
                {opt.values.map((v: string) => {
                  const val = String(v).trim();
                  const isSelected = selectedOptions[opt.name] === val;
                  return (
                    <button
                      key={opt.name + "-" + val}
                      onClick={() => handleOptionSelect(opt.name, val)}
                      className={`px-3 py-1 rounded border ${
                        isSelected
                          ? "bg-black text-white border-black"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quantity */}
        <div className="mt-6 flex items-center gap-4">
          <label className="font-medium">Quantity</label>
          <select
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            disabled={maxStock === 0}
            className="border p-2 rounded"
          >
            {Array.from({ length: Math.max(1, maxStock) }, (_, i) => i + 1).map(
              (q) => (
                <option key={q} value={q}>
                  {q}
                </option>
              )
            )}
          </select>
          <div className="text-sm text-gray-600">{maxStock} available</div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleBuyNow}
            disabled={
              !selectedVariant ||
              (selectedVariant && selectedVariant.stock === 0)
            }
            className={`w-full py-3 rounded font-semibold ${
              selectedVariant && selectedVariant.stock > 0
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Buy Now
          </button>

          <button
            onClick={handleAddToCart}
            disabled={
              !selectedVariant ||
              (selectedVariant && selectedVariant.stock === 0)
            }
            className={`w-full py-3 rounded font-semibold ${
              selectedVariant && selectedVariant.stock > 0
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-200 cursor-not-allowed"
            }`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
