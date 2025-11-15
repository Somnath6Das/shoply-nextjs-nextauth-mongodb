"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/admin/dashboard", // specify where to redirect
      identifier: username,
      password,
    });

    if (result?.error) {
      console.log(result.error);
    } else {
      console.log("Login Successfully"); // redirect after login
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex items-center rounded-xl px-3 py-1">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="rounded"
          priority
        />
      </div>
      <form
        onSubmit={handleLogin}
        className="flex flex-col justify-center w-sm p-6 bg-white shadow-md shadow-gray-400 rounded-lg space-y-3 "
      >
        <h1 className="flex justify-center text-xl font-bold text-green-600 ">
          Admin Login
        </h1>
        <input
          className="border border-gray-200 p-2 w-full rounded-md"
          type="username"
          placeholder="Email"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border border-gray-200 p-2 w-full rounded-md"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded "
        >
          Login
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
