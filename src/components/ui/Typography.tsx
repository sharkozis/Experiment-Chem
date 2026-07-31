import React from "react";

interface TextProps {
  variant?: "h1" | "h2" | "body" | "caption" | "symbol";
  className?: string;
  children: React.ReactNode;
}

export default function Text({ variant = "body", className = "", children }: TextProps) {
  const baseStyles = "font-sans antialiased tracking-tight";
  const variants = {
    h1: "text-[26px] md:text-[38px] lg:text-[42px] font-bold leading-tight tracking-tight text-[#1d1d1f]",
    h2: "text-[18px] md:text-[26px] lg:text-[28px] font-bold leading-snug tracking-tight text-[#1d1d1f]",
    body: "text-[13px] md:text-[16px] lg:text-[17px] font-medium leading-relaxed text-[#515154]",
    caption: "text-[11px] md:text-[14px] lg:text-[15px] font-semibold tracking-wide text-[#8e8e93]",
    symbol: "text-[54px] md:text-[110px] lg:text-[120px] font-bold leading-none tracking-tighter text-[#1d1d1f] select-none",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
