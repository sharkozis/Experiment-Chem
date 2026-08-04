'use client';

import Link from "next/link";

interface BackButtonProps {
  href: string;
  title?: string;
}

export default function BackButton({ href, title = "Back" }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-zinc-500 hover:text-brand transition-all duration-200 active:scale-95 group"
      title={title}
    >
      <span className="w-8 h-8 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] group-hover:border-zinc-300 group-hover:scale-105 transition-all">
        <svg className="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </span>
    </Link>
  );
}
