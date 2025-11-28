import ProductItem from "./ProductItem";

export default async function FetchProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/by-category`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();

  return (
    <div className="p-6 bg-gray-50 flex flex-wrap gap-6 w-full h-screen relative">
      {data.map((cat) => (
        <div
          key={cat.mainCategory}
          className="rounded-2xl p-4 bg-gray-50 inline-flex flex-col"
        >
          {/* Category Title */}
          <h2 className="text-xl font-bold text-center text-black mb-4">
            {cat.mainCategory}
          </h2>

          {/* Products grid with consistent card width */}
          <div
            className={`grid gap-3 ${
              cat.items.length === 1
                ? "grid-cols-1"
                : cat.items.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
            style={{
              gridTemplateColumns:
                cat.items.length === 1
                  ? "240px"
                  : cat.items.length === 2
                  ? "repeat(2, 240px)"
                  : "repeat(3, 240px)",
            }}
          >
            {cat.items.map((item) => (
              <ProductItem item={item} key={item._id} variant="grid" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
