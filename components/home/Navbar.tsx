import Image from "next/image";
import Address from "./Address";
import SearchInput from "./SearchInput";
import { LogIn, ShoppingCart } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="flex flex-wrap gap-4 items-center justify-between bg-white/30 backdrop-blur-md shadow-lg rounded-2xl p-2 pr-4">
      {/* Logo */}
      <div className="flex items-center rounded-xl px-3 py-1">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={40}
          height={40}
          className="rounded"
          priority
        />
      </div>
      <Address />
      <SearchInput />
      <button className="flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:bg-green-50 hover:text-green-600 transition">
        <LogIn className="w-5 h-5" />
        <span className="text-sm font-medium">Login</span>
      </button>
      <div className="flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 cursor-pointer">
        <ShoppingCart className="w-5 h-5 transition-colors duration-200" />
        <span className="text-sm font-medium">Cart</span>
      </div>
    </nav>
  );
}
