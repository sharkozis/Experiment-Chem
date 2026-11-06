'use client';

import { useState } from "react";

interface StatesOfMatterLessonProps {
  onComplete: (xp: number) => void;
}

type StateType = "solid" | "liquid" | "gas";

export default function StatesOfMatterLesson({ onComplete }: StatesOfMatterLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [temperature, setTemperature] = useState(25);
  const [activeTab, setActiveTab] = useState<StateType>("liquid");
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);

  const totalSteps = 5;

  const handleTempChange = (temp: number) => {
    setTemperature(temp);
    if (temp <= 0) {
      setActiveTab("solid");
    } else if (temp < 100) {
      setActiveTab("liquid");
    } else {
      setActiveTab("gas");
    }
  };

  const handleTabChange = (state: StateType) => {
    setActiveTab(state);
    if (state === "solid") setTemperature(-10);
    else if (state === "liquid") setTemperature(25);
    else if (state === "gas") setTemperature(110);
  };

  const stateDetails = {
    solid: {
      name: "Solid (Ice)",
      icon: "🧊",
      particleMotion: "Vibrating in fixed lattice positions",
    },
    liquid: {
      name: "Liquid (Water)",
      icon: "💧",
      particleMotion: "Sliding and flowing past each other",
    },
    gas: {
      name: "Gas (Steam / Vapor)",
      icon: "💨",
      particleMotion: "Rapid, random motion in all directions",
    },
  };

  const current = stateDetails[activeTab];

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(earnedXP || 50);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-3xl animate-fade-in font-sans">
      {/* Main Stepped White Panel matching mockup */}
      <div className="w-full min-h-[480px] md:min-h-[520px] bg-white rounded-[32px] border border-zinc-200/70 p-6 sm:p-10 md:p-12 shadow-[0_4px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between relative">
        {/* Top Header: XP Badge */}
        <div className="flex items-center justify-end w-full">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-[#558c14] bg-[#edf8d3] border border-[#cbe880] transition-all">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{earnedXP} XP</span>
          </span>
        </div>

        {/* Center Content Area */}
        <div className="flex-1 flex flex-col items-center justify-center text-center my-6 max-w-xl mx-auto w-full transition-all duration-300">
          {/* SCREEN 1: What is Matter? */}
          {currentStep === 0 && (
            <div className="flex flex-col items-center gap-5 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
                What is Matter?
              </h2>
              <p className="text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                Anything that has mass and takes up space is called{" "}
                <span className="text-[#3b82f6] font-semibold">matter</span>.
              </p>
            </div>
          )}

          {/* SCREEN 2: Stages of Matter */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center gap-4 animate-fade-in w-full">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
                Stages of Matter
              </h2>
              <div className="flex flex-col gap-1.5 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                <p>There are 3 stages of Matter. Solid, Liquid, Gas</p>
                <p>
                  By changing the{" "}
                  <span className="text-[#3b82f6] font-semibold">temperature</span>, the same substance can be turned into a{" "}
                  <span className="underline decoration-zinc-400 underline-offset-4">solid, a liquid, or a gas.</span>
                </p>
              </div>

              {/* Three Icons: Ice Cube, Flask with Liquid, Steam Cloud */}
              <div className="mt-8 flex items-end justify-center gap-8 sm:gap-14 w-full">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/images/states/solid_ice.png"
                    alt="Solid Ice"
                    className="w-14 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/images/states/liquid_flask.png"
                    alt="Liquid Water"
                    className="w-14 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/images/states/gas_steam.png"
                    alt="Gas Steam"
                    className="w-14 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Intermolecular Attraction */}
          {currentStep === 2 && (
            <div className="flex flex-col items-center gap-4 animate-fade-in w-full">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1d1d1f] tracking-tight">
                Intermolecular Attraction.
              </h2>
              <div className="flex flex-col gap-0.5 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal">
                <p>The molecules of all matter pull on each other with a force called</p>
                <p className="text-[#3b82f6] font-bold text-lg sm:text-xl">
                  Intermolecular Attraction.
                </p>
              </div>

              {/* Three Particle Diagrams: Solid Lattice, Liquid Cluster, Gas Container */}
              <div className="mt-8 flex items-center justify-center gap-8 sm:gap-14 w-full">
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/images/states/attraction_solid.png"
                    alt="Solid Lattice"
                    className="w-14 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/images/states/attraction_liquid.png"
                    alt="Liquid Particles"
                    className="w-14 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <img
                    src="/images/states/attraction_gas.png"
                    alt="Gas Particles in Container"
                    className="w-14 sm:w-16 md:w-20 h-auto object-contain select-none pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 4: Interactive Thermal Chamber */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center gap-4 w-full animate-fade-in">
              <div className="flex items-center justify-between w-full max-w-md">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">
                  Interactive Chamber
                </h3>
                {/* State Tabs */}
                <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl">
                  {(["solid", "liquid", "gas"] as StateType[]).map((state) => (
                    <button
                      key={state}
                      onClick={() => handleTabChange(state)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                        activeTab === state
                          ? "bg-white text-brand shadow-sm"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulation Visual */}
              <div className="relative h-44 w-full max-w-md rounded-2xl bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border border-slate-700/50 p-3 flex flex-col justify-between overflow-hidden shadow-inner">
                <div className="flex items-center justify-between z-10">
                  <span className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold text-white">
                    {current.icon} {current.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-brand/20 text-blue-300 border border-blue-400/30">
                    {temperature}°C
                  </span>
                </div>

                {/* Particle Canvas Graphic */}
                <div className="relative flex-1 flex items-center justify-center">
                  {activeTab === "solid" && (
                    <div className="grid grid-cols-5 gap-1.5 p-2 bg-blue-400/10 border border-blue-400/30 rounded-xl animate-pulse">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-300 shadow-[0_0_6px_rgba(56,189,248,0.5)] transform animate-bounce"
                          style={{ animationDuration: "1.5s", animationDelay: `${(i % 5) * 0.1}s` }}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === "liquid" && (
                    <div className="w-full h-24 absolute bottom-1 flex flex-wrap gap-2 p-2 items-end justify-center bg-blue-500/15 border-t border-blue-400/30 rounded-b-xl">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-300 shadow-[0_0_6px_rgba(96,165,250,0.6)] animate-pulse"
                          style={{
                            animationDuration: `${0.8 + (i % 4) * 0.2}s`,
                            transform: `translateY(${Math.sin(i) * 4}px)`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === "gas" && (
                    <div className="w-full h-full relative">
                      {Array.from({ length: 15 }).map((_, i) => {
                        const top = ((i * 19) % 70) + 10;
                        const left = ((i * 29) % 75) + 10;
                        return (
                          <div
                            key={i}
                            className="absolute w-3 h-3 rounded-full bg-gradient-to-tr from-orange-300 to-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-ping"
                            style={{
                              top: `${top}%`,
                              left: `${left}%`,
                              animationDuration: `${1.2 + (i % 3) * 0.4}s`,
                            }}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="z-10 text-center">
                  <span className="text-[10px] text-zinc-400 font-semibold">
                    Particles: {current.particleMotion}
                  </span>
                </div>
              </div>

              {/* Slider */}
              <div className="w-full max-w-md flex flex-col gap-1">
                <input
                  type="range"
                  min="-30"
                  max="140"
                  value={temperature}
                  onChange={(e) => handleTempChange(parseInt(e.target.value, 10))}
                  className="w-full accent-brand h-2 bg-zinc-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
                  <span>-30°C Ice</span>
                  <span>0°C Melting</span>
                  <span>100°C Boiling</span>
                  <span>140°C Steam</span>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 5: Knowledge Check Challenge */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center gap-4 w-full animate-fade-in max-w-lg">
              <span className="text-xs font-extrabold text-brand bg-brand/10 px-3 py-1 rounded-full uppercase tracking-wider">
                Knowledge Check Challenge
              </span>

              <h3 className="text-xl sm:text-2xl font-bold text-[#1d1d1f]">
                What is the scientific definition of matter?
              </h3>

              <div className="grid grid-cols-1 gap-2.5 w-full mt-2">
                {[
                  { id: 0, text: "A. Only visible substances with color and smell", correct: false },
                  { id: 1, text: "B. Anything that has mass and takes up space", correct: true },
                  { id: 2, text: "C. Any object that only exists as a solid", correct: false },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setQuizAnswer(opt.id);
                      setQuizSubmitted(true);
                      if (opt.correct) {
                        setEarnedXP(50);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-xs sm:text-sm font-bold text-left transition-all cursor-pointer ${
                      quizAnswer === opt.id
                        ? opt.correct
                          ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-sm"
                          : "bg-red-50 border-red-300 text-red-600"
                        : "bg-zinc-50 border-zinc-200/80 text-zinc-700 hover:bg-zinc-100"
                    }`}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>

              {quizSubmitted && (
                <div className={`p-3.5 rounded-2xl text-xs font-semibold w-full mt-1 ${
                  quizAnswer === 1 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"
                }`}>
                  {quizAnswer === 1
                    ? "🎉 Correct! You earned +50 XP! Click Finish to complete the lesson."
                    : "Not quite. Remember: matter is anything that has mass and takes up space! Try selecting option B."}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation Controls matching mockup */}
        <div className="flex items-center justify-between w-full pt-4">
          {/* Back button or spacer */}
          <div className="w-20 flex justify-start">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="text-xs sm:text-sm font-semibold text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
          </div>

          {/* Stepper Dots (Active: blue pill; Inactive: small dots) */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  currentStep === idx
                    ? "w-6 h-2 bg-[#3b82f6]"
                    : "w-2 h-2 bg-zinc-200 hover:bg-zinc-300"
                }`}
              />
            ))}
          </div>

          {/* Next / Finish Button */}
          <div className="w-20 flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center justify-center px-6 py-2 rounded-full text-xs sm:text-sm font-semibold text-white bg-[#3b82f6] hover:bg-[#2563eb] active:scale-[0.98] transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              {currentStep === totalSteps - 1 ? (earnedXP > 0 ? "Finish" : "Next") : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
