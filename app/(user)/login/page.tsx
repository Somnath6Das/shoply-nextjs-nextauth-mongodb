"use client";
import LoginView from "@/components/home/LoginView";
import axios from "axios";
import Form from "next/form";
import { useState } from "react";

export default function Login() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent page reload
    setLoading(true);
    setMessage("");

    // ✅ Access inputs using "name" attributes
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    try {
      const res = await axios.post(
        "/api/user/login",
        { email, password },
        { validateStatus: () => true }
      );

      if (res.status === 200 && res.data.success) {
        setMessage("✅ Login successful!");
        e.target.reset(); // clear the form
      } else {
        setMessage(res.data.error || "❌ Invalid credentials");
      }
    } catch (err: any) {
      console.error("Login failed:", err.message);
      setMessage("⚠️ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginView>
      <Form action={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          name="email" // ✅ Important for e.target.email
          placeholder="Email"
          required
          className="p-2 rounded-lg border border-gray-300 focus:border-green-500 outline-none bg-white/70"
        />
        <input
          type="password"
          name="password" // ✅ Important for e.target.password
          placeholder="Password"
          required
          className="p-2 rounded-lg border border-gray-300 focus:border-green-500 outline-none bg-white/70"
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-2 rounded-lg text-white transition ${
            loading
              ? "bg-green-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p
            className={`text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </Form>
    </LoginView>
  );
}
