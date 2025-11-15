"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquarePlus, UsersRound } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  MessageSquarePlus,
  UsersRound,
};

type Menu = {
  name: string;
  icon: string;
  path: string;
};

type LeftbarProps = {
  menuItems: Menu[];
};

export default function Leftbar({ menuItems }: LeftbarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r shadow-sm p-4 flex flex-col">
      <nav className="flex flex-col gap-2 mt-4">
        {menuItems.map(({ name, icon, path }) => {
          const Icon = iconMap[icon];

          return (
            <Link
              key={name}
              href={path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                pathname === path
                  ? "bg-green-100 text-green-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {Icon && <Icon size={18} />}
              {name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
