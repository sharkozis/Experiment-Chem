'use client';

import Navbar from "./Navbar";
import PageTransition from "./PageTransition";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-[#f5f5f7] transition-colors duration-300 overflow-hidden">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-scroll">
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
