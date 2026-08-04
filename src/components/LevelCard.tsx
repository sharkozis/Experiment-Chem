'use client';

import Link from "next/link";
import toast from "react-hot-toast";

export interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  isLocked: boolean;
  color: string;
  sections: any[];
}

interface LevelCardProps {
  level: LevelData;
}

export default function LevelCard({ level }: LevelCardProps) {
  const sectionsCount = level.sections ? level.sections.length : 0;
  
  const content = (
    <div className={`flex items-center justify-between p-5 rounded-[15px] bg-white ${
      level.isLocked ? "opacity-85" : ""
    }`}>
      <div className="flex items-center gap-4">
        {/* Level Icon / Index */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
          level.isLocked
            ? "bg-zinc-50 border-zinc-100 text-zinc-400"
            : "bg-brand/10 border-brand/20 text-brand"
        }`}>
          {level.isLocked ? (
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          ) : (
            <span className="font-sans font-black text-sm">
              {level.id}
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-1 max-w-[240px] sm:max-w-md md:max-w-xl">
          <span className="text-[14px] font-extrabold tracking-tight text-[#1d1d1f] leading-tight">
            {level.title}
          </span>
          <span className="text-[11px] text-zinc-400 font-semibold leading-snug">
            {level.subtitle}
          </span>
        </div>
      </div>

      {/* Section Count Badge */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-extrabold text-zinc-400 bg-zinc-100 px-2.5 py-1.5 rounded-lg tracking-wider uppercase">
          {sectionsCount} SEC
        </span>
      </div>
    </div>
  );

  const className = `w-full text-left rounded-2xl transition-all duration-300 transform border p-[1px] cursor-pointer border-zinc-200/60 hover:border-brand/40 hover:scale-[1.01] hover:shadow-md block`;

  if (level.isLocked) {
    return (
      <div
        onClick={() => toast.error(`Level ${level.id} is locked. Complete all sections in Level 1 first!`)}
        className={className}
      >
        {content}
      </div>
    );
  }

  return (
    <Link href={`/experiment/${level.id}`} className={className}>
      {content}
    </Link>
  );
}
