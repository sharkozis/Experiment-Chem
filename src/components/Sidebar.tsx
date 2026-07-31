'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  onToggleSidebar?: () => void;
}

export default function Sidebar({ onToggleSidebar }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Periodic Table", href: "/periodic-table" },
    { name: "Atom Info", href: "/atom-info" },
    { name: "Experiment", href: "/experiment" },
    { name: "About Us", href: "/about-us" },
  ];

  return (
    <aside className="w-64 min-w-[256px] min-h-screen bg-white text-[#1d1d1f] flex flex-col justify-between border-r border-zinc-200/50 font-sans shrink-0">
      <div className="p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center text-white shrink-0 shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M10 3v6l-6 9a1.5 1.5 0 001.25 2.25h13.5A1.5 1.5 0 0020 18l-6-9V3" />
            </svg>
          </div>
          <div className="flex flex-col shrink-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[15px] tracking-tight text-[#1d1d1f] leading-tight">
                Experiment Chem
              </span>
              {onToggleSidebar && (
                <button
                  onClick={onToggleSidebar}
                  className="p-1 rounded-lg text-zinc-300 hover:text-zinc-600 hover:bg-zinc-100 transition-all cursor-pointer"
                  title="Hide Sidebar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}
            </div>
            <span className="text-[9px] font-extrabold text-brand bg-brand/10 px-1.5 py-0.5 rounded tracking-wider select-none uppercase mt-1 w-fit">
              Beta
            </span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-xl font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-brand text-white"
                    : "text-zinc-500 hover:text-[#1d1d1f] hover:bg-zinc-100"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-6 border-t border-zinc-100 text-xs text-zinc-400 font-medium">
        © 2026 Chemistry Lab
      </div>
    </aside>
  );
}
