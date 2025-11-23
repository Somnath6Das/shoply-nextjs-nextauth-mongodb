import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
};

export function ProductListPagination({ page, totalPages }: Props) {
  return (
    <div className="flex items-center gap-2 mt-4">
      {page > 1 && (
        <Link
          href={`?page=${page - 1}`}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Prev
        </Link>
      )}

      <span className="px-3 py-1 border rounded bg-gray-200">
        {page} / {totalPages}
      </span>

      {page < totalPages && (
        <Link
          href={`?page=${page + 1}`}
          className="px-3 py-1 border rounded hover:bg-gray-100"
        >
          Next
        </Link>
      )}
    </div>
  );
}
