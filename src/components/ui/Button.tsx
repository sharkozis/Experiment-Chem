import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "action" | "toggle";
  children: React.ReactNode;
}

export default function Button({ variant = "action", children, className = "", ...props }: ButtonProps) {
  if (variant === "toggle") {
    return (
      <button
        className={`p-3.5 rounded-full bg-white text-[#1d1d1f] hover:bg-zinc-50 border border-zinc-200 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.06)] active:scale-95 flex items-center justify-center shrink-0 cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`bg-brand hover:bg-brand-hover text-white flex items-center justify-between gap-3 py-2 pl-6 pr-2 rounded-full w-full transition-all font-semibold text-[15px] tracking-tight active:scale-[0.98] cursor-pointer ${className}`}
      {...props}
    >
      <span>{children}</span>
      <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-brand shadow-sm">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </span>
    </button>
  );
}
