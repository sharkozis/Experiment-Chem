'use client';

import { ElementData } from "@/types/element";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Text from "@/components/ui/Typography";
import Button from "@/components/ui/Button";

interface InfoCardProps {
  element: ElementData;
  showAtom: boolean;
  onToggleAtom: () => void;
}

export default function InfoCard({ element, showAtom, onToggleAtom }: InfoCardProps) {
  const formattedName = element.name.charAt(0) + element.name.slice(1).toLowerCase();

  return (
    <Card>
      {/* Top Row: Atomic Number & Atomic Mass */}
      <div className="flex justify-between items-start">
        <Badge variant="pill" className="text-xl font-extrabold px-4 py-2 text-[#1d1d1f]">
          {element.atomicNumber}
        </Badge>
        <Badge variant="pill">
          <svg className="w-3.5 h-3.5 text-[#8e8e93]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Mass: {element.mass}
        </Badge>
      </div>

      {/* Center Element Symbol */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Symbol */}
        <Text variant="symbol" className="font-sans font-black tracking-tight select-none text-[#1d1d1f]">
          {element.symbol}
        </Text>
        <Text variant="h2" className="mt-1 font-black tracking-widest text-[#8e8e93]">
          {element.name}
        </Text>
      </div>

      {/* Bottom Info Row */}
      <div className="flex flex-col items-center gap-4">
        {/* Configuration */}
        <Badge variant="highlight">
          <span>⚡</span> {element.configuration}
        </Badge>

        {/* Particle Info */}
        <div className="flex justify-between w-full border-t border-zinc-100 pt-4 text-xs font-semibold tracking-wider">
          <div className="flex flex-col items-center">
            <Text variant="caption">Protons</Text>
            <span className="text-base font-bold text-emerald-600 mt-0.5">+{element.protons}</span>
          </div>
          <div className="flex flex-col items-center border-x border-zinc-100 px-6">
            <Text variant="caption">Electrons</Text>
            <span className="text-base font-bold text-[#ff3b30] mt-0.5">-{element.electrons}</span>
          </div>
          <div className="flex flex-col items-center">
            <Text variant="caption">Neutrons</Text>
            <span className="text-base font-bold text-zinc-500 mt-0.5">{element.neutrons}</span>
          </div>
        </div>

        {/* View Element Button */}
        <Button variant="action" onClick={onToggleAtom}>
          Show Atom
        </Button>
      </div>
    </Card>
  );
}

