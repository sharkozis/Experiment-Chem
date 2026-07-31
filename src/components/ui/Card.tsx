import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className="relative w-full h-full rounded-2xl bg-zinc-200/50 p-[1px] shadow-sm">
      <div
        className={`relative flex w-full h-full flex-col justify-between overflow-hidden rounded-2xl bg-white p-8 text-[#1d1d1f] ${className}`}
        {...props}
      >
        {children}
      </div>
    </div>
  );
}
