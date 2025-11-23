"use client";

import { useRouter } from "next/navigation";

export function ProductListPagination({
  page,
  totalPages,
  goToPage,
}: {
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
}) {
  const router = useRouter();

  const handleClick = (pnum: number) => {
    goToPage(pnum);
    // navigate to same route with ?page= to allow server to render that page if desired
    const search = new URLSearchParams(window.location.search);
    search.set("page", String(pnum));
    router.push(`${window.location.pathname}?${search.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <button
        disabled={page === 1}
        onClick={() => handleClick(Math.max(1, page - 1))}
        className={`px-3 py-1 rounded ${
          page === 1 ? "opacity-50" : "bg-gray-200"
        }`}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const pnum = i + 1;
        if (Math.abs(pnum - page) > 3 && pnum !== 1 && pnum !== totalPages)
          return null;
        return (
          <button
            key={pnum}
            onClick={() => handleClick(pnum)}
            className={`px-3 py-1 rounded ${
              pnum === page ? "bg-blue-600 text-white" : "bg-gray-100"
            }`}
          >
            {pnum}
          </button>
        );
      })}

      <button
        disabled={page === totalPages}
        onClick={() => handleClick(Math.min(totalPages, page + 1))}
        className={`px-3 py-1 rounded ${
          page === totalPages ? "opacity-50" : "bg-gray-200"
        }`}
      >
        Next
      </button>
    </div>
  );
}
