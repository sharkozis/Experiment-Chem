'use client';

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Reset scroll position of the scroll parent container to the top
    const scrollContainer = el.parentElement;
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }

    // Set initial transition state
    gsap.set(el, { opacity: 0, y: 12 });

    // Animate content to full visibility smoothly
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.45,
      ease: "power2.out",
      clearProps: "transform", // Clears transforms after animation for better rendering/layout
    });
  }, [pathname]);

  return (
    <div ref={containerRef} className="flex-1 flex flex-col w-full">
      {children}
    </div>
  );
}
