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
  "post-transition": "bg-[#e8f5e9] hover:bg-[#c8e6c9] border-[#a5d6a7] text-[#1b5e20]",
  "metalloid": "bg-[#f3e5f5] hover:bg-[#e1bee7] border-[#ce93d8] text-[#4a148c]",
  "lanthanide": "bg-[#fce4ec] hover:bg-[#f8bbd0] border-[#f48fb1] text-[#880e4f]",
  "actinide": "bg-[#fff8e1] hover:bg-[#ffecb3] border-[#ffe082] text-[#ff6f00]",
};

export default function PeriodicTable() {
  const [elements, setElements] = useState<ElementData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [hoveredSeries, setHoveredSeries] = useState<"lanthanide" | "actinide" | null>(null);

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

  // Separate main grid elements from lanthanides/actinides
  const lanthanides = elements.filter(el => el.category === "lanthanide");
  const actinides = elements.filter(el => el.category === "actinide");
  const mainElements = elements.filter(el => el.category !== "lanthanide" && el.category !== "actinide");

  const renderCell = (el: ElementData) => {
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
        <span className="w-full text-left text-[14px] font-extrabold leading-none opacity-80">
          {el.atomicNumber}
        </span>
        <span className="text-3xl font-black text-center leading-none mt-0.5">
          {el.symbol}
        </span>
        <span className="text-[10px] font-bold tracking-tight text-center leading-tight w-full opacity-90 break-words">
          {formattedName}
        </span>
      </Link>
    );
  };

  const renderSeriesCell = (el: ElementData, colIndex: number) => {
    const classNames = categoryClasses[el.category] || "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-[#1d1d1f]";
    const formattedName = el.name.charAt(0) + el.name.slice(1).toLowerCase();
    const isFilteredOut = selectedCategories.length > 0 && !selectedCategories.includes(el.category);

    return (
      <Link
        key={el.symbol}
        href={`/atom-info/${el.symbol}`}
        style={{ gridColumnStart: colIndex }}
        className={`relative flex flex-col justify-between items-center w-full aspect-square p-1.5 rounded-xl border font-sans select-none transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer gap-1 ${classNames} ${
          isFilteredOut ? "opacity-15 grayscale scale-95 pointer-events-none" : ""
        }`}
      >
        <span className="w-full text-left text-[14px] font-extrabold leading-none opacity-80">
          {el.atomicNumber}
        </span>
        <span className="text-3xl font-black text-center leading-none mt-0.5">
          {el.symbol}
        </span>
        <span className="text-[10px] font-bold tracking-tight text-center leading-tight w-full opacity-90 break-words">
          {formattedName}
        </span>
      </Link>
    );
  };

  // Sort lanthanides/actinides by atomic number
  const sortedLanthanides = [...lanthanides].sort((a, b) => a.atomicNumber - b.atomicNumber);
  const sortedActinides = [...actinides].sort((a, b) => a.atomicNumber - b.atomicNumber);

  // Unique categories present in data for legend
  const allCategories = [...new Set(elements.map(el => el.category))];

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 px-6 py-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <Text variant="h1" className="text-[#1d1d1f] font-extrabold tracking-tight">
          Periodic Table
        </Text>
        <Text variant="body" className="text-zinc-500">
          Click on any element to view its chemical properties and 3D Bohr model.
        </Text>
      </div>

      {/* Main Grid (Rows 1-7, 18 columns) */}
      <div className="w-full">
        <div className="w-full grid grid-cols-18 gap-1.5 p-5 bg-white rounded-2xl border border-zinc-200/50">
          {mainElements.map((el) => renderCell(el))}

          {/* Lanthanide placeholder at row 6, col 3 */}
          <div
            style={{ gridColumnStart: 3, gridRowStart: 6 }}
            className={`flex items-center justify-center w-full aspect-square rounded-xl border border-[#f48fb1] bg-[#fce4ec] text-[#880e4f] font-sans select-none cursor-pointer transition-all duration-200 ${hoveredSeries === 'lanthanide' ? 'scale-105 ring-2 ring-[#f48fb1]/40' : ''}`}
            onMouseEnter={() => setHoveredSeries('lanthanide')}
            onMouseLeave={() => setHoveredSeries(null)}
          >
            <span className="text-[10px] font-extrabold tracking-tight text-center leading-tight">57-71</span>
          </div>

          {/* Actinide placeholder at row 7, col 3 */}
          <div
            style={{ gridColumnStart: 3, gridRowStart: 7 }}
            className={`flex items-center justify-center w-full aspect-square rounded-xl border border-[#ffe082] bg-[#fff8e1] text-[#ff6f00] font-sans select-none cursor-pointer transition-all duration-200 ${hoveredSeries === 'actinide' ? 'scale-105 ring-2 ring-[#ffe082]/40' : ''}`}
            onMouseEnter={() => setHoveredSeries('actinide')}
            onMouseLeave={() => setHoveredSeries(null)}
          >
            <span className="text-[10px] font-extrabold tracking-tight text-center leading-tight">89-103</span>
          </div>
        </div>
      </div>

      {/* Lanthanides & Actinides (Separated rows below) */}
      <div className="w-full flex flex-col gap-1.5">
        {/* Lanthanides Row */}
        <div
          className={`w-full grid grid-cols-15 gap-1.5 px-5 py-3 bg-white rounded-2xl border transition-all duration-200 ${hoveredSeries === 'lanthanide' ? 'border-[#f48fb1] ring-2 ring-[#f48fb1]/20 shadow-sm' : 'border-zinc-200/50'}`}
          onMouseEnter={() => setHoveredSeries('lanthanide')}
          onMouseLeave={() => setHoveredSeries(null)}
        >
          {sortedLanthanides.map((el, i) => renderSeriesCell(el, i + 1))}
        </div>

        {/* Actinides Row */}
        <div
          className={`w-full grid grid-cols-15 gap-1.5 px-5 py-3 bg-white rounded-2xl border transition-all duration-200 ${hoveredSeries === 'actinide' ? 'border-[#ffe082] ring-2 ring-[#ffe082]/20 shadow-sm' : 'border-zinc-200/50'}`}
          onMouseEnter={() => setHoveredSeries('actinide')}
          onMouseLeave={() => setHoveredSeries(null)}
        >
          {sortedActinides.map((el, i) => renderSeriesCell(el, i + 1))}
        </div>
      </div>

      {/* Legend / Key checkmark filters */}
      <div className="flex flex-wrap justify-center gap-6 mt-2">
        {allCategories.map((category) => {
          const classes = categoryClasses[category] || "bg-zinc-100 border-zinc-200 text-[#1d1d1f]";
          const bgClass = classes.split(" ").find(c => c.startsWith("bg-"));
          const borderClass = classes.split(" ").find(c => c.startsWith("border-"));
          const textClass = classes.split(" ").find(c => c.startsWith("text-"));
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
