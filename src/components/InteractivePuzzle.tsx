'use client';

import { useState } from "react";
import Text from "@/components/ui/Typography";

interface Puzzle {
  id: number;
  question: string;
  p: string | number; // Proton
  e: string | number; // Electron
  n: string | number; // Neutron
  z: string | number; // Atomic Number
  a: string | number; // Mass Number
  missingKey: 'p' | 'e' | 'n' | 'z' | 'a';
  correctValue: string;
  options: string[];
  hint: string;
  explanation: string;
}

const puzzles: Puzzle[] = [
  {
    id: 1,
    question: "Find the missing Electron count for a neutral Carbon atom.",
    p: 6,
    e: "?",
    n: 6,
    z: 6,
    a: 12,
    missingKey: 'e',
    correctValue: "6",
    options: ["4", "6", "12", "14"],
    hint: "For any neutral atom, the number of negatively charged Electrons (E) is exactly equal to the number of positively charged Protons (P).",
    explanation: "Since the atom is neutral, the positive charge of 6 protons must be balanced by exactly 6 negative electrons. Therefore, Electron (E) = Proton (P) = 6."
  },
  {
    id: 2,
    question: "Calculate the number of Neutrons in this Oxygen isotope.",
    p: 8,
    e: 8,
    n: "?",
    z: 8,
    a: 16,
    missingKey: 'n',
    correctValue: "8",
    options: ["6", "8", "16", "24"],
    hint: "Mass Number (A) is the sum of Protons (P) and Neutrons (N). Therefore, Neutrons (N) = Mass Number (A) - Proton count (P).",
    explanation: "Neutrons are calculated by subtracting the protons from the total mass number: N = A - P. Here, N = 16 - 8 = 8 neutrons."
  },
  {
    id: 3,
    question: "Identify the Mass Number (A) for a Sodium atom.",
    p: 11,
    e: 11,
    n: 12,
    z: 11,
    a: "?",
    missingKey: 'a',
    correctValue: "23",
    options: ["11", "12", "22", "23"],
    hint: "Mass Number (A) represents the total number of heavy particles in the nucleus. Add Protons (P) and Neutrons (N) together.",
    explanation: "The mass number A is the total count of protons and neutrons in the nucleus: A = P + N. In this case, A = 11 + 12 = 23."
  },
  {
    id: 4,
    question: "Find the Atomic Number (Z) of this Chlorine atom.",
    p: 17,
    e: 17,
    n: 18,
    z: "?",
    a: 35,
    missingKey: 'z',
    correctValue: "17",
    options: ["17", "18", "35", "52"],
    hint: "Atomic Number (Z) defines the element's identity and is equal to the number of Protons (P) in the nucleus.",
    explanation: "Atomic Number (Z) is always identical to the proton count (P). Since there are 17 protons, the atomic number Z must be 17."
  },
  {
    id: 5,
    question: "Solve for the missing Proton (P) count for this Nitrogen atom.",
    p: "?",
    e: 7,
    n: 7,
    z: 7,
    a: 14,
    missingKey: 'p',
    correctValue: "7",
    options: ["7", "14", "21", "28"],
    hint: "The Proton count (P) is always equal to the Atomic Number (Z), which also matches the Electron count (E) in a neutral atom.",
    explanation: "The number of protons P is determined directly by the atomic number Z. Since Z = 7, the proton count P must be 7."
  }
];

export default function InteractivePuzzle({ onComplete }: { onComplete: (xp: number) => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [droppedValue, setDroppedValue] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [shaking, setShaking] = useState(false);

  const currentPuzzle = puzzles[currentIndex];

  const handleDragStart = (e: React.DragEvent, value: string) => {
    e.dataTransfer.setData("text/plain", value);
    setSelectedChip(value);
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const value = e.dataTransfer.getData("text/plain") || selectedChip;
    if (value) {
      submitAnswer(value);
    }
  };

  const handleChipClick = (value: string) => {
    if (isCorrect) return;
    setSelectedChip(value);
    submitAnswer(value);
  };

  const submitAnswer = (value: string) => {
    setDroppedValue(value);
    if (value === currentPuzzle.correctValue) {
      setIsCorrect(true);
      setXpEarned((prev) => prev + 20);
      setShowExplanation(true);
    } else {
      setIsCorrect(false);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setTimeout(() => {
        setDroppedValue(null);
        setIsCorrect(null);
        setSelectedChip(null);
      }, 1200);
    }
  };

  const handleContinue = () => {
    if (currentIndex < puzzles.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setDroppedValue(null);
      setIsCorrect(null);
      setSelectedChip(null);
      setShowHint(false);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
      onComplete(xpEarned);
    }
  };

  const progressPercent = ((currentIndex + (isCorrect ? 1 : 0)) / puzzles.length) * 100;

  if (isCompleted) {
    return (
      <div className="w-full max-w-md mx-auto border border-zinc-900 bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-md select-none">
        <div className="w-16 h-16 rounded-full border border-zinc-900 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-zinc-900" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296 3.745 3.745 0 01-1.043-3.296A3.746 3.746 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <Text variant="h2" className="text-zinc-950 font-black tracking-tight mb-2">
          Lab Challenge Complete!
        </Text>
        <Text variant="body" className="text-zinc-500 font-semibold mb-6">
          You have mastered the relationship between protons, electrons, neutrons, mass, and atomic number.
        </Text>

        <div className="border border-zinc-200 bg-zinc-50 rounded-2xl px-6 py-3 mb-6 flex items-center gap-2">
          <span className="text-xs font-black text-zinc-800">REWARD:</span>
          <span className="text-xs font-extrabold text-zinc-900 border border-zinc-900/10 bg-white px-2 py-0.5 rounded">
            ✨ +{xpEarned} XP
          </span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-zinc-900 text-white rounded-xl font-bold text-xs tracking-wider active:scale-[0.98] transition-all cursor-pointer border border-zinc-950 uppercase"
        >
          Return to Lab Overview
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto border border-zinc-200 bg-white p-6 rounded-3xl flex flex-col gap-6 shadow-sm select-none">
      {/* Lesson Header & Progress */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest">
            Level 1 - Section 1 Lab
          </span>
          <span className="text-[10px] font-bold text-zinc-500">
            Puzzle {currentIndex + 1} of {puzzles.length}
          </span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/30">
          <div 
            className="h-full bg-zinc-900 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question instruction */}
      <div className="px-1">
        <Text variant="body" className="text-zinc-800 font-bold text-[14px] leading-snug">
          {currentPuzzle.question}
        </Text>
      </div>

      {/* Main Puzzle Card */}
      <div className="border border-zinc-200 bg-zinc-50/50 rounded-2xl p-5 flex flex-col gap-4">
        {/* Element / Variables list */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Variable Row: Z */}
          <div className="flex items-center justify-between border border-zinc-200/60 bg-white px-3.5 py-2.5 rounded-xl">
            <span className="text-[11px] font-bold text-zinc-400">Atomic Number (Z)</span>
            <div className="text-xs font-black text-zinc-800">
              {currentPuzzle.missingKey === 'z' ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`w-10 h-6 border-2 border-dashed rounded-md flex items-center justify-center transition-all ${
                    shaking ? "animate-shake border-zinc-900" : ""
                  } ${
                    isCorrect && droppedValue ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300"
                  }`}
                >
                  {droppedValue || "?"}
                </div>
              ) : (
                currentPuzzle.z
              )}
            </div>
          </div>

          {/* Variable Row: A */}
          <div className="flex items-center justify-between border border-zinc-200/60 bg-white px-3.5 py-2.5 rounded-xl">
            <span className="text-[11px] font-bold text-zinc-400">Mass Number (A)</span>
            <div className="text-xs font-black text-zinc-800">
              {currentPuzzle.missingKey === 'a' ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`w-10 h-6 border-2 border-dashed rounded-md flex items-center justify-center transition-all ${
                    shaking ? "animate-shake border-zinc-900" : ""
                  } ${
                    isCorrect && droppedValue ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300"
                  }`}
                >
                  {droppedValue || "?"}
                </div>
              ) : (
                currentPuzzle.a
              )}
            </div>
          </div>

          {/* Variable Row: P */}
          <div className="flex items-center justify-between border border-zinc-200/60 bg-white px-3.5 py-2.5 rounded-xl">
            <span className="text-[11px] font-bold text-zinc-400">Protons (P)</span>
            <div className="text-xs font-black text-zinc-800">
              {currentPuzzle.missingKey === 'p' ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`w-10 h-6 border-2 border-dashed rounded-md flex items-center justify-center transition-all ${
                    shaking ? "animate-shake border-zinc-900" : ""
                  } ${
                    isCorrect && droppedValue ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300"
                  }`}
                >
                  {droppedValue || "?"}
                </div>
              ) : (
                currentPuzzle.p
              )}
            </div>
          </div>

          {/* Variable Row: E */}
          <div className="flex items-center justify-between border border-zinc-200/60 bg-white px-3.5 py-2.5 rounded-xl">
            <span className="text-[11px] font-bold text-zinc-400">Electrons (E)</span>
            <div className="text-xs font-black text-zinc-800">
              {currentPuzzle.missingKey === 'e' ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`w-10 h-6 border-2 border-dashed rounded-md flex items-center justify-center transition-all ${
                    shaking ? "animate-shake border-zinc-900" : ""
                  } ${
                    isCorrect && droppedValue ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300"
                  }`}
                >
                  {droppedValue || "?"}
                </div>
              ) : (
                currentPuzzle.e
              )}
            </div>
          </div>

          {/* Variable Row: N */}
          <div className="flex items-center justify-between border border-zinc-200/60 bg-white px-3.5 py-2.5 rounded-xl col-span-2">
            <span className="text-[11px] font-bold text-zinc-400">Neutrons (N)</span>
            <div className="text-xs font-black text-zinc-800">
              {currentPuzzle.missingKey === 'n' ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className={`w-10 h-6 border-2 border-dashed rounded-md flex items-center justify-center transition-all ${
                    shaking ? "animate-shake border-zinc-900" : ""
                  } ${
                    isCorrect && droppedValue ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300"
                  }`}
                >
                  {droppedValue || "?"}
                </div>
              ) : (
                currentPuzzle.n
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Answer Slot Zone (Drag Target Helper Instruction) */}
      <div 
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`w-full py-4 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
          isCorrect === true
            ? "border-zinc-900 bg-zinc-50"
            : shaking
            ? "border-zinc-950 bg-zinc-100 animate-shake"
            : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/30"
        }`}
      >
        {isCorrect === true ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-zinc-950 flex items-center justify-center bg-zinc-900 text-white text-[10px] font-black">✓</div>
            <span className="text-xs font-bold text-zinc-900">Correct Value Dropped!</span>
          </div>
        ) : (
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            Drag option here or tap below
          </span>
        )}
      </div>

      {/* Draggable Number Chips */}
      <div className="flex justify-center gap-3.5">
        {currentPuzzle.options.map((option) => {
          const isPlaced = droppedValue === option;
          return (
            <button
              key={option}
              draggable={!isCorrect}
              onDragStart={(e) => handleDragStart(e, option)}
              onDragEnd={handleDragEnd}
              onClick={() => handleChipClick(option)}
              disabled={isCorrect === true}
              className={`w-12 h-12 rounded-xl border flex items-center justify-center text-xs font-black transition-all cursor-pointer transform select-none ${
                isCorrect && isPlaced
                  ? "bg-zinc-900 border-zinc-950 text-white scale-95 shadow-none"
                  : isPlaced && isCorrect === false
                  ? "bg-zinc-100 border-zinc-800 text-zinc-900 animate-shake"
                  : isDragging && selectedChip === option
                  ? "opacity-50 scale-105 shadow-md border-zinc-400 bg-white"
                  : "bg-white border-zinc-200 text-zinc-850 hover:border-zinc-300 hover:scale-105 active:scale-95 shadow-[0_2px_6px_rgba(0,0,0,0.03)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Hint & Formula Panel (Collapsed by default) */}
      <div className="flex flex-col gap-2.5">
        <button
          onClick={() => setShowHint(!showHint)}
          className="self-center inline-flex items-center gap-1.5 text-[10px] font-extrabold text-zinc-400 hover:text-zinc-600 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
          </svg>
          {showHint ? "Hide Formula Hint" : "Need a Hint?"}
        </button>

        {showHint && (
          <div className="border border-zinc-200/80 bg-zinc-50/50 rounded-xl p-3.5 animate-fade-in">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
              Formula Reference
            </span>
            <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed">
              {currentPuzzle.hint}
            </p>
          </div>
        )}
      </div>

      {/* Feedback / Explanation & Continue Button */}
      {showExplanation && (
        <div className="flex flex-col gap-4 border-t border-zinc-100 pt-4 animate-fade-in">
          <div className="bg-zinc-50 border border-zinc-200/80 rounded-xl p-4">
            <span className="text-[9px] font-black text-zinc-900 uppercase tracking-widest block mb-1">
              Explanation
            </span>
            <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed">
              {currentPuzzle.explanation}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                ✨ +20 XP
              </span>
            </div>
            <button
              onClick={handleContinue}
              className="flex-1 py-2.5 bg-zinc-900 text-white rounded-lg font-bold text-xs tracking-wider active:scale-[0.98] transition-all cursor-pointer text-center uppercase border border-zinc-950"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
