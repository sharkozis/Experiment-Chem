'use client';

import { useState, useEffect, use } from "react";
import { ElementData } from "@/types/element";
import InfoCard from "@/components/InfoCard";
import AnimationCard from "@/components/AnimationCard";
import Text from "@/components/ui/Typography";
import Link from "next/link";

interface PageProps {
  params: Promise<{ symbol: string }>;
}

export default function AtomInfoPage({ params }: PageProps) {
  const { symbol } = use(params);
  const targetSymbol = symbol.toLowerCase();

  const [element, setElement] = useState<ElementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAtom, setShowAtom] = useState(false);

  useEffect(() => {
    fetch("/data/periodic_table.json")
      .then((res) => res.json())
      .then((data: ElementData[]) => {
        const found = data.find((el) => el.symbol.toLowerCase() === targetSymbol);
        if (found) {
          setElement(found);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load element data:", err);
        setLoading(false);
      });
  }, [targetSymbol]);

  if (loading) {
    return (
      <div className="relative rounded-2xl bg-zinc-200/50 p-[1px]">
        <div className="relative flex h-[520px] w-[360px] flex-col justify-between overflow-hidden rounded-2xl bg-white p-8 shadow-inner animate-pulse">
          <div className="flex justify-between items-start">
            <div className="h-10 w-10 bg-zinc-100 rounded-lg" />
            <div className="h-8 w-24 bg-zinc-100 rounded-lg" />
          </div>
          <div className="my-auto flex flex-col items-center gap-4">
            <div className="h-28 w-28 bg-zinc-100 rounded-xl" />
            <div className="h-6 w-32 bg-zinc-100 rounded-lg" />
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="h-6 w-16 bg-zinc-100 rounded-lg" />
            <div className="h-10 w-full bg-zinc-100 rounded-full" />
            <div className="h-10 w-full bg-zinc-100 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!element) {
    return (
      <div className="text-center flex flex-col gap-4 items-center">
        <Text variant="h2" className="text-zinc-900">Element Not Found</Text>
        <Text variant="body" className="text-zinc-500">
          The element symbol "{symbol}" could not be found in our database.
        </Text>
        <Link
          href="/periodic-table"
          className="mt-2 bg-brand hover:bg-brand-hover text-white py-2.5 px-6 rounded-full font-bold text-sm tracking-wider shadow-sm transition-all"
        >
          Back to Periodic Table
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full gap-6 w-full animate-fade-in py-12 px-6">
      {/* Controls Header (Back) */}
      <div className="flex w-full max-w-[420px] justify-start items-center px-1">
        <Link
          href="/periodic-table"
          className="inline-flex items-center gap-2 py-2 px-4.5 rounded-full bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200/50 font-semibold text-[14px] tracking-tight transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.03)] active:scale-95 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Table
        </Link>
      </div>

      {/* Cards Area (Swapping in-place smoothly with spacious margins and size) */}
      <div className="relative w-[420px] h-[620px] flex items-center justify-center my-8">
        {/* Info Card Container */}
        <div className={`absolute inset-0 transition-all duration-500 ease-out transform ${
          showAtom 
            ? "opacity-0 scale-95 pointer-events-none translate-y-4" 
            : "opacity-100 scale-100 pointer-events-auto translate-y-0"
        }`}>
          <InfoCard
            element={element}
            showAtom={showAtom}
            onToggleAtom={() => setShowAtom(true)}
          />
        </div>

        {/* Animation Card Container */}
        <div className={`absolute inset-0 transition-all duration-500 ease-out transform ${
          showAtom 
            ? "opacity-100 scale-100 pointer-events-auto translate-y-0" 
            : "opacity-0 scale-95 pointer-events-none translate-y-4"
        }`}>
          <AnimationCard
            element={element}
            showAtom={showAtom}
            onToggleAtom={() => setShowAtom(false)}
          />
        </div>
      </div>
    </div>
  );
}
