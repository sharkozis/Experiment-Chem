'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Periodic Table", href: "/periodic-table" },
    { name: "Atom Info", href: "/atom-info" },
    { name: "Experiment", href: "/experiment" },
    { name: "About Us", href: "/about-us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between font-sans">
        {/* Left Side: Group Logo + Nav Links */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-9 w-9 rounded-xl bg-brand flex items-center justify-center text-white shrink-0 shadow-[0_4px_12px_rgba(0,113,227,0.25)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 3h6M10 3v6l-6 9a1.5 1.5 0 001.25 2.25h13.5A1.5 1.5 0 0020 18l-6-9V3" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-[15px] tracking-tight text-[#1d1d1f] leading-none group-hover:text-brand transition-colors duration-200">
                Experiment Chem
              </span>
              <span className="text-[8px] font-extrabold text-brand bg-brand/10 px-1.5 py-0.5 rounded tracking-wider select-none uppercase mt-1 w-fit leading-none">
                Beta
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            {menuItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-bold text-sm transition-colors duration-200 ${
                    isActive
                      ? "text-brand"
                      : "text-zinc-500 hover:text-[#1d1d1f]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Authentication */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-xs text-zinc-400 font-semibold px-3 py-1.5 bg-zinc-100/80 border border-zinc-200/50 rounded-full select-none flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 animate-pulse" />
            <span>Auth Offline</span>
          </div>
          <button
            className="px-4 py-1.5 bg-brand text-white font-bold text-xs rounded-full hover:bg-brand-hover active:scale-[0.98] transition-all cursor-pointer"
            onClick={() => alert("Authentication is not implemented yet!")}
          >
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
}
