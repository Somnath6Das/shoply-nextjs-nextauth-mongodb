import Image from "next/image";
type Variant = "grid" | "compact" | "card";

interface ProductItemProps {
  item: {
    name: string;
    allImages?: string[];
    minPrice?: number;
    maxPrice?: number;
    variants: { price: number }[];
    category: { sub: string };
  };
  variant?: Variant;
}

export default function ProductItem({
  item,
  variant = "grid",
}: ProductItemProps) {
  // Define size variants for different use cases
  const sizeClasses: Record<Variant, string> = {
    grid: "w-full", // For grid layouts (SearchPage, CategoryProducts)
    compact: "w-[200px]", // Compact fixed size
    card: "w-[240px]", // Medium card size
  };

  return (
    <div
      className={`rounded-md p-3 bg-white shadow-sm transition-shadow overflow-hidden hover:shadow-md ${sizeClasses[variant]}`}
    >
      <div className="rounded-md overflow-hidden w-full h-40 mb-3 bg-white flex items-center justify-center">
        {item.allImages?.[0] ? (
          <Image
            height={100}
            width={100}
            src={item.allImages[0]}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2 min-h-10">
          {item.name}
        </h3>

        <div className="flex items-baseline gap-2 font-bold text-gray-900">
          <span>
            {item.minPrice
              ? `₹${item.minPrice.toLocaleString("en-IN")}`
              : `₹${item.variants[0].price?.toLocaleString("en-IN")}`}
          </span>
          {typeof item.minPrice === "number" &&
            typeof item.maxPrice === "number" &&
            item.maxPrice !== item.minPrice && (
              <span className="text-sm font-normal text-gray-500">
                - ₹{item.maxPrice.toLocaleString("en-IN")}
              </span>
            )}
        </div>

        <p className="text-xs text-gray-500">{item.category.sub}</p>

        <p className="text-sm text-gray-700">FREE Delivery by Shoply</p>
      </div>
    </div>
  );
}
