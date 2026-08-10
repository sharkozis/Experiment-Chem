'use client';

import { useState, useEffect } from "react";
import Text from "@/components/ui/Typography";

interface ShellInfo {
  n: number;
  name: string;
  energy: string;
}

interface TransitionInfo {
  from: number;
  to: number;
  color: string;
  name: string;
}

interface ChallengeQuestion {
  qId: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface LessonStep {
  stepId: number;
  title: string;
  type: string;
  theory: string;
  interactionData: {
    buttonText?: string;
    prompt?: string;
    shells?: ShellInfo[];
    question?: string;
    options?: string[];
    answer?: string;
    explanation?: string;
    n_initial?: number;
    n_final?: number;
    formula?: string;
    transitions?: TransitionInfo[];
    successes?: string[];
    limitations?: string[];
    questions?: ChallengeQuestion[];
  };
}

export default function BohrLesson({ onComplete }: { onComplete: (xp: number) => void }) {
  const [steps, setSteps] = useState<LessonStep[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lesson Navigation state
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [maxStepReached, setMaxStepReached] = useState(0);
  
  // Interaction/Quiz states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [shakeOption, setShakeOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  // Challenge State (Multiple questions inside Step 8)
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [challengeSelectedOption, setChallengeSelectedOption] = useState<string | null>(null);
  const [challengeWrongOptions, setChallengeWrongOptions] = useState<string[]>([]);
  const [challengeShakeOption, setChallengeShakeOption] = useState<string | null>(null);
  const [challengeIsCorrect, setChallengeIsCorrect] = useState<boolean | null>(null);

  // Bohr visualizer states
  const [electronOrbit, setElectronOrbit] = useState<number>(1);
  const [selectedShellInfo, setSelectedShellInfo] = useState<ShellInfo | null>(null);
  
  // Animation states
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionType, setTransitionType] = useState<'idle' | 'absorption' | 'emission'>('idle');
  const [photonAnimation, setPhotonAnimation] = useState<boolean>(false);
  const [spectralHighlight, setSpectralHighlight] = useState<number | null>(null);

  // Load lesson steps from JSON
  useEffect(() => {
    fetch("/data/bohr_lesson.json")
      .then((res) => res.json())
      .then((data: LessonStep[]) => {
        setSteps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Bohr lesson data:", err);
        setLoading(false);
      });
  }, []);

  // Update visual state when step changes
  useEffect(() => {
    if (steps.length === 0) return;
    const currentStep = steps[currentStepIndex];
    if (!currentStep) return;
    
    const handle = setTimeout(() => {
      // Reset interaction state
      setSelectedOption(null);
      setWrongOptions([]);
      setShakeOption(null);
      setIsCorrect(null);

      // Visual setup depending on step type
      if (currentStep.type === "interactive-shells") {
        setElectronOrbit(1);
        setSelectedShellInfo(currentStep.interactionData.shells?.[0] || null);
      } else if (currentStep.type === "transition-absorption") {
        setElectronOrbit(1);
        setTransitionType('idle');
      } else if (currentStep.type === "transition-emission") {
        setElectronOrbit(2);
        setTransitionType('idle');
      } else if (currentStep.type === "mvr-formula") {
        setElectronOrbit(3);
      } else if (currentStep.type === "spectra-simulation") {
        setElectronOrbit(3);
        setSpectralHighlight(null);
      } else if (currentStep.type === "success-limitations") {
        setElectronOrbit(1);
      } else if (currentStep.type === "final-challenge") {
        setElectronOrbit(1);
        setChallengeIndex(0);
        setChallengeSelectedOption(null);
        setChallengeWrongOptions([]);
        setChallengeShakeOption(null);
        setChallengeIsCorrect(null);
      }
    }, 0);

    return () => clearTimeout(handle);
  }, [currentStepIndex, steps]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-zinc-200 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="text-center p-6 text-zinc-500 font-semibold">
        No lesson steps loaded. Please check your data source.
      </div>
    );
  }

  const currentStep = steps[currentStepIndex];

  // Handler for option clicks (General questions)
  const handleOptionClick = (option: string) => {
    if (isCorrect) return;

    setSelectedOption(option);
    if (option === currentStep.interactionData.answer) {
      setIsCorrect(true);
      if (currentStepIndex === maxStepReached) {
        setMaxStepReached((prev) => prev + 1);
      }
    } else {
      setIsCorrect(false);
      setWrongOptions((prev) => [...prev, option]);
      setShakeOption(option);

      setTimeout(() => {
        setShakeOption(null);
        setIsCorrect(null);
        setWrongOptions((prev) => prev.filter((o) => o !== option));
      }, 600);
    }
  };

  // Handler for final challenge question option clicks
  const handleChallengeOptionClick = (option: string) => {
    if (challengeIsCorrect) return;

    const challengeQuestions = currentStep.interactionData.questions || [];
    const currentChallengeQ = challengeQuestions[challengeIndex];

    setChallengeSelectedOption(option);
    if (option === currentChallengeQ.answer) {
      challengeIsCorrectState(true);
    } else {
      challengeIsCorrectState(false);
      setChallengeWrongOptions((prev) => [...prev, option]);
      setChallengeShakeOption(option);

      setTimeout(() => {
        setChallengeShakeOption(null);
        setChallengeIsCorrect(null);
        setChallengeWrongOptions((prev) => prev.filter((o) => o !== option));
      }, 600);
    }
  };

  const challengeIsCorrectState = (val: boolean) => {
    setChallengeIsCorrect(val);
  };

  const handleNextChallengeQuestion = () => {
    const challengeQuestions = currentStep.interactionData.questions || [];
    if (challengeIndex < challengeQuestions.length - 1) {
      setChallengeIndex((prev) => prev + 1);
      setChallengeSelectedOption(null);
      setChallengeWrongOptions([]);
      setChallengeShakeOption(null);
      setChallengeIsCorrect(null);
    } else {
      // Complete Step 8 (Final Challenge)
      if (currentStepIndex === maxStepReached) {
        setMaxStepReached((prev) => prev + 1);
      }
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  // Trigger Absorption Transition Animation (n=1 to n=2)
  const triggerAbsorption = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionType('absorption');
    setPhotonAnimation(true);

    // Photon travels to electron, then electron jumps
    setTimeout(() => {
      setElectronOrbit(2);
      setPhotonAnimation(false);
    }, 1000);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1800);
  };

  // Trigger Emission Transition Animation (n=2 to n=1)
  const triggerEmission = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTransitionType('emission');
    setElectronOrbit(1);

    // Electron jumps, then photon travels out
    setTimeout(() => {
      setPhotonAnimation(true);
    }, 400);

    setTimeout(() => {
      setPhotonAnimation(false);
      setIsTransitioning(false);
    }, 1800);
  };

  // Trigger custom spectrum transition
  const triggerSpectrumTransition = (t: TransitionInfo) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setElectronOrbit(t.from);
    
    // Jump to n=2 (emission)
    setTimeout(() => {
      setElectronOrbit(t.to);
      setSpectralHighlight(t.from);
    }, 600);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 1500);
  };

  // Get SVG orbit radius based on shell level (n)
  const getRadius = (n: number) => {
    switch (n) {
      case 1: return 45;
      case 2: return 70;
      case 3: return 95;
      case 4: return 120;
      default: return 45;
    }
  };

  // Render visualizer panel (Left / Top)
  const renderVisualizer = () => {
    const r = getRadius(electronOrbit);
    
    return (
      <div className="relative w-full aspect-square max-w-[320px] sm:max-w-[360px] mx-auto bg-zinc-950 border border-zinc-800 rounded-3xl p-4 flex flex-col justify-between overflow-hidden shadow-inner select-none">
        {/* Glow filter definition */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="nucleus-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* Level Indicator Title */}
        <div className="flex items-center justify-between w-full z-10 px-1">
          <span className="text-[9px] font-black text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded tracking-wider uppercase">
            Bohr Atomic Model Visualizer
          </span>
          {selectedShellInfo && currentStep.type === "interactive-shells" && (
            <span className="text-[10px] text-zinc-400 font-bold">
              Active: {selectedShellInfo.name}
            </span>
          )}
        </div>

        {/* Central Bohr Atom SVG */}
        <div className="relative flex-1 w-full flex items-center justify-center min-h-[220px]">
          <svg className="w-full h-full max-w-[280px] max-h-[280px]" viewBox="0 0 280 280">
            {/* Concentric Orbits */}
            {[1, 2, 3, 4].map((n) => {
              const isSelected = selectedShellInfo?.n === n && currentStep.type === "interactive-shells";
              const orbitRadius = getRadius(n);
              return (
                <circle
                  key={n}
                  cx="140"
                  cy="140"
                  r={orbitRadius}
                  fill="none"
                  stroke={isSelected ? "#0071e3" : "#334155"}
                  strokeWidth={isSelected ? "2.5" : "1"}
                  strokeDasharray={isSelected ? "0" : "4 4"}
                  className={`transition-all duration-300 ${
                    currentStep.type === "interactive-shells" ? "hover:stroke-brand/60 hover:stroke-[2] cursor-pointer" : ""
                  }`}
                  onClick={() => {
                    if (currentStep.type === "interactive-shells" && currentStep.interactionData.shells) {
                      const shell = currentStep.interactionData.shells.find(s => s.n === n);
                      if (shell) {
                        setSelectedShellInfo(shell);
                        setElectronOrbit(n);
                      }
                    }
                  }}
                />
              );
            })}

            {/* Orbit Label Tags */}
            {[1, 2, 3, 4].map((n) => {
              const orbitRadius = getRadius(n);
              const label = n === 1 ? "n=1 (K)" : n === 2 ? "n=2 (L)" : n === 3 ? "n=3 (M)" : "n=4 (N)";
              return (
                <text
                  key={n}
                  x="142"
                  y={140 - orbitRadius - 4}
                  fill="#64748b"
                  fontSize="8"
                  fontWeight="black"
                  className="pointer-events-none select-none font-sans"
                >
                  {label}
                </text>
              );
            })}

            {/* Nucleus */}
            <circle
              cx="140"
              cy="140"
              r="18"
              fill="url(#nucleusGrad)"
              stroke="#ef4444"
              strokeWidth="1.5"
              filter="url(#nucleus-glow)"
            />
            {/* Nucleus Protons Icon/Symbol */}
            <text
              x="140"
              y="144"
              fill="white"
              fontSize="12"
              fontWeight="900"
              textAnchor="middle"
              className="pointer-events-none select-none font-sans"
            >
              +
            </text>

            {/* Wavy Photon line */}
            {photonAnimation && (
              <path
                d={
                  transitionType === 'absorption'
                    // Traveling inwards to n=2
                    ? "M 10,140 Q 40,110 70,140 T 130,140"
                    // Traveling outwards from n=2 to outside
                    : "M 140,70 Q 110,40 80,70 T 10,70"
                }
                fill="none"
                stroke="#eab308"
                strokeWidth="2.5"
                strokeDasharray="4 4"
                className="animate-photon-wave"
                style={{
                  animation: "dash 1s linear infinite",
                  strokeDashoffset: 100
                }}
              />
            )}

            {/* Electron */}
            <circle
              cx="140"
              cy={140 - r}
              r="6.5"
              fill="url(#electronGrad)"
              stroke="#38bdf8"
              strokeWidth="1.5"
              filter="url(#glow)"
              className="transition-all duration-700 ease-in-out"
            />
            
            {/* Gradients */}
            <defs>
              <radialGradient id="nucleusGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="100%" stopColor="#b91c1c" />
              </radialGradient>
              <radialGradient id="electronGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="100%" stopColor="#0284c7" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Spectral lines bar (Only for step 6 spectra simulation) */}
        {currentStep.type === "spectra-simulation" ? (
          <div className="w-full flex flex-col gap-1.5 border-t border-zinc-800 pt-3.5 z-10 px-1">
            <span className="text-[8px] font-extrabold text-zinc-500 uppercase tracking-widest block">
              Hydrogen Emission Spectrum (Balmer Series)
            </span>
            <div className="w-full h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex relative items-center overflow-hidden">
              {/* Colored spectral lines */}
              <div 
                className={`absolute w-[3px] h-full bg-[#ef4444] left-[20%] transition-opacity duration-300 ${
                  spectralHighlight === 3 ? "opacity-100 scale-x-150 shadow-[0_0_10px_#ef4444]" : "opacity-45"
                }`}
                title="Red line (656 nm)"
              />
              <div 
                className={`absolute w-[3px] h-full bg-[#06b6d4] left-[45%] transition-opacity duration-300 ${
                  spectralHighlight === 4 ? "opacity-100 scale-x-150 shadow-[0_0_10px_#06b6d4]" : "opacity-45"
                }`}
                title="Blue-Green line (486 nm)"
              />
              <div 
                className={`absolute w-[3px] h-full bg-[#6366f1] left-[65%] transition-opacity duration-300 ${
                  spectralHighlight === 5 ? "opacity-100 scale-x-150 shadow-[0_0_10px_#6366f1]" : "opacity-45"
                }`}
                title="Blue-Violet line (434 nm)"
              />
              <div 
                className={`absolute w-[3px] h-full bg-[#a855f7] left-[80%] transition-opacity duration-300 ${
                  spectralHighlight === 6 ? "opacity-100 scale-x-150 shadow-[0_0_10px_#a855f7]" : "opacity-45"
                }`}
                title="Violet line (410 nm)"
              />
              
              {/* Wavelength Scale ticks */}
              <div className="absolute bottom-0 w-full flex justify-between px-2 text-[7px] text-zinc-600 font-bold font-mono">
                <span>700nm</span>
                <span>600nm</span>
                <span>500nm</span>
                <span>400nm</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-[7.5px] text-zinc-500 font-semibold font-mono text-center border-t border-zinc-900/50 pt-2 pointer-events-none">
            {currentStep.type === "interactive-shells" ? "Click orbits to study shells" : "Visualization active"}
          </div>
        )}
      </div>
    );
  };

  // Render Mascot dialog (Right / Bottom)
  const renderDialogue = () => {
    return (
      <div className="flex flex-col md:flex-row gap-5 items-center md:items-start select-none w-full">
        {/* Style block for animations */}
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-6px) rotate(1.5deg); }
          }
          .animate-mascot-float {
            animation: float 4s ease-in-out infinite;
          }
          @keyframes dash {
            to {
              stroke-dashoffset: 0;
            }
          }
        `}</style>

        {/* Mascot SVG */}
        <div className="shrink-0 animate-mascot-float">
          <svg className="w-20 h-20 sm:w-24 sm:h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 25V35L20 70C17 77 22 85 30 85H70C78 85 83 77 80 70L65 35V25H35Z" fill="url(#flaskGrad)" stroke="#0071e3" strokeWidth="4" strokeLinejoin="round"/>
            <path d="M24 70L32 52H68L76 70C78 75 74 81 68 81H32C26 81 22 75 24 70Z" fill="#0071e3" fillOpacity="0.3"/>
            <circle cx="45" cy="45" r="4" fill="#0071e3" fillOpacity="0.6"/>
            <circle cx="55" cy="35" r="3" fill="#0071e3" fillOpacity="0.8"/>
            <circle cx="50" cy="60" r="5" fill="#0071e3" fillOpacity="0.5"/>
            <circle cx="42" cy="62" r="4" fill="#18181b"/>
            <circle cx="58" cy="62" r="4" fill="#18181b"/>
            <circle cx="43.5" cy="60.5" r="1.5" fill="white"/>
            <circle cx="59.5" cy="60.5" r="1.5" fill="white"/>
            <path d="M46 69C46 69 50 72 54 69" stroke="#18181b" strokeWidth="3" strokeLinecap="round"/>
            <defs>
              <linearGradient id="flaskGrad" x1="50" y1="25" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#bae6fd"/>
                <stop offset="1" stopColor="#7dd3fc"/>
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dialogue Bubble */}
        <div className="relative bg-white border border-zinc-200 text-zinc-800 rounded-3xl p-5 sm:p-6 shadow-sm flex-1 flex flex-col gap-4 w-full">
          {/* Chat Bubble Tip */}
          <div className="absolute hidden md:block w-3.5 h-3.5 bg-white border-l border-b border-zinc-200 rotate-45 -left-1.5 top-9" />

          {/* Theory Text */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-widest">
              Niels Bohr&apos;s Postulates
            </span>
            <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight leading-tight">
              {currentStep.title}
            </h3>
            <p className="text-[11px] text-zinc-500 font-semibold leading-relaxed mt-1">
              {currentStep.theory}
            </p>
          </div>

          {/* Interactive controls */}
          <div className="border-t border-zinc-100 pt-4 flex flex-col gap-3 w-full">
            {renderInteractionArea()}
          </div>
        </div>
      </div>
    );
  };

  // Render the specific interaction based on step type
  const renderInteractionArea = () => {
    const data = currentStep.interactionData;
    
    switch (currentStep.type) {
      case "intro":
        return (
          <button
            onClick={() => {
              if (currentStepIndex === maxStepReached) {
                setMaxStepReached(1);
              }
              setCurrentStepIndex(1);
            }}
            className="w-full bg-brand hover:bg-brand-hover text-white py-3 rounded-full font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-brand/10"
          >
            {data.buttonText || "Ready"}
          </button>
        );

      case "interactive-shells":
        return (
          <div className="flex flex-col gap-3.5">
            <span className="text-[10px] text-zinc-400 font-bold italic">
              {data.prompt}
            </span>
            {selectedShellInfo && (
              <div className="bg-zinc-50 border border-zinc-200/50 rounded-2xl p-4 flex flex-col gap-2 font-mono text-[10px] text-zinc-600 leading-normal animate-fade-in">
                <div><strong>Orbit shell number (n):</strong> {selectedShellInfo.n}</div>
                <div><strong>Designated name:</strong> {selectedShellInfo.name}</div>
                <div><strong>Electron energy level:</strong> {selectedShellInfo.energy}</div>
              </div>
            )}
            <button
              onClick={() => {
                if (currentStepIndex === maxStepReached) {
                  setMaxStepReached(2);
                }
                setCurrentStepIndex(2);
              }}
              className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer"
            >
              Continue
            </button>
          </div>
        );

      case "choice-predict":
      case "mvr-formula":
      case "success-limitations":
        return (
          <div className="flex flex-col gap-3">
            <span className="text-[11px] font-extrabold text-zinc-800 leading-snug">
              {data.question}
            </span>
            <div className="grid grid-cols-1 gap-2">
              {data.options?.map((option) => {
                const isSelected = selectedOption === option;
                const isWrong = wrongOptions.includes(option);
                const isShaking = shakeOption === option;

                let btnClass = "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300";
                if (isCorrect && option === data.answer) {
                  btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10";
                } else if (isWrong) {
                  btnClass = "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10";
                }

                return (
                  <button
                    key={option}
                    disabled={isCorrect || isWrong}
                    onClick={() => handleOptionClick(option)}
                    className={`w-full text-left py-2.5 px-4 rounded-xl font-bold text-[11px] transition-all duration-200 ${
                      isCorrect || isWrong ? "cursor-default" : "active:scale-[0.98] cursor-pointer"
                    } ${btnClass} ${isShaking ? "animate-shake" : ""}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            
            {isCorrect && (
              <div className="flex flex-col gap-3.5 mt-1.5 animate-fade-in">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3.5 text-[10px] font-semibold leading-relaxed">
                  <strong>✓ Correct!</strong> {data.explanation}
                </div>
                <button
                  onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                  className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      case "transition-absorption":
        return (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-zinc-400 font-bold italic mb-1">
              {data.prompt}
            </span>
            <button
              onClick={triggerAbsorption}
              disabled={isTransitioning || electronOrbit === 2}
              className="py-2.5 px-5 bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-100 disabled:text-zinc-400 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>⚡ Give Energy (Absorb Photon)</span>
            </button>

            {electronOrbit === 2 && (
              <div className="flex flex-col gap-3 mt-3 border-t border-zinc-100 pt-3 animate-fade-in">
                <span className="text-[11px] font-extrabold text-zinc-800 leading-snug">
                  {data.question}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {data.options?.map((option) => {
                    const isSelected = selectedOption === option;
                    const isWrong = wrongOptions.includes(option);
                    const isShaking = shakeOption === option;

                    let btnClass = "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50";
                    if (isCorrect && option === data.answer) {
                      btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10";
                    } else if (isWrong) {
                      btnClass = "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10";
                    }

                    return (
                      <button
                        key={option}
                        disabled={isCorrect || isWrong}
                        onClick={() => handleOptionClick(option)}
                        className={`w-full text-left py-2.5 px-4 rounded-xl font-bold text-[11px] transition-all duration-200 ${
                          isCorrect || isWrong ? "cursor-default" : "active:scale-[0.98] cursor-pointer"
                        } ${btnClass} ${isShaking ? "animate-shake" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isCorrect && (
              <div className="flex flex-col gap-3 mt-1.5 animate-fade-in">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3.5 text-[10px] font-semibold leading-relaxed">
                  <strong>✓ Correct!</strong> {data.explanation}
                </div>
                <button
                  onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                  className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      case "transition-emission":
        return (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-zinc-400 font-bold italic mb-1">
              {data.prompt}
            </span>
            <button
              onClick={triggerEmission}
              disabled={isTransitioning || electronOrbit === 1}
              className="py-2.5 px-5 bg-sky-500 hover:bg-sky-600 disabled:bg-zinc-100 disabled:text-zinc-400 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>🔅 Release Energy (Emit Photon)</span>
            </button>

            {electronOrbit === 1 && (
              <div className="flex flex-col gap-3 mt-3 border-t border-zinc-100 pt-3 animate-fade-in">
                <span className="text-[11px] font-extrabold text-zinc-800 leading-snug">
                  {data.question}
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {data.options?.map((option) => {
                    const isSelected = selectedOption === option;
                    const isWrong = wrongOptions.includes(option);
                    const isShaking = shakeOption === option;

                    let btnClass = "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50";
                    if (isCorrect && option === data.answer) {
                      btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10";
                    } else if (isWrong) {
                      btnClass = "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10";
                    }

                    return (
                      <button
                        key={option}
                        disabled={isCorrect || isWrong}
                        onClick={() => handleOptionClick(option)}
                        className={`w-full text-left py-2.5 px-4 rounded-xl font-bold text-[11px] transition-all duration-200 ${
                          isCorrect || isWrong ? "cursor-default" : "active:scale-[0.98] cursor-pointer"
                        } ${btnClass} ${isShaking ? "animate-shake" : ""}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {isCorrect && (
              <div className="flex flex-col gap-3 mt-1.5 animate-fade-in">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3.5 text-[10px] font-semibold leading-relaxed">
                  <strong>✓ Correct!</strong> {data.explanation}
                </div>
                <button
                  onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                  className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      case "spectra-simulation":
        return (
          <div className="flex flex-col gap-3">
            <span className="text-[10px] text-zinc-400 font-bold italic mb-1">
              Select an electron transition to watch the emission jump and observe the corresponding colored spectral line:
            </span>
            
            {/* Quick transition triggers */}
            <div className="grid grid-cols-2 gap-2">
              {data.transitions?.map((t) => (
                <button
                  key={t.name}
                  onClick={() => triggerSpectrumTransition(t)}
                  disabled={isTransitioning}
                  className="py-1.5 px-3 bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 rounded-lg text-[10px] font-extrabold text-zinc-700 flex items-center justify-between gap-1 transition-all disabled:opacity-50"
                >
                  <span>n={t.from} → n={t.to}</span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 mt-3 border-t border-zinc-100 pt-3">
              <span className="text-[11px] font-extrabold text-zinc-800 leading-snug">
                {data.question}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {data.options?.map((option) => {
                  const isSelected = selectedOption === option;
                  const isWrong = wrongOptions.includes(option);
                  const isShaking = shakeOption === option;

                  let btnClass = "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50";
                  if (isCorrect && option === data.answer) {
                    btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10";
                  } else if (isWrong) {
                    btnClass = "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10";
                  }

                  return (
                    <button
                      key={option}
                      disabled={isCorrect || isWrong}
                      onClick={() => handleOptionClick(option)}
                      className={`w-full text-left py-2.5 px-4 rounded-xl font-bold text-[11px] transition-all duration-200 ${
                        isCorrect || isWrong ? "cursor-default" : "active:scale-[0.98] cursor-pointer"
                      } ${btnClass} ${isShaking ? "animate-shake" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {isCorrect && (
              <div className="flex flex-col gap-3 mt-1.5 animate-fade-in">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3.5 text-[10px] font-semibold leading-relaxed">
                  <strong>✓ Correct!</strong> {data.explanation}
                </div>
                <button
                  onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                  className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        );

      case "final-challenge":
        const challengeQuestions = data.questions || [];
        const currentQ = challengeQuestions[challengeIndex];
        
        if (!currentQ) return null;

        return (
          <div className="flex flex-col gap-3">
            {/* Challenge progress bar */}
            <div className="flex justify-between items-center text-[8.5px] font-extrabold text-zinc-400 uppercase tracking-wider">
              <span>Challenge Progress</span>
              <span>Question {challengeIndex + 1} of {challengeQuestions.length}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${((challengeIndex) / challengeQuestions.length) * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-3 mt-2">
              <span className="text-[11px] font-black text-zinc-900 leading-snug">
                {currentQ.question}
              </span>
              <div className="grid grid-cols-1 gap-2">
                {currentQ.options.map((option) => {
                  const isSelected = challengeSelectedOption === option;
                  const isWrong = challengeWrongOptions.includes(option);
                  const isShaking = challengeShakeOption === option;

                  let btnClass = "bg-white border border-zinc-200 text-zinc-800 hover:bg-zinc-50";
                  if (challengeIsCorrect && option === currentQ.answer) {
                    btnClass = "bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/10";
                  } else if (isWrong) {
                    btnClass = "bg-rose-500 border-rose-500 text-white shadow-md shadow-rose-500/10";
                  }

                  return (
                    <button
                      key={option}
                      disabled={challengeIsCorrect || isWrong}
                      onClick={() => handleChallengeOptionClick(option)}
                      className={`w-full text-left py-2.5 px-4 rounded-xl font-bold text-[11px] transition-all duration-200 ${
                        challengeIsCorrect || isWrong ? "cursor-default" : "active:scale-[0.98] cursor-pointer"
                      } ${btnClass} ${isShaking ? "animate-shake" : ""}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>

            {challengeIsCorrect && (
              <div className="flex flex-col gap-3.5 mt-2.5 animate-fade-in">
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl p-3.5 text-[10px] font-semibold leading-relaxed">
                  <strong>✓ Correct!</strong> {currentQ.explanation}
                </div>
                <button
                  onClick={handleNextChallengeQuestion}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs tracking-wider uppercase active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-emerald-500/5"
                >
                  {challengeIndex < challengeQuestions.length - 1 ? "Next Challenge Question" : "Complete Lesson!"}
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Step 9: COMPLETE Screen
  if (currentStepIndex === steps.length) {
    return (
      <div className="w-full max-w-md mx-auto border border-zinc-200 bg-white p-8 rounded-3xl flex flex-col items-center text-center shadow-md select-none animate-fade-in text-zinc-800">
        <div className="w-16 h-16 rounded-full border border-emerald-500 bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0110 21a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296 3.745 3.745 0 01-1.043-3.296A3.746 3.746 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
          </svg>
        </div>
        <h2 className="text-xl font-black tracking-tight mb-2 text-zinc-900 font-sans">
          Bohr Model Lesson Mastered!
        </h2>
        <p className="text-xs text-zinc-400 font-semibold mb-6 max-w-[280px] leading-relaxed">
          Congratulations! You have mastered orbits, stationary energy states, angular momentum calculations, and the successes and limitations of the Bohr Atomic Model.
        </p>

        <div className="border border-zinc-200 bg-zinc-50 rounded-2xl px-6 py-3 mb-6 flex items-center gap-2 font-sans">
          <span className="text-xs font-black text-zinc-400">REWARD:</span>
          <span className="text-xs font-extrabold text-emerald-600 border border-emerald-200 bg-white px-2.5 py-0.5 rounded">
            ✨ +150 XP
          </span>
        </div>

        <button
          onClick={() => onComplete(150)}
          className="w-full py-3 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold text-xs tracking-wider active:scale-[0.98] transition-all cursor-pointer shadow-md shadow-brand/10 uppercase"
        >
          Return to Lab Overview
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto select-none font-sans flex flex-col gap-6">
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
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>

      {/* Progress Bar & Navigation Controls */}
      <div className="flex items-center gap-4 w-full">
        {/* Left Arrow Button */}
        <button
          onClick={() => {
            if (currentStepIndex > 0) {
              setCurrentStepIndex(currentStepIndex - 1);
            }
          }}
          disabled={currentStepIndex === 0}
          className="w-9 h-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm shrink-0 cursor-pointer"
          title="Previous Step"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        
        {/* Thicker Progress Bar */}
        <div className="flex-1 h-3.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/40">
          <div 
            className="h-full bg-brand rounded-full transition-all duration-300"
            style={{ width: `${((currentStepIndex) / steps.length) * 100}%` }}
          />
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => {
            if (currentStepIndex < maxStepReached) {
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
          disabled={currentStepIndex >= maxStepReached}
          className="w-9 h-9 rounded-full border border-zinc-200 bg-white hover:bg-zinc-50 flex items-center justify-center text-zinc-600 disabled:opacity-30 disabled:pointer-events-none transition-all shadow-sm shrink-0 cursor-pointer"
          title="Next Step"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Main Split Layout: Visualizer on left, Text/Interaction on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Visualizer Block (5 columns on desktop) */}
        <div className="md:col-span-5 flex justify-center w-full">
          {renderVisualizer()}
        </div>

        {/* Text/Interaction Block (7 columns on desktop) */}
        <div className="md:col-span-7 flex justify-center w-full">
          {renderDialogue()}
        </div>
      </div>
    </div>
  );
}
