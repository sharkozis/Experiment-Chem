'use client';

import Text from "@/components/ui/Typography";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function DesignGuidePage() {
  return (
    <main className="min-h-screen py-12 px-6 flex flex-col gap-8 max-w-4xl text-[#1d1d1f] font-sans">
      <div className="flex flex-col gap-2">
        <Text variant="h1">Design System Guide</Text>
        <Text variant="body">
          A preview of the electric blue theme tokens and UI components based on the Apple reference style.
        </Text>
      </div>

      <div className="border-t border-zinc-200 pt-8 flex flex-col gap-6">
        <Text variant="h2">Typography</Text>
        <div className="flex flex-col gap-4 bg-zinc-100/50 p-6 rounded-2xl border border-zinc-200/50">
          <div className="flex flex-col">
            <Text variant="caption" className="text-zinc-400 mb-1">H1: Poppins Bold 36px</Text>
            <Text variant="h1">Helium Card System</Text>
          </div>
          <div className="flex flex-col mt-2">
            <Text variant="caption" className="text-zinc-400 mb-1">H2: Poppins Bold 24px</Text>
            <Text variant="h2">Atomic Structure Model</Text>
          </div>
          <div className="flex flex-col mt-2">
            <Text variant="caption" className="text-zinc-400 mb-1">Body: Poppins Normal 16px</Text>
            <Text variant="body">This information is fetched dynamically from the element data file.</Text>
          </div>
          <div className="flex flex-col mt-2">
            <Text variant="caption" className="text-zinc-400 mb-1">Caption: Poppins Semibold Uppercase 12px</Text>
            <Text variant="caption">Hover over the orbit to inspect</Text>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-8 flex flex-col gap-6">
        <Text variant="h2">UI Elements & Badges</Text>
        <div className="flex flex-wrap gap-4 bg-zinc-100/50 p-6 rounded-2xl border border-zinc-200/50">
          <div className="flex flex-col gap-2">
            <Text variant="caption" className="text-zinc-400">Pill Badge</Text>
            <Badge variant="pill">
              <svg className="w-3.5 h-3.5 text-[#8e8e93]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mass: 4.0026
            </Badge>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="caption" className="text-zinc-400">Highlight Badge</Text>
            <Badge variant="highlight">
              <span>⚡</span> 1s²
            </Badge>
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-200 pt-8 flex flex-col gap-6">
        <Text variant="h2">Buttons</Text>
        <div className="flex gap-8 bg-zinc-100/50 p-6 rounded-2xl border border-zinc-200/50 items-end">
          <div className="flex flex-col gap-2 w-64">
            <Text variant="caption" className="text-zinc-400">Action Button</Text>
            <Button variant="action">View Helium</Button>
          </div>
          <div className="flex flex-col gap-2">
            <Text variant="caption" className="text-zinc-400">Circular Floating Toggle</Text>
            <Button variant="toggle">
              <svg className="w-6 h-6 text-zinc-950" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
