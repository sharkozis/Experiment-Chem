'use client';

import { useState } from "react";
import Sidebar from "./Sidebar";
import Button from "./ui/Button";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex bg-[#f5f5f7] transition-colors duration-300">
      {/* Sidebar Navigation */}
      <div
        className={`transition-all duration-300 overflow-hidden flex shrink-0 ${
          isSidebarOpen ? "w-64 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <Sidebar onToggleSidebar={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-screen flex flex-col relative">
        {/* Header Bar (Consistently rendered with fixed height to prevent vertical jumps) */}
        <header className="h-16 flex items-center px-6 bg-white border-b border-zinc-200/50 shrink-0">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 border border-zinc-200/50 transition-all cursor-pointer flex items-center justify-center shadow-sm"
              title="Show Sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          )}
        </header>

        {/* Content Body */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
