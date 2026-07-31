import Link from "next/link";
import Card from "@/components/ui/Card";
import Text from "@/components/ui/Typography";

export default function AtomInfoIndexPage() {
  return (
    <main className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center p-6 animate-fade-in">
      <div className="w-[420px] h-[340px] flex items-center justify-center">
        <Card className="flex flex-col justify-between items-center text-center p-8">
          {/* Header Icon */}
          <div className="h-14 w-14 rounded-full bg-brand/10 flex items-center justify-center text-brand shadow-sm mt-2">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Texts */}
          <div className="flex flex-col gap-2 mt-4">
            <Text variant="h2" className="text-[#1d1d1f] font-extrabold tracking-tight">
              Select an Element
            </Text>
            <Text variant="body" className="text-zinc-500 leading-normal">
              Please visit the periodic table first and choose an element to see its chemical details and Bohr model.
            </Text>
          </div>

          {/* Action Button */}
          <div className="w-full mt-6">
            <Link
              href="/periodic-table"
              className="w-full bg-brand hover:bg-brand-hover text-white flex items-center justify-between gap-3 py-2.5 pl-6 pr-2 rounded-full transition-all font-semibold text-[15px] tracking-tight active:scale-[0.98] cursor-pointer shadow-sm"
            >
              <span>Choose Element</span>
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 text-brand shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </span>
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}
