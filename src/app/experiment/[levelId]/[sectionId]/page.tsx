'use client';

import { useState, useEffect, use } from "react";
import Text from "@/components/ui/Typography";
import BackButton from "@/components/ui/BackButton";
import InteractivePuzzle from "@/components/InteractivePuzzle";
import { LevelData } from "@/components/LevelCard";
import { SectionData } from "@/components/SectionCard";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ levelId: string; sectionId: string }>;
}

export default function SectionDetailPage({ params }: PageProps) {
  const { levelId, sectionId } = use(params);
  const router = useRouter();

  const [level, setLevel] = useState<LevelData | null>(null);
  const [section, setSection] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/lab_levels.json")
      .then((res) => res.json())
      .then((data: LevelData[]) => {
        const foundLevel = data.find((l) => l.id === parseInt(levelId, 10));
        if (foundLevel) {
          setLevel(foundLevel);
          const foundSection = foundLevel.sections.find((s) => s.id === parseInt(sectionId, 10));
          if (foundSection) {
            setSection(foundSection);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load section details:", err);
        setLoading(false);
      });
  }, [levelId, sectionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (!level || !section) {
    return (
      <div className="max-w-4xl mx-auto w-full min-h-full py-8 px-6 text-center flex flex-col gap-4 items-center">
        <BackButton href={`/experiment/${levelId}`} title="Back to Level" />
        <Text variant="h2" className="text-zinc-900 mt-4">Experiment Not Found</Text>
        <Text variant="body" className="text-zinc-500">
          The requested lab experiment or simulation could not be found.
        </Text>
      </div>
    );
  }

  const isInteractivePuzzle = levelId === "1" && sectionId === "1";

  return (
    <div className="max-w-4xl mx-auto w-full min-h-full py-6 px-6 animate-fade-in flex flex-col gap-6 font-sans">
      {/* Header controls */}
      <div className="flex w-full justify-start items-center">
        <BackButton href={`/experiment/${levelId}`} title={`Back to Level ${levelId}`} />
      </div>

      {/* Title & Info Banner */}
      <div className="flex flex-col gap-2 border-b border-zinc-100 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-brand bg-brand/10 px-2 py-0.5 rounded tracking-wider uppercase">
            {section.category}
          </span>
          <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
            ⏱️ {section.time}
          </span>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
            ✨ +{section.xp} XP
          </span>
        </div>
        <Text variant="h1" className="font-sans font-black tracking-tight text-[#1d1d1f] mt-1">
          {section.title}
        </Text>
      </div>

      {/* Main Experiment Container */}
      <div className="w-full flex flex-col items-center justify-center">
        {isInteractivePuzzle ? (
          <div className="w-full animate-fade-in">
            <InteractivePuzzle
              onComplete={(xp) => {
                alert(`Congratulations! You earned ${xp} XP!`);
                router.push(`/experiment/${levelId}`);
              }}
            />
          </div>
        ) : (
          /* Placeholder Interface for Other Labs */
          <div className="w-full max-w-2xl border border-zinc-200/60 rounded-3xl bg-white p-8 md:p-12 text-center shadow-sm flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-[#1d1d1f] tracking-tight">
                Lab Simulation Under Construction
              </h3>
              <p className="text-xs text-zinc-400 font-semibold max-w-[360px] leading-relaxed">
                The virtual laboratory procedure for "{section.title}" is currently being prepared. Check back soon for interactive models!
              </p>
            </div>
            <div className="w-full bg-zinc-50 border border-zinc-100 rounded-2xl p-4 text-left">
              <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">
                Overview Procedure
              </span>
              <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
                {section.description}
              </p>
            </div>
            <button
              onClick={() => {
                alert(`Lab simulation completed! You earned ${section.xp} XP!`);
                router.push(`/experiment/${levelId}`);
              }}
              className="px-6 py-2.5 bg-brand hover:bg-brand-hover text-white rounded-full font-bold text-xs tracking-wide active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-brand/10 uppercase"
            >
              Simulate Completion (+{section.xp} XP)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
