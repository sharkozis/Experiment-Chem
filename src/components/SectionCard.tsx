'use client';

import Link from "next/link";

export interface SectionData {
  id: number;
  title: string;
  description: string;
  category: string;
  time: string;
  xp: number;
  image?: string;
  actionText?: string;
}

interface SectionCardProps {
  levelId: number;
  section: SectionData;
}

export default function SectionCard({ levelId, section }: SectionCardProps) {
  const hasImage = Boolean(section.image);

  return (
    <Link
      href={`/experiment/${levelId}/${section.id}`}
      className="group rounded-[28px] border border-zinc-200/70 bg-white p-6 sm:p-7 md:p-8 flex flex-col justify-between transition-all duration-300 hover:border-brand/40 hover:shadow-[0_8px_30px_rgba(0,113,227,0.08)] hover:-translate-y-0.5 cursor-pointer block relative overflow-hidden"
    >
      {/* Top Section: Title, Description & Optional Graphic */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2 max-w-xl">
          <h3 className="text-[19px] sm:text-[22px] font-bold text-[#1d1d1f] tracking-tight leading-snug group-hover:text-brand transition-colors">
            {section.id}. {section.title}
          </h3>
          <p className="text-[13px] sm:text-[14px] text-zinc-600 font-normal leading-relaxed">
            {section.description}
          </p>
        </div>

        {/* Right Illustration */}
        {hasImage && (
          <div className="shrink-0 -mt-2 -mr-1">
            <img
              src={section.image}
              alt={section.title}
              className="w-24 sm:w-32 md:w-36 h-auto object-contain select-none pointer-events-none transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
      </div>

      {/* Bottom Section: Badges & Action CTA */}
      <div className="flex items-center justify-between border-t border-zinc-100/80 pt-5 mt-6 gap-3 flex-wrap">
        {/* Left: Star XP pill + divider + Time pill */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* XP Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-[#558c14] bg-[#edf8d3] border border-[#cbe880]">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{section.xp} XP</span>
          </span>

          {/* Divider */}
          <span className="h-4 w-[1px] bg-zinc-200" />

          {/* Time Pill */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#2563eb] bg-[#eff6ff] border border-[#bfdbfe]">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{section.time}</span>
          </span>
        </div>

        {/* Right: Explore Button */}
        <div className="inline-flex items-center justify-center px-6 py-2 rounded-full text-xs md:text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.98] transition-all shadow-sm shadow-blue-500/20">
          {section.actionText || "Explore"}
        </div>
      </div>
    </Link>
  );
}
