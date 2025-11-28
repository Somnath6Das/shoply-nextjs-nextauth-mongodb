"use client";

import { signOut } from "next-auth/react";

export default function Profile() {
  return (
    <div className="bg-gray-50 h-screen">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="px-4 py-2 bg-red-600 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
