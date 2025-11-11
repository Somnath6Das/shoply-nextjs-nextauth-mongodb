"use client";

import { signOut } from "next-auth/react";

export default function AdminDashboard() {
  const handleLogout = () => {
    signOut({
      redirect: true, // redirect after logout
      callbackUrl: "/admin", // where to go after logout
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Admin Dashboard 👋</h1>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Logout
      </button>
    </div>
  );
}
