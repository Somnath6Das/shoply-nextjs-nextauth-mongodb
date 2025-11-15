import Logout from "@/components/Logout";
import Image from "next/image";

import { ReactNode } from "react";
import Leftbar from "@/components/Leftbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const menuItems = [
    { name: "Messages", icon: "MessageSquarePlus", path: "/admin/dashboard" },

    { name: "Sellers", icon: "UsersRound", path: "/admin/dashboard/sellers" },
  ];
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* ---------- HEADER ---------- */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        {/* Left: Logo + Admin text */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-lg font-semibold text-green-600 tracking-wide">
            Admin
          </h1>
        </div>

        {/* Right: Logout button */}
        <Logout path={"/admin"} />
      </header>

      {/* ---------- BODY ---------- */}
      <div className="flex flex-1">
        {/* LEFT SIDEBAR */}
        <Leftbar menuItems={menuItems} />

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
