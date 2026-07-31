'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ElementData } from "@/types/element";
import Text from "@/components/ui/Typography";

const categoryClasses: Record<string, string> = {
  "nonmetal": "bg-[#e2f5ec] hover:bg-[#d0f0e1] border-[#c2ebd5] text-[#0f5132]",
  "noble-gas": "bg-[#e8eaf6] hover:bg-[#dcdfe5] border-[#d2d5e8] text-[#1a237e]",
  "alkali-metal": "bg-[#ffebee] hover:bg-[#ffdde1] border-[#ffd5d9] text-[#b71c1c]",
  "alkaline-earth": "bg-[#fff3e0] hover:bg-[#ffe5c7] border-[#ffe0b2] text-[#e65100]",
  "transition-metal": "bg-[#fffde7] hover:bg-[#fff9c4] border-[#fff59d] text-[#f57f17]",
  "halogen": "bg-[#e0f7fa] hover:bg-[#b2ebf2] border-[#80deea] text-[#006064]",
  "other-metal": "bg-[#eceff1] hover:bg-[#cfd8dc] border-[#b0bec5] text-[#263238]",
};

export default function PeriodicTable() {
  const [elements, setElements] = useState<ElementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetch("/data/periodic_table.json")
      .then((res) => res.json())
      .then((data: ElementData[]) => {
        setElements(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load elements:", err);
        setLoading(false);
      });
  }, []);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-12 h-12 border-4 border-zinc-200 border-t-brand rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8 px-8 py-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Text variant="h1" className="text-[#1d1d1f] font-extrabold tracking-tight">
          Periodic Table
        </Text>
        <Text variant="body" className="text-zinc-500">
          Click on any element to view its chemical properties and 3D Bohr model.
        </Text>
      </div>

      <div className="w-full">
        <div className="w-full grid grid-cols-18 gap-2 p-6 bg-white rounded-2xl border border-zinc-200/50">
          {elements.map((el) => {
            const classNames = categoryClasses[el.category] || "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-[#1d1d1f]";
            const formattedName = el.name.charAt(0) + el.name.slice(1).toLowerCase();
            const isFilteredOut = selectedCategories.length > 0 && !selectedCategories.includes(el.category);

            return (
              <Link
                key={el.symbol}
                href={`/atom-info/${el.symbol}`}
                style={{
                  gridColumnStart: el.column,
                  gridRowStart: el.row,
                }}
                className={`relative flex flex-col justify-between items-center w-full aspect-square p-1.5 rounded-xl border font-sans select-none transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer gap-1 ${classNames} ${
                  isFilteredOut ? "opacity-15 grayscale scale-95 pointer-events-none" : ""
                }`}
              >
                {/* Atomic Number */}
                <span className="w-full text-left text-[14px] font-extrabold leading-none opacity-80">
                  {el.atomicNumber}
                </span>

                {/* Chemical Symbol */}
                <span className="text-3xl font-black text-center leading-none mt-0.5">
                  {el.symbol}
                </span>

                {/* Element Name */}
                <span className="text-[10px] font-bold tracking-tight text-center leading-tight w-full opacity-90 break-words">
                  {formattedName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Legend / Key checkmark filters */}
      <div className="flex flex-wrap justify-center gap-6 mt-2">
        {Object.entries(categoryClasses).map(([category, classes]) => {
          const bgClass = classes.split(" ").find(c => c.startsWith("bg-"));
          const textClass = classes.split(" ").find(c => c.startsWith("text-"));
          const borderClass = classes.split(" ").find(c => c.startsWith("border-"));
          const label = category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          
          const isChecked = selectedCategories.includes(category);

          return (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-all duration-200"
            >
              <span className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${bgClass} ${borderClass} ${textClass} ${
                isChecked ? 'scale-110 ring-2 ring-brand/20' : 'opacity-80'
              }`}>
                {isChecked && (
                  <svg className="w-3.5 h-3.5 stroke-[3.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </span>
              <span className={`text-[14px] font-semibold tracking-wide transition-colors duration-200 ${
                isChecked ? 'text-zinc-900 font-bold' : 'text-zinc-500'
              }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
