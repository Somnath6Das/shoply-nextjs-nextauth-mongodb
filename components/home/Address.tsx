import { MapPin } from "lucide-react";
import Link from "next/link";

export default function Address({ user = null }) {
  return (
    <Link href="/address">
      <div className="flex items-center bg-gray-200/40 rounded-xl px-3 py-1 space-x-2 hover:bg-green-50 hover:text-green-600 transition-colors duration-200 cursor-pointer">
        <MapPin className="w-5 h-5 transition-colors duration-200" />
        <div className="text-sm leading-tight">
          <p className="font-medium">Delivery to</p>
          <p className="font-semibold">700145</p>
        </div>
      </div>
    </Link>
  );
}
