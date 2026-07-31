import React from "react";

interface BadgeProps {
  variant?: "pill" | "highlight";
  className?: string;
  children: React.ReactNode;
}

export default function Badge({ variant = "pill", className = "", children }: BadgeProps) {
  if (variant === "highlight") {
    return (
      <span className={`bg-brand/10 text-brand text-[14px] font-bold px-4 py-2 rounded-lg tracking-wider flex items-center gap-1.5 ${className}`}>
        {children}
      </span>
    );
  }

  return (
    <span className={`bg-[#f2f2f7] text-[#515154] font-semibold text-[14px] px-3.5 py-2 rounded-lg border border-zinc-200/50 flex items-center gap-1.5 ${className}`}>
      {children}
    </span>
  );
}
