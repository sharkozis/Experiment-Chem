'use client';

import Link from "next/link";

export interface SectionData {
  id: number;
  title: string;
  description: string;
  category: string;
  time: string;
  xp: number;
}

interface SectionCardProps {
  levelId: number;
  section: SectionData;
}

export default function SectionCard({ levelId, section }: SectionCardProps) {
  return (
    <Link
      href={`/experiment/${levelId}/${section.id}`}
      className="rounded-2xl border border-zinc-200/60 bg-white p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-brand/40 hover:scale-[1.01] hover:shadow-md cursor-pointer block"
    >
      <div className="flex flex-col gap-1.5">
        {/* Header info */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[9px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded tracking-wider uppercase leading-none">
            {section.category}
          </span>
          <span className="text-[10px] text-zinc-400 font-bold tracking-tight">
            ⏱️ {section.time}
          </span>
        </div>

        {/* Title & Desc */}
        <h4 className="text-[14px] font-extrabold text-[#1d1d1f] tracking-tight mt-1 leading-snug">
          {section.id}. {section.title}
        </h4>
        <p className="text-[11px] text-zinc-400 font-semibold leading-relaxed">
          {section.description}
        </p>
      </div>

      {/* Actions & Rewards */}
      <div className="flex items-center justify-between border-t border-zinc-50 pt-3">
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
          ✨ +{section.xp} XP
        </span>
        <div className="px-3.5 py-1.5 bg-brand text-white rounded-lg font-bold text-[10px] tracking-wide uppercase shadow-sm shadow-brand/10">
          Enter Lab
        </div>
      </div>
    </Link>
  );
}
