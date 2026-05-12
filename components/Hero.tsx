"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Chip = {
  name: string;
  size: string;
  tag: string;
  color: string;
  top: string;
  left?: string;
  right?: string;
  rot: number;
  delay: number;
  pull: [number, number];
};

const chips: Chip[] = [
  { name: "suppliers_2024.xlsx", size: "2.4 MB",  tag: "XLSX", color: "#1F9F5A", top: "6%",  left: "6%",   rot: -7, delay: 0,    pull: [160, 140] },
  { name: "invoices_q3.pdf",     size: "8.1 MB",  tag: "PDF",  color: "#D24637", top: "10%", right: "6%",  rot: 6,  delay: -1.2, pull: [-160, 130] },
  { name: "ledger_2024.csv",     size: "780 KB",  tag: "CSV",  color: "#2563EB", top: "44%", left: "2%",   rot: 2,  delay: -2.6, pull: [180, 0] },
  { name: "stock_count.jpg",     size: "1.2 MB",  tag: "JPG",  color: "#7A5AF8", top: "48%", right: "2%",  rot: -3, delay: -3.8, pull: [-180, 0] },
  { name: "legacy.mdb",          size: "12.0 MB", tag: "MDB",  color: "#C97A0F", top: "80%", left: "8%",   rot: -5, delay: -5,   pull: [140, -130] },
  { name: "notes.txt",           size: "12 KB",   tag: "TXT",  color: "#64748B", top: "82%", right: "8%",  rot: 4,  delay: -6.2, pull: [-130, -130] },
];

function ChipCard({ c, active }: { c: Chip; active: boolean }) {
  const pos: React.CSSProperties = { top: c.top };
  if (c.left) pos.left = c.left;
  if (c.right) pos.right = c.right;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: active ? 0 : 1,
        scale: active ? 0.7 : 1,
        x: active ? c.pull[0] : 0,
      }}
      transition={{ duration: active ? 0.5 : 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={pos}
      className="absolute hidden lg:block pointer-events-none"
    >
      <motion.div
        animate={active ? { rotate: 0, y: c.pull[1] } : { y: [0, -8, 0], rotate: [c.rot, c.rot + 1.5, c.rot] }}
        transition={
          active
            ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
            : { duration: 8, repeat: Infinity, ease: "easeInOut", delay: c.delay }
        }
        className="flex items-center gap-2.5 rounded-[10px] border border-line bg-white px-3 py-2 shadow-[0_10px_28px_-14px_rgba(15,20,25,0.22)]"
      >
        <span
          className="flex h-7 w-7 items-center justify-center rounded-md text-[9px] font-mono font-bold text-white"
          style={{ background: c.color }}
        >
          {c.tag}
        </span>
        <span className="flex flex-col">
          <span className="text-[11.5px] font-medium text-ink whitespace-nowrap">{c.name}</span>
          <span className="text-[10px] font-mono text-ink-mute">{c.size}</span>
        </span>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [consumed, setConsumed] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 90, damping: 22, mass: 0.6 });
  const smy = useSpring(my, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      mx.set(e.clientX - r.left - r.width / 2);
      my.set(e.clientY - r.top - r.height / 2);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  useEffect(() => {
    router.prefetch("/playground");
  }, [router]);

  function goPlayground() {
    if (consumed) return;
    setConsumed(true);
    setTimeout(() => router.push("/playground"), 300);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }
  function onDragLeave(e: React.DragEvent) {
    e.preventDefault();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragging(false);
  }
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    goPlayground();
  }

  const blobX = useTransform(smx, (v) => v * 0.05);
  const blobY = useTransform(smy, (v) => v * 0.05);

  return (
    <section ref={ref} className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
      <div className="absolute inset-0 grid-bg mask-fade-edges opacity-50 pointer-events-none" />
      <motion.div
        style={{ x: blobX, y: blobY }}
        className="absolute left-1/2 top-32 -translate-x-1/2 h-[640px] w-[900px] rounded-full bg-accent-soft/55 blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ x: useTransform(smx, (v) => -v * 0.03), y: useTransform(smy, (v) => -v * 0.03) }}
        className="absolute right-[10%] top-24 h-[260px] w-[260px] rounded-full bg-[#DFF4E6]/70 blur-[90px] pointer-events-none"
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="pill mx-auto"
        >
          <span className="relative inline-flex h-1.5 w-1.5">
            <motion.span
              animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              className="absolute inline-flex h-full w-full rounded-full bg-accent"
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Migration as the product
        </motion.div>

        <h1 className="mt-7 text-balance text-[44px] leading-[1.02] tracking-[-0.03em] font-bold text-ink sm:text-[68px] lg:text-[80px]">
          {["Drop", "the", "chaos."].map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.22em]"
            >
              {w}
            </motion.span>
          ))}
          <br />
          {["Leave", "with", "a"].map((w, i) => (
            <motion.span
              key={`b${i}`}
              initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.4 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.22em]"
            >
              {w}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, y: 26, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.9, delay: 0.62, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block text-accent"
          >
            database.
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mx-auto mt-7 max-w-xl text-[17px] leading-[1.55] text-ink-mid"
        >
          The database is the output, not the prerequisite.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.a
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            href="#contact"
            className="btn-primary rounded-full px-5 py-3 text-[14px] shadow-[0_10px_30px_-10px_rgba(31,159,90,0.5)]"
          >
            Talk to us
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
          <motion.a
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            href="/playground"
            className="btn-ghost rounded-full px-5 py-3 text-[14px]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M4 3l5 3-5 3V3z" fill="currentColor" />
            </svg>
            Open playground
          </motion.a>
        </motion.div>

        {/* Drop stage. Uses flex to center the dropzone; chips are absolute. */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 mx-auto flex items-center justify-center"
          style={{ maxWidth: 1080, height: 460 }}
        >
          {chips.map((c, i) => (
            <ChipCard key={i} c={c} active={dragging || consumed} />
          ))}

          <motion.button
            type="button"
            onClick={goPlayground}
            onDragEnter={onDragOver}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            animate={{
              scale: dragging ? 1.015 : 1,
              borderColor: dragging ? "rgba(31,159,90,0.9)" : "rgba(228,232,236,1)",
              backgroundColor: dragging ? "rgba(223,244,230,0.55)" : "rgba(255,255,255,1)",
            }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-[280px] w-[min(720px,92%)] items-center justify-center rounded-[16px] border-[1.5px] border-dashed text-left cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-accent/25"
            aria-label="Enter the playground"
          >
            <motion.div
              aria-hidden
              animate={{ opacity: dragging ? [0.35, 0.6, 0.35] : [0.15, 0.35, 0.15] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -inset-px rounded-[16px] bg-accent/10 blur-xl pointer-events-none"
            />
            <div className="relative flex flex-col items-center gap-3 pointer-events-none px-6 text-center">
              <motion.div
                animate={{ scale: dragging ? [1, 1.12, 1] : [1, 1.06, 1] }}
                transition={{ duration: dragging ? 1.2 : 2.6, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m0 0l-5-5m5 5l-5 5" />
                </svg>
              </motion.div>
              <p className="text-[18px] font-semibold text-ink">
                {consumed ? "Opening playground..." : dragging ? "Release to enter" : "Enter the playground"}
              </p>
              <p className="font-mono text-[12px] text-ink-mute">
                XLSX · CSV · PDF · JPG · MDB · TXT
              </p>
              <p className="text-[12px] text-ink-mute">
                Drop a file or click to explore the live workspace
              </p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
