"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Logo } from "./Logo";

const links = [
  { label: "Product", href: "#features" },
  { label: "Contact", href: "#contact" },
  { label: "Playground", href: "/playground" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 24);
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4">
      <motion.div
        animate={{
          backgroundColor: scrolled ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0)",
          borderColor: scrolled ? "rgba(228,232,236,1)" : "rgba(228,232,236,0)",
          backdropFilter: scrolled ? "blur(12px)" : "blur(0px)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex w-full max-w-6xl items-center justify-between rounded-full border px-4 py-2.5 sm:px-5"
      >
        <a href="/" className="flex items-center">
          <Logo />
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-[13.5px] text-ink-mid hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="btn-primary text-[13px] py-1.5 px-3.5 rounded-full">
          Get in touch
        </a>
      </motion.div>
    </header>
  );
}
