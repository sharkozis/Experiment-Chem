import Text from "@/components/ui/Typography";
import BackButton from "@/components/ui/BackButton";
import SectionCard, { SectionData } from "@/components/SectionCard";
import { LevelData } from "@/components/LevelCard";
import Button from "@/components/ui/Button";
import Link from "next/link";
import labLevelsData from "@/../public/data/lab_levels.json";

interface PageProps {
  params: Promise<{ levelId: string }>;
}

export async function generateStaticParams() {
  return (labLevelsData as LevelData[]).map((level) => ({
    levelId: String(level.id),
  }));
}

export default async function LevelDetailPage({ params }: PageProps) {
  const { levelId } = await params;
  const numId = parseInt(levelId.replace(/\D/g, ""), 10) || parseInt(levelId, 10);
  const levels = labLevelsData as LevelData[];
  const level = levels.find((l) => l.id === numId);

  if (!level) {
    return (
      <div className="max-w-4xl mx-auto w-full min-h-full py-8 px-6 text-center flex flex-col gap-4 items-center">
        <BackButton href="/experiment" title="Back to Experiment" />
        <Text variant="h2" className="text-zinc-900 mt-4">Level Not Found</Text>
        <Text variant="body" className="text-zinc-500">
          The requested level could not be found.
        </Text>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full min-h-full py-6 px-6 animate-fade-in flex flex-col gap-6 font-sans">
      {/* Header controls */}
      <div className="flex w-full justify-start items-center">
        <BackButton href="/experiment" title="Back to Lab Levels" />
      </div>

      {/* Level Banner */}
      <div className="flex flex-col gap-1.5 border-b border-zinc-100 pb-5">
        <div className="flex items-center gap-3">
          <Text variant="h1" className="font-sans font-black tracking-tight text-[#1d1d1f]">
            {level.title}
          </Text>
          {!level.isLocked && (
            <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase leading-none">
              Active
            </span>
          )}
        </div>
        <Text variant="body" className="text-zinc-500 font-semibold text-xs md:text-sm">
          {level.subtitle}
        </Text>
      </div>

      {/* Content Area */}
      {level.isLocked ? (
        /* Locked State Screen */
        <div className="flex-1 flex flex-col items-center justify-center border border-zinc-200/50 rounded-3xl bg-white p-8 text-center shadow-sm min-h-[300px]">
          <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 shadow-sm mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight mb-1">
            Level {level.id} is Locked
          </h3>
          <p className="text-[11px] text-zinc-400 font-semibold max-w-[280px] leading-relaxed mb-5">
            To unlock virtual simulations and exams in this level, complete all sections inside Level 1.
          </p>
          <Link href="/experiment/1" className="inline-block">
            <Button
              variant="action"
              className="py-1.5 px-6 text-xs w-auto pl-5 pr-1.5 shadow-[0_2px_8px_rgba(0,113,227,0.15)]"
            >
              Go to Level 1
            </Button>
          </Link>
        </div>
      ) : (
        /* Sections list in full view grid */
        <div className="flex flex-col gap-4">
          <Text variant="caption" className="uppercase tracking-wider font-extrabold text-[10px] text-zinc-400 px-1">
            LEVEL {level.id} CONTENTS
          </Text>
          {level.sections && level.sections.length > 0 ? (
            <div className={`grid gap-4 ${level.sections.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
              {level.sections.map((section: SectionData) => (
                <SectionCard key={section.id} levelId={level.id} section={section} />
              ))}
            </div>
          ) : (
            <div className="w-full border border-zinc-200/60 rounded-3xl bg-white p-8 md:p-12 text-center shadow-sm flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-brand shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-base font-bold text-[#1d1d1f] tracking-tight">
                  Curriculum Coming Soon
                </h3>
                <p className="text-xs text-zinc-400 font-semibold max-w-sm leading-relaxed">
                  Interactive experiments and study material for &quot;{level.title}&quot; are currently being designed.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
