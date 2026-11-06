'use client';

import Navbar from "./Navbar";
import PageTransition from "./PageTransition";
import { Toaster } from "react-hot-toast";
import SoundEffects from "./SoundEffects";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col bg-[#f5f5f7] transition-colors duration-300 overflow-hidden" suppressHydrationWarning>
      <Toaster position="top-right" reverseOrder={false} />
      <SoundEffects />
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-scroll" suppressHydrationWarning>
        <PageTransition>{children}</PageTransition>
      </div>
    </div>
  );
}
