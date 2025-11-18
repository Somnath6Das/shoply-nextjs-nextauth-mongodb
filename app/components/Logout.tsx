"use client";
import { signOut } from "next-auth/react";
import { useState } from "react";

const Logout = ({ path }: { path: string }) => {
  const [loading, setLoading] = useState(false);
  const handleLogout = () => {
    setLoading(true);
    try {
      signOut({
        redirect: true, // redirect after logout
        callbackUrl: path, // where to go after logout
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`px-5 py-2 text-sm font-medium text-white rounded-lg bg-black hover:bg-gray-800 transition ${
        loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        "Logout"
      )}
    </button>
  );
};

export default Logout;
