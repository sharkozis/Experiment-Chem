'use client';

import { useEffect } from "react";

class ClickSoundManager {
  private pool: HTMLAudioElement[] = [];
  private poolSize = 4;
  private currentIndex = 0;
  private initialized = false;

  init() {
    if (this.initialized || typeof window === "undefined") return;
    try {
      for (let i = 0; i < this.poolSize; i++) {
        const audio = new Audio("/sounds/2.mp3");
        audio.preload = "auto";
        audio.volume = 0.5;
        this.pool.push(audio);
      }
      this.initialized = true;
    } catch (e) {
      // audio creation error handled safely
    }
  }

  play() {
    if (!this.initialized) {
      this.init();
    }
    if (this.pool.length === 0) return;

    try {
      const sound = this.pool[this.currentIndex];
      this.currentIndex = (this.currentIndex + 1) % this.pool.length;
      sound.currentTime = 0;
      sound.play().catch(() => {
        // autoplay / gesture restrictions handled safely
      });
    } catch (e) {
      // ignore
    }
  }
}

export const soundManager = new ClickSoundManager();

export function playClickSound() {
  soundManager.play();
}

export default function SoundEffects() {
  useEffect(() => {
    soundManager.init();

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect button or elements acting as buttons
      const button = target.closest('button, [role="button"], input[type="button"], input[type="submit"]');
      if (button) {
        soundManager.play();
      }
    };

    // Attach in capture phase so all button clicks are caught reliably
    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return null;
}

