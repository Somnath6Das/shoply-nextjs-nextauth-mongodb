"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      identifier: username,
      password,
    });

    if (result?.error) {
      alert(result.error);
    } else {
      alert("Login Successfully"); // redirect after login
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="p-6 bg-white shadow rounded space-y-3"
      >
        <h1 className="text-xl font-bold">Admin Login</h1>
        <input
          className="border p-2 w-full"
          type="username"
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        <p>{message}</p>
      </form>
    </div>
  );
}
