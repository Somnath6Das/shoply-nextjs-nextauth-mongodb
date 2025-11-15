"use client";

import { useRouter } from "next/navigation";

import { useSearchParams } from "next/navigation";

export default function LoginClientPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const router = useRouter();

  return (
    <div className="flex flex-col  justify-center items-center h-screen">
      {error && <h2 className="text-2xl font-bold text-red-400">{error}</h2>}

      <button
        onClick={() => router.back()}
        style={{
          padding: "8px 12px",
          marginTop: "20px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      >
        Go Back
      </button>
    </div>
  );
}
