'use client';

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ElementData } from "@/types/element";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface AnimationCardProps {
  element: ElementData;
  showAtom: boolean;
  onToggleAtom?: () => void;
}

const shellColors = [
  { name: "K Shell", color: "#0071e3", strokeLight: "rgba(0, 113, 227, 0.15)" },
  { name: "L Shell", color: "#34c759", strokeLight: "rgba(52, 199, 89, 0.15)" },
  { name: "M Shell", color: "#ff9500", strokeLight: "rgba(255, 149, 0, 0.15)" },
  { name: "N Shell", color: "#af52de", strokeLight: "rgba(175, 82, 222, 0.15)" },
  { name: "O Shell", color: "#ff2d55", strokeLight: "rgba(255, 45, 85, 0.15)" },
];

export default function AnimationCard({ element, showAtom, onToggleAtom }: AnimationCardProps) {
  const [activeShellIndex, setActiveShellIndex] = useState<number | null>(null);
  const [modelData, setModelData] = useState<{ shells: number[] } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wasMounted = useRef(false);

  useEffect(() => {
    fetch("/data/atom_models.json")
      .then((res) => res.json())
      .then((data) => {
        if (data[element.symbol]) {
          setModelData(data[element.symbol]);
        } else {
          setModelData({ shells: [element.electrons] });
        }
      })
      .catch(() => {
        setModelData({ shells: [element.electrons] });
      });
  }, [element.symbol]);

  useEffect(() => {
    if (!containerRef.current) return;

    if (showAtom) {
      gsap.killTweensOf(containerRef.current);
      gsap.set(containerRef.current, { display: "flex", height: "auto" });
      const targetHeight = containerRef.current.scrollHeight;
      
      gsap.fromTo(
        containerRef.current,
        { height: 0, opacity: 0, scale: 0.9 },
        {
          height: targetHeight,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
          onComplete: () => {
            gsap.set(containerRef.current, { clearProps: "height" });
          }
        }
      );
    } else if (wasMounted.current) {
      gsap.killTweensOf(containerRef.current);
      gsap.to(containerRef.current, {
        height: 0,
        opacity: 0,
        scale: 0.9,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(containerRef.current, { display: "none" });
        }
      });
    }
    wasMounted.current = true;
  }, [showAtom]);

  const shells = modelData?.shells || [element.electrons];
  const totalShells = shells.length;

  const getRadius = (index: number) => {
    if (totalShells === 1) return 65;
    return 40 + (index * 45) / (totalShells - 1);
  };

  const nucleusColors: Record<string, { fill: string; text: string; stroke: string }> = {
    "nonmetal": { fill: "#e2f5ec", text: "#0f5132", stroke: "#c2ebd5" },
    "noble-gas": { fill: "#e8eaf6", text: "#1a237e", stroke: "#d2d5e8" },
    "alkali-metal": { fill: "#ffebee", text: "#b71c1c", stroke: "#ffd5d9" },
    "alkaline-earth": { fill: "#fff3e0", text: "#e65100", stroke: "#ffe0b2" },
    "transition-metal": { fill: "#fffde7", text: "#f57f17", stroke: "#fff59d" },
    "halogen": { fill: "#e0f7fa", text: "#006064", stroke: "#80deea" },
    "other-metal": { fill: "#eceff1", text: "#263238", stroke: "#b0bec5" },
  };

  const nColor = nucleusColors[element.category] || { fill: "#eceff1", text: "#263238", stroke: "#b0bec5" };

  return (
    <div
      ref={containerRef}
      className="flex-col items-center gap-4 overflow-hidden w-full"
      style={{ display: "none" }}
    >
      <Card className="flex flex-col justify-between">
        {/* SVG Center */}
        <div className="relative flex items-center justify-center w-76 h-76 mx-auto bg-zinc-50 border border-zinc-100 rounded-2xl mt-4">
          <svg className="w-68 h-68 animate-fade-in" viewBox="0 0 200 200">
            {/* Orbits & Electrons */}
            {shells.map((electronsCount, shellIndex) => {
              const r = getRadius(shellIndex);
              const shellConfig = shellColors[shellIndex % shellColors.length];
              const isActive = activeShellIndex === shellIndex;
              
              const electrons = Array.from({ length: electronsCount }).map((_, eIndex) => {
                const angle = (eIndex * 360) / electronsCount;
                const rad = (angle * Math.PI) / 180;
                const cx = 100 + r * Math.cos(rad);
                const cy = 100 + r * Math.sin(rad);
                return { cx, cy };
              });

              return (
                <g key={shellIndex}>
                  {/* Visible Orbit Line */}
                  <circle
                    cx="100"
                    cy="100"
                    r={r}
                    stroke={isActive ? shellConfig.color : shellConfig.strokeLight}
                    strokeWidth={isActive ? "2.5" : "1.5"}
                    fill="none"
                    className="pointer-events-none transition-all duration-200"
                  />
                  {/* Invisible Hover Catcher (Wide stroke for comfortable interaction) */}
                  <circle
                    cx="100"
                    cy="100"
                    r={r}
                    stroke="transparent"
                    strokeWidth="18"
                    fill="none"
                    className="cursor-help"
                    onMouseEnter={() => setActiveShellIndex(shellIndex)}
                    onMouseLeave={() => setActiveShellIndex(null)}
                  />
                  {/* Rotating Electron Group */}
                  <g
                    className="animate-spin origin-center pointer-events-none"
                    style={{ animationDuration: `${8 + shellIndex * 4}s` }}
                  >
                    {electrons.map((e, eIndex) => (
                      <circle
                        key={eIndex}
                        cx={e.cx}
                        cy={e.cy}
                        r={isActive ? "7.5" : "6"}
                        fill={shellConfig.color}
                        stroke="white"
                        strokeWidth="1.5"
                        className="shadow-sm transition-all duration-200"
                      />
                    ))}
                  </g>
                </g>
              );
            })}

            {/* Nucleus */}
            <circle
              cx="100"
              cy="100"
              r="24"
              fill={nColor.fill}
              stroke={nColor.stroke}
              strokeWidth="2"
              className="shadow-md"
            />
            <text
              x="100"
              y="105"
              textAnchor="middle"
              fill={nColor.text}
              className="font-sans font-extrabold text-sm select-none"
            >
              {element.symbol}
            </text>
          </svg>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col gap-6 w-full border-t border-zinc-100 pt-6">
          {/* Dynamic Shell Legend / Brief (With bidirectional hover highlight) */}
          <div className="flex justify-center gap-3.5 flex-wrap px-2">
            {shells.map((electronsCount, shellIndex) => {
              const shellConfig = shellColors[shellIndex % shellColors.length];
              const isActive = activeShellIndex === shellIndex;
              return (
                <div
                  key={shellIndex}
                  onMouseEnter={() => setActiveShellIndex(shellIndex)}
                  onMouseLeave={() => setActiveShellIndex(null)}
                  className={`flex items-center gap-1.5 rounded-lg py-1.5 px-3 border transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white border-zinc-300 scale-105 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      : "bg-zinc-50 border-zinc-100/80 opacity-60 hover:opacity-100"
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white shadow-sm shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: shellConfig.color,
                      transform: isActive ? "scale(1.2)" : "scale(1)"
                    }}
                  />
                  <span className="text-[14px] font-semibold text-zinc-600 font-sans tracking-tight">
                    {shellConfig.name} ({electronsCount}e⁻)
                  </span>
                </div>
              );
            })}
          </div>

          {onToggleAtom && (
            <Button variant="action" onClick={onToggleAtom}>
              Show Info
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
