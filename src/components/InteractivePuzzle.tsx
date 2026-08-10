'use client';

import { useState, useEffect } from "react";
import Text from "@/components/ui/Typography";

interface Question {
  id: number;
  element: string;
  massNumber: number;
  protons: number;
  neutrons: number;
  electrons: number;
  question: string;
  options: string[];
  answer: string;
}

export default function InteractivePuzzle({ onComplete }: { onComplete: (xp: number) => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxIndexReached, setMaxIndexReached] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [shakeOption, setShakeOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [xpEarned, setXpEarned] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Load questions
  useEffect(() => {
    fetch("/data/penza_questions.json")
      .then((res) => res.json())
      .then((data: Question[]) => {
        setQuestions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load questions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-6 text-zinc-500 font-semibold">
        No questions loaded. Please check your data source.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  const handleOptionClick = (option: string) => {
    if (isCorrect || currentIndex < maxIndexReached) return;

    setSelectedOption(option);
    if (option === currentQuestion.answer) {
      setIsCorrect(true);
      setXpEarned((prev) => prev + 20);

      // Increment maxIndexReached if answering the latest unlocked question
      if (currentIndex === maxIndexReached) {
        setMaxIndexReached((prev) => prev + 1);
      }

      // Transition to next question or complete game
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setSelectedOption(null);
          setWrongOptions([]);
          setShakeOption(null);
          setIsCorrect(null);
        } else {
          setIsCompleted(true);
          onComplete(xpEarned + 20);
        }
      }, 1500);
    } else {
      setIsCorrect(false);
      setWrongOptions((prev) => [...prev, option]);
      setShakeOption(option);

      // Shake and show red for 600ms, then reset to normal style and hide error text
      setTimeout(() => {
        setShakeOption(null);
        setIsCorrect(null);
        setWrongOptions((prev) => prev.filter((o) => o !== option));
      }, 600);
    }
  };

  // Intro Screen (Mascot and Instructions - Light Theme)
  if (!isReady) {
    return (
      <div className="w-full max-w-2xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-6 p-6 animate-fade-in select-none">
        {/* Style block for animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(2deg); }
          }
          .animate-mascot-float {
            animation: float 4s ease-in-out infinite;
          }
        `}</style>

        {/* Mascot SVG */}
        <div className="shrink-0 animate-mascot-float mt-2">
          <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 25V35L20 70C17 77 22 85 30 85H70C78 85 83 77 80 70L65 35V25H35Z" fill="url(#flaskGrad)" stroke="#22c55e" strokeWidth="4" strokeLinejoin="round"/>
            <path d="M24 70L32 52H68L76 70C78 75 74 81 68 81H32C26 81 22 75 24 70Z" fill="#22c55e" fillOpacity="0.4"/>
            <circle cx="45" cy="45" r="4" fill="#22c55e" fillOpacity="0.6"/>
            <circle cx="55" cy="35" r="3" fill="#22c55e" fillOpacity="0.8"/>
            <circle cx="50" cy="60" r="5" fill="#22c55e" fillOpacity="0.5"/>
            <circle cx="42" cy="62" r="4" fill="#18181b"/>
            <circle cx="58" cy="62" r="4" fill="#18181b"/>
            <circle cx="43.5" cy="60.5" r="1.5" fill="white"/>
            <circle cx="59.5" cy="60.5" r="1.5" fill="white"/>
            <path d="M46 69C46 69 50 72 54 69" stroke="#18181b" strokeWidth="3" strokeLinecap="round"/>
            <defs>
              <linearGradient id="flaskGrad" x1="50" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#bbf7d0"/>
                <stop offset="1" stopColor="#86efac"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Instruction Bubble (Light Theme) */}
        <div className="relative bg-white border border-zinc-200 text-zinc-800 rounded-3xl p-6 sm:p-8 shadow-md flex-1 flex flex-col gap-5">
          {/* Chat Bubble Tip (Desktop Left, Mobile Top) */}
          <div className="absolute hidden md:block w-4 h-4 bg-white border-l border-b border-zinc-200 rotate-45 -left-2 top-10" />
          
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-black text-zinc-900 tracking-tight">
              Welcome to the Atom Foundations Lab!
            </h2>
            <p className="text-xs text-zinc-500 font-semibold leading-relaxed">
              In this activity, you&apos;ll learn the key relationships between:
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200/60 rounded-2xl p-4 flex flex-col gap-2.5 font-mono text-[11px] text-zinc-600 leading-normal">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">•</span>
              <span><strong>Atomic Number (Z)</strong> = Protons (P) = Electrons (E) <span className="text-zinc-400">[neutral atom]</span></span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">•</span>
              <span><strong>Mass Number (A)</strong> = Protons (P) + Neutrons (N)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold shrink-0">•</span>
              <span><strong>Neutrons (N)</strong> = Mass Number (A) - Protons (P)</span>
            </div>
          </div>

          <button
            onClick={() => setIsReady(true)}
            className="w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-full font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-brand/10"
          >
            Ready
          </button>
        </div>
      </div>
    );
  }

  // End Challenge screen (Light Theme)
  if (isCompleted) {
    return (
      <div className="w-full max-w-md mx-auto border border-zinc-200 bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-md select-none animate-fade-in text-zinc-800">
        <div className="w-16 h-16 rounded-full border border-emerald-500 bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296 3.745 3.745 0 01-1.043-3.296A3.746 3.746 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2 text-zinc-900">
          Lab Challenge Complete!
        </h2>
        <p className="text-xs text-zinc-400 font-semibold mb-6 max-w-[280px]">
          You have mastered the relationship between protons, electrons, neutrons, mass, and atomic number.
        </p>

        <div className="border border-zinc-200 bg-zinc-50 rounded-2xl px-6 py-3 mb-6 flex items-center gap-2">
          <span className="text-xs font-black text-zinc-400">REWARD:</span>
          <span className="text-xs font-extrabold text-emerald-600 border border-emerald-200 bg-white px-2.5 py-0.5 rounded">
            ✨ +{xpEarned} XP
          </span>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs tracking-wider active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-brand/10 uppercase"
        >
          Return to Lab Overview
        </button>
      </div>
    );
  }

  // Determine what is displayed in top and bottom circles (to help show "?")
  const isQuestionA = currentQuestion.id === 2; // asks for A
  const isQuestionZ = currentQuestion.id === 4; // asks for Z
  const isAlreadySolved = currentIndex < maxIndexReached;

  return (
    <div className="w-full max-w-xl mx-auto select-none font-sans">
      {/* Styles for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

      {/* Progress Bar & Navigation Controls */}
      <div className="flex items-center gap-4 mb-6">
        {/* Left Arrow Button */}
        <button
          onClick={() => {
            if (currentIndex > 0) {
              setCurrentIndex(currentIndex - 1);
              setSelectedOption(null);
              setIsCorrect(null);
            }
          }}
          disabled={currentIndex === 0}
          className="w-9 h-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm shrink-0 cursor-pointer"
          title="Previous Question"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        {/* Thicker Progress Bar */}
        <div className="flex-1 h-3.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/40">
          <div 
            className="h-full bg-brand rounded-full transition-all duration-300"
            style={{ width: `${((maxIndexReached) / questions.length) * 100}%` }}
          />
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => {
            if (currentIndex < maxIndexReached) {
              setCurrentIndex(currentIndex + 1);
              setSelectedOption(null);
              setIsCorrect(null);
            }
          }}
          disabled={currentIndex === maxIndexReached}
          className="w-9 h-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm shrink-0 cursor-pointer"
          title="Next Question"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Game Card (Light Theme) */}
      <div className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-md flex flex-col gap-6 transition-all duration-300 ${
        isCorrect === true || isAlreadySolved
          ? "border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.08)]"
          : "border-zinc-200"
      }`}>
        
        {/* Visual notation and Question Row */}
        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Left Area: Visual nuclear notation diagram */}
          <div className="flex items-center gap-3 shrink-0 py-3 px-5 bg-zinc-50 border border-zinc-200/60 rounded-2xl">
            {/* Top and Bottom Circles */}
            <div className="flex flex-col gap-2.5">
              {/* Top circle for A */}
              <div className="w-12 h-12 rounded-full bg-white text-zinc-950 font-black flex items-center justify-center text-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-2 border-zinc-200">
                {isQuestionA ? "?" : currentQuestion.massNumber}
              </div>
              {/* Bottom circle for Z */}
              <div className="w-12 h-12 rounded-full bg-white text-zinc-950 font-black flex items-center justify-center text-md shadow-[0_2px_8px_rgba(0,0,0,0.06)] border-2 border-zinc-200">
                {isQuestionZ ? "?" : currentQuestion.protons}
              </div>
            </div>
            
            {/* Element Square */}
            <div className="w-24 h-24 rounded-2xl bg-zinc-100 text-zinc-950 font-black flex items-center justify-center text-4xl shadow-[0_4px_16px_rgba(0,0,0,0.08)] border-2 border-zinc-300">
              {currentQuestion.element}
            </div>
          </div>

          {/* Right Area: Question text */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-[15px] font-extrabold text-zinc-800 leading-relaxed tracking-tight">
              {currentQuestion.question}
            </h3>
          </div>
        </div>

        {/* Options Buttons Grid */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOption === option;
            const isWrong = wrongOptions.includes(option);
            const isShaking = shakeOption === option;

            let buttonClass = "bg-white border-2 border-zinc-200 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm";
            if ((isSelected && isCorrect) || (isAlreadySolved && option === currentQuestion.answer)) {
              buttonClass = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10";
            } else if (isWrong) {
              buttonClass = "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10";
            }

            return (
              <button
                key={option}
                disabled={isAlreadySolved || isCorrect === true || isWrong}
                onClick={() => handleOptionClick(option)}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide border-2 transition-all duration-200 ${
                  isAlreadySolved || isCorrect === true || isWrong ? "cursor-default" : "active:scale-[0.98] cursor-pointer"
                } ${buttonClass} ${isShaking ? "animate-shake" : ""}`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Success/Incorrect Feedbacks */}
        <div className="min-h-[24px] flex items-center justify-center text-center">
          {isCorrect === true && (
            <span className="text-xs font-bold text-emerald-600 animate-pulse">
              🎉 Correct! Well done! Loading next...
            </span>
          )}
          {isCorrect === false && (
            <span className="text-xs font-bold text-rose-500">
              ❌ Wrong answer! Try again.
            </span>
          )}
          {isAlreadySolved && (
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              ✓ Reviewed (Already Answered)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
