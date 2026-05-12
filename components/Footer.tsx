"use client";

import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <Logo />
        <p className="text-[12.5px] text-ink-mute font-mono">
          © {new Date().getFullYear()} HungryDB
        </p>
      </div>
    </footer>
  );
}
