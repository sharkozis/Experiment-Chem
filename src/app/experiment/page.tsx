'use client';

import { useState, useEffect } from "react";
import Text from "@/components/ui/Typography";
import LevelCard, { LevelData } from "@/components/LevelCard";
import labLevelsData from "@/../public/data/lab_levels.json";

export default function ExperimentPage() {
  const [levels, setLevels] = useState<LevelData[]>(labLevelsData as LevelData[]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/data/lab_levels.json")
      .then((res) => res.json())
      .then((data: LevelData[]) => {
        setLevels(data);
      })
      .catch((err) => {
        console.error("Failed to load levels data:", err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto w-full min-h-full py-6 px-6 animate-fade-in flex flex-col gap-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col gap-1.5 border-b border-zinc-100 pb-5">
        <Text variant="h1" className="font-sans font-black tracking-tight text-[#1d1d1f]">
          Virtual Chemistry Lab
        </Text>
        <Text variant="body" className="text-zinc-500 font-semibold text-xs md:text-sm">
          Select a level to browse simulations, practical procedures, and virtual experiments.
        </Text>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-10 h-10 border-4 border-zinc-200 border-t-brand rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Text variant="caption" className="uppercase tracking-wider font-extrabold text-[10px] text-zinc-400 px-1">
            LAB LEVELS
          </Text>
          <div className="flex flex-col gap-3">
            {levels.map((level) => (
              <LevelCard key={level.id} level={level} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
