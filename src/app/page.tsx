import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-full w-full flex items-center justify-center overflow-hidden bg-[#f5f5f7]">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out scale-105"
        style={{ backgroundImage: "url('/images/bg.png')" }}
      />
      {/* Soft gradient overlay for premium depth and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f5f5f7]/30 via-[#f5f5f7]/70 to-[#f5f5f7] backdrop-blur-[1px]" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8 py-12">
        {/* Decorative Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold uppercase tracking-wider select-none">
          <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
          Virtual Chemistry Lab
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1d1d1f] leading-tight font-sans max-w-3xl">
          Explore Chemistry Through{" "}
          <span className="bg-gradient-to-r from-brand to-[#00a6ff] bg-clip-text text-transparent">
            Interactive Experiments
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-zinc-600 font-medium leading-relaxed max-w-2xl">
          Discover hands-on virtual labs, exciting experiments, quizzes, animations, and visual learning experiences designed to make chemistry fun, interactive, and easy to understand for every science enthusiast.
        </p>

        {/* CTA Button */}
        <div className="mt-4">
          <Link
            href="/periodic-table"
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-brand hover:bg-brand-hover text-white font-bold rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(0,113,227,0.3)] hover:shadow-[0_8px_30px_rgba(0,113,227,0.45)] hover:scale-105 active:scale-[0.98] cursor-pointer group"
          >
            <span>Start Exploring</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1.5 font-bold">
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
