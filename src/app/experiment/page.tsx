'use client';

import { useState } from "react";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import InteractivePuzzle from "@/components/InteractivePuzzle";

interface Level {
  id: number;
  title: string;
  subtitle: string;
  sectionsCount: number;
  isLocked: boolean;
  color: string;
}

interface Section {
  id: number;
  title: string;
  description: string;
  category: string;
  time: string;
  xp: number;
}

const levels: Level[] = [
  { id: 1, title: "Level 1: Chemical Foundations", subtitle: "Basic safety, matter, and laboratory skills", sectionsCount: 8, isLocked: false, color: "from-blue-500/10 to-indigo-500/10 border-blue-200/50 text-blue-600" },
  { id: 2, title: "Level 2: Reactions & Equations", subtitle: "Stoichiometry, synthesis, and double displacement", sectionsCount: 6, isLocked: true, color: "from-amber-500/5 to-orange-500/5 border-zinc-200/50 text-zinc-400" },
  { id: 3, title: "Level 3: Acids, Bases & pH", subtitle: "Titrations, indicators, and salt formations", sectionsCount: 6, isLocked: true, color: "from-emerald-500/5 to-teal-500/5 border-zinc-200/50 text-zinc-400" },
  { id: 4, title: "Level 4: States of Matter", subtitle: "Gas laws, phase changes, and kinetic theory", sectionsCount: 5, isLocked: true, color: "from-purple-500/5 to-pink-500/5 border-zinc-200/50 text-zinc-400" },
  { id: 5, title: "Level 5: Atomic Structure", subtitle: "Quantum numbers, electron configuration, and orbits", sectionsCount: 5, isLocked: true, color: "from-cyan-500/5 to-sky-500/5 border-zinc-200/50 text-zinc-400" },
  { id: 6, title: "Level 6: Thermodynamics", subtitle: "Enthalpy, entropy, calorimetry, and free energy", sectionsCount: 4, isLocked: true, color: "from-red-500/5 to-rose-500/5 border-zinc-200/50 text-zinc-400" },
  { id: 7, title: "Level 7: Electrochemistry", subtitle: "Galvanic cells, electrolysis, and redox reactions", sectionsCount: 5, isLocked: true, color: "from-violet-500/5 to-fuchsia-500/5 border-zinc-200/50 text-zinc-400" },
  { id: 8, title: "Level 8: Organic Synthesis", subtitle: "Hydrocarbons, functional groups, and esters", sectionsCount: 6, isLocked: true, color: "from-lime-500/5 to-green-500/5 border-zinc-200/50 text-zinc-400" },
];

const level1Sections: Section[] = [
  { id: 1, title: "Relationship of P, E, N, Z, A", description: "Learn how protons, electrons, neutrons, atomic number, and mass connect.", category: "Core Theory", time: "5 min", xp: 100 },
  { id: 2, title: "Classification of Matter", description: "Distinguish between elements, compounds, and various types of mixtures.", category: "Matter Theory", time: "10 min", xp: 100 },
  { id: 3, title: "Metric Measurements", description: "Practice precise readings of liquid volumes, temperature, and analytical balances.", category: "Practical Skills", time: "10 min", xp: 100 },
  { id: 4, title: "Simple Thermal Distillation", description: "Set up a distillation rig to isolate pure water from a saline solution.", category: "Separation Lab", time: "15 min", xp: 150 },
  { id: 5, title: "Chemical vs Physical Changes", description: "Identify indicators of reaction: gas evolution, color shift, and precipitate.", category: "Reactivity", time: "12 min", xp: 120 },
  { id: 6, title: "Paper Chromatography", description: "Separate ink pigments using moving phases and calculate precise Rf values.", category: "Separation Lab", time: "15 min", xp: 150 },
  { id: 7, title: "Conservation of Mass", description: "Verify that total mass remains constant during a precipitation reaction.", category: "Quantitative Lab", time: "12 min", xp: 120 },
  { id: 8, title: "Lab Clean Up & Disposal", description: "Learn safe neutralization of chemicals and standard laboratory waste protocol.", category: "Lab Safety", time: "8 min", xp: 80 },
];

export default function ExperimentPage() {
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [activeSimulationId, setActiveSimulationId] = useState<number | null>(null);
  const [accumulatedXp, setAccumulatedXp] = useState<number>(0);

  const activeLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];

  return (
    <div className="max-w-7xl mx-auto w-full min-h-full py-6 px-6 animate-fade-in flex flex-col gap-6 font-sans">
      {/* Title Header */}
      <div className="flex flex-col gap-1.5 border-b border-zinc-100 pb-5">
        <Text variant="h1" className="font-sans font-black tracking-tight text-[#1d1d1f]">
          Virtual Chemistry Lab
        </Text>
        <Text variant="body" className="text-zinc-500 font-semibold text-xs md:text-sm">
          Select a level to browse simulations, practical procedures, and virtual experiments.
        </Text>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: 8 Levels Column */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <Text variant="caption" className="uppercase tracking-wider font-extrabold text-[10px] text-zinc-400 px-1">
            LAB LEVELS
          </Text>
          <div className="flex flex-col gap-3">
            {levels.map((level) => {
              const isSelected = selectedLevelId === level.id;
              return (
                <button
                  key={level.id}
                  onClick={() => {
                    setSelectedLevelId(level.id);
                    setActiveSimulationId(null);
                  }}
                  className={`w-full text-left rounded-2xl transition-all duration-300 transform border p-[1px] cursor-pointer ${
                    isSelected
                      ? "border-brand shadow-sm scale-[1.01]"
                      : "border-zinc-200/50 hover:border-zinc-300/80"
                  }`}
                >
                  <div className={`flex items-center justify-between p-4 rounded-[15px] bg-white ${
                    level.isLocked ? "opacity-75" : ""
                  }`}>
                    <div className="flex items-center gap-3.5">
                      {/* Level Icon / Index */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border transition-all ${
                        isSelected
                          ? "bg-brand/10 border-brand/20 text-brand"
                          : level.isLocked
                          ? "bg-zinc-50 border-zinc-100 text-zinc-400"
                          : "bg-emerald-50 border-emerald-100 text-emerald-600"
                      }`}>
                        {level.isLocked ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                          </svg>
                        ) : (
                          <span className="font-sans font-black text-xs">
                            {level.id}
                          </span>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col gap-0.5 max-w-[200px] sm:max-w-xs md:max-w-md">
                        <span className={`text-[13px] font-bold tracking-tight leading-none transition-colors duration-200 ${
                          isSelected ? "text-brand" : "text-[#1d1d1f]"
                        }`}>
                          {level.title}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-semibold leading-tight line-clamp-1">
                          {level.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Section Count Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-extrabold text-zinc-400 bg-zinc-100 px-2 py-1 rounded-md tracking-wider">
                        {level.sectionsCount} SEC
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Level Contents / Simulation Play */}
        <div className="lg:col-span-7 flex flex-col gap-3 min-h-[480px]">
          {activeSimulationId === 1 ? (
            <div className="flex flex-col gap-4 animate-fade-in w-full">
              <div className="flex items-center justify-between px-1">
                <button
                  onClick={() => setActiveSimulationId(null)}
                  className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-zinc-400 hover:text-zinc-700 transition-colors uppercase tracking-wider cursor-pointer"
                >
                  ← Back to Level Contents
                </button>
                {accumulatedXp > 0 && (
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase leading-none">
                    ⭐ Total XP: {accumulatedXp}
                  </span>
                )}
              </div>
              <InteractivePuzzle
                onComplete={(xp) => {
                  setAccumulatedXp((prev) => prev + xp);
                  setActiveSimulationId(null);
                }}
              />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-1">
                <Text variant="caption" className="uppercase tracking-wider font-extrabold text-[10px] text-zinc-400">
                  LEVEL {activeLevel.id} CONTENT
                </Text>
                {!activeLevel.isLocked && (
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase leading-none">
                    Active
                  </span>
                )}
              </div>

              {activeLevel.isLocked ? (
                /* Locked State Screen */
                <div className="flex-1 flex flex-col items-center justify-center border border-zinc-200/50 rounded-3xl bg-white p-8 text-center shadow-sm min-h-[400px]">
                  <div className="w-14 h-14 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 shadow-sm mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-bold text-[#1d1d1f] tracking-tight mb-1">
                    Level {activeLevel.id} is Locked
                  </h3>
                  <p className="text-[11px] text-zinc-400 font-semibold max-w-[280px] leading-relaxed mb-5">
                    To unlock virtual simulations and exams in this level, complete all 8 sections inside Level 1.
                  </p>
                  <Button
                    variant="action"
                    className="py-1.5 px-6 text-xs w-auto pl-5 pr-1.5 shadow-[0_2px_8px_rgba(0,113,227,0.15)]"
                    onClick={() => setSelectedLevelId(1)}
                  >
                    Go to Level 1
                  </Button>
                </div>
              ) : (
                /* Level 1 (or Unlocked) Sections Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {level1Sections.map((section) => (
                    <div
                      key={section.id}
                      className="rounded-2xl border border-zinc-200/50 bg-white p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:border-brand/40 hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(0,0,0,0.02)]"
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
                        <button
                          className="px-3.5 py-1.5 bg-brand hover:bg-brand-hover text-white rounded-lg font-bold text-[10px] tracking-wide active:scale-[0.98] transition-all cursor-pointer shadow-sm uppercase shadow-brand/10"
                          onClick={() => {
                            if (section.id === 1) {
                              setActiveSimulationId(1);
                            } else {
                              alert(`Starting simulation: ${section.title}`);
                            }
                          }}
                        >
                          Enter Lab
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
