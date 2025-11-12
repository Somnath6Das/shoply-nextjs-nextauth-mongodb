"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import SellerMsgForm from "@/components/seller/SellerMsgForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🟣 Seller Login Function (axios)
  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "/api/seller/login",
        { email, password },
        { validateStatus: () => true }
      );
      // 👆 This prevents Axios from throwing errors for 4xx or 5xx

      if (res.status === 200 && res.data.success) {
        setMessage("✅ Login successful! Redirecting...");
        e.target.reset();
        setTimeout(() => router.push("/seller/dashboard"), 800);
      } else {
        setMessage(res.data.error || "❌ Invalid credentials");
      }
    } catch (err) {
      console.error("Login failed:", err.message);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm px-6 py-3 flex items-center">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition"
        >
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </Link>
      </nav>

      {/* Main Section */}
      <div className="flex flex-col md:flex-row flex-1 items-center justify-center px-4 py-8 gap-8">
        {/* Left Image */}
        <div className="flex justify-center">
          <Image
            src={
              activeTab === "login" ? "/images/login.png" : "/images/seller.png"
            }
            alt="Auth Image"
            width={300}
            height={300}
            className="object-contain rounded-xl shadow
                        w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] md:w-[300px] md:h-[300px]
                        transition-all duration-300"
          />
        </div>

        {/* Right Section */}
        <div className="w-full md:w-[420px] bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b w-full">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-3 text-base sm:text-lg font-medium border-r transition-colors duration-200 ${
                activeTab === "login"
                  ? "bg-gray-100 text-[#5e3e89]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("seller")}
              className={`flex-1 py-3 text-base sm:text-lg font-medium transition-colors duration-200 ${
                activeTab === "seller"
                  ? "bg-gray-100 text-[#5cca01]"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Become a Seller
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 md:p-8 w-full">
            {activeTab === "login" ? (
              <form className="space-y-4 w-full" onSubmit={handleLogin}>
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-1">
                    Email
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base
                                        focus:outline-none focus:ring-2 focus:ring-[#5e3e89]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm sm:text-base font-medium mb-1">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    className="w-full border rounded-lg px-3 py-2 text-sm sm:text-base
                                        focus:outline-none focus:ring-2 focus:ring-[#5e3e89]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center items-center gap-2 bg-[#5e3e89] text-white py-2 sm:py-3 rounded-lg transition text-sm sm:text-base font-medium ${
                    loading
                      ? "opacity-60 cursor-not-allowed"
                      : "hover:bg-[#392655]"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Login"
                  )}
                </button>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {message}
                </p>
                <div className="text-center">
                  <Link
                    href="/seller/forget-password"
                    className="text-sm sm:text-base text-[#5e3e89] hover:underline hover:text-[#392655] transition"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>
            ) : (
              <SellerMsgForm />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
