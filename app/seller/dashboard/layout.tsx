import Logout from "@/components/Logout";
import Image from "next/image";
import { ReactNode } from "react";
import Leftbar from "@/components/Leftbar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const menuItems = [
    { name: "Orders", icon: "ShoppingCart", path: "/seller/dashboard" },
    { name: "Products", icon: "Package", path: "/seller/dashboard/products" },
    {
      name: "Categories",
      icon: "Grid2x2PlusIcon",
      path: "/seller/dashboard/categories",
    },
  ];

  return (
    // Layout takes full height and prevents layout scrolling
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* HEADER (fixed) */}
      <header className="flex-none flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <h1 className="text-lg font-semibold text-green-600 tracking-wide">
            Seller
          </h1>
        </div>
        <Logout path={"/seller"} />
      </header>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR (full height, never reduced) */}
        <div className="h-full flex-none">
          <Leftbar menuItems={menuItems} />
        </div>

        {/* MAIN CONTENT (scrollable only here) */}
        <main className="flex-1 h-full overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
