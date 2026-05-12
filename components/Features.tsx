"use client";

import { motion } from "framer-motion";

/* ─────────── Visuals ─────────── */

function FormatsVisual() {
  const tiles = [
    { l: "XLSX", c: "#1F9F5A" },
    { l: "PDF", c: "#D24637" },
    { l: "CSV", c: "#2563EB" },
    { l: "MDB", c: "#C97A0F" },
    { l: "JPG", c: "#7A5AF8" },
    { l: "TXT", c: "#64748B" },
  ];
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="grid grid-cols-3 gap-2 -rotate-[8deg]">
        {tiles.map((t, i) => (
          <motion.div
            key={t.l}
            initial={{ y: 14, opacity: 0, rotate: -8 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="h-14 w-16 rounded-md flex items-end justify-center pb-1.5 text-[9px] font-mono font-bold text-white shadow-[0_10px_20px_-10px_rgba(15,20,25,0.35)]"
            style={{ background: t.c }}
          >
            {t.l}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function OCRVisual() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="relative">
        <div className="h-28 w-22 rounded-md bg-[#FFFBEB] border border-[#F0E6CC] shadow-[0_12px_28px_-12px_rgba(15,20,25,0.25)] overflow-hidden">
          <div className="p-2.5 space-y-1.5">
            {[0.85, 0.6, 0.9, 0.5, 0.75, 0.4].map((w, i) => (
              <div
                key={i}
                className="h-[2px] rounded bg-ink/25"
                style={{ width: `${w * 100}%` }}
              />
            ))}
          </div>
        </div>
        <motion.div
          animate={{ y: [0, 100, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-0 right-0 h-[2px] bg-accent shadow-[0_0_12px_rgba(31,159,90,0.55)]"
          style={{ top: 0 }}
        />
        <motion.div
          aria-hidden
          animate={{ opacity: [0.0, 0.55, 0.0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-1 rounded-md bg-accent/15 blur-md pointer-events-none"
        />
      </div>
    </div>
  );
}

function AuditVisual() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <svg width="220" height="100" viewBox="0 0 220 100" fill="none" className="overflow-visible">
        <motion.path
          d="M16 56 Q70 8 110 56 T204 56"
          stroke="#1F9F5A"
          strokeWidth="1.6"
          strokeDasharray="3 4"
          fill="none"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        <motion.circle
          cx="16" cy="56" r="5" fill="#1F9F5A"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        />
        <motion.circle
          cx="204" cy="56" r="5" fill="#1F9F5A"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
        />
        <text x="16" y="42" fontSize="9" fill="#8A95A1" textAnchor="middle" fontFamily="JetBrains Mono">PDF</text>
        <text x="204" y="42" fontSize="9" fill="#8A95A1" textAnchor="middle" fontFamily="JetBrains Mono">ROW</text>
      </svg>
    </div>
  );
}

function QueryVisual() {
  return (
    <div className="relative h-full w-full flex flex-col items-stretch justify-end gap-3 px-2">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="rounded-md border border-line bg-bg-warm px-3 py-2 text-[12px] font-mono text-ink-mid"
      >
        <span className="text-accent">›</span> revenue by client, last 12 months
      </motion.div>
      <div className="grid grid-cols-6 gap-2 items-end h-16">
        {[0.45, 0.6, 0.78, 0.5, 0.92, 0.66].map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-sm bg-gradient-to-t from-accent/35 to-accent/75"
          />
        ))}
      </div>
    </div>
  );
}

function SecurityVisual() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="relative h-28 w-28 rounded-full border border-dashed border-line"
      >
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-accent shadow-[0_0_10px_rgba(31,159,90,0.6)]" />
      </motion.div>
      <div className="absolute h-14 w-14 rounded-full border border-accent/40 bg-accent-soft flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1F9F5A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l9 4v6c0 5.5-3.8 10.7-9 12-5.2-1.3-9-6.5-9-12V6l9-4z" />
        </svg>
      </div>
    </div>
  );
}

function ExportsVisual() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="relative h-24 w-24">
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.35, 0.65, 0.35] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
        />
        <div className="absolute inset-2 rounded-full border border-accent/35 bg-white flex items-center justify-center">
          <span className="text-[10px] font-mono font-semibold text-accent">db</span>
        </div>
        {[0, 90, 180, 270].map((deg, i) => (
          <motion.span
            key={deg}
            animate={{ scale: [1, 1.5, 1], opacity: [0.9, 0.15, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.55, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent"
            style={{ transform: `rotate(${deg}deg) translate(40px, 0)` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────── Grid ─────────── */

const features = [
  { title: "Any source format", body: "Excel, CSV, Google Sheets, scanned PDFs, paper, .mdb, even desktop ERP exports nobody else can read.", span: "lg:col-span-2", Visual: FormatsVisual },
  { title: "OCR for paper", body: "Decades of binders. Stacks of receipts. Handwritten ledgers. We digitise and structure them.", span: "lg:col-span-1", Visual: OCRVisual },
  { title: "Source-tied audit", body: "Every row links back to the original file, page, and cell.", span: "lg:col-span-1", Visual: AuditVisual },
  { title: "Plain-language queries", body: "Ask a question in any language. Get rows, charts, or a full report. No SQL.", span: "lg:col-span-2", Visual: QueryVisual },
  { title: "Encrypted by default", body: "End-to-end encryption. Your data stays yours.", span: "lg:col-span-1", Visual: SecurityVisual },
  { title: "Live exports anywhere", body: "Push to Postgres, Notion, Sheets. Or grab clean Excel any time.", span: "lg:col-span-1", Visual: ExportsVisual },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 bg-bg-warm/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <span className="eyebrow">What it is</span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-3 text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] font-bold text-ink"
          >
            A database that ships <span className="text-accent">with its own migration.</span>
          </motion.h2>
        </div>

        <div className="mt-14 grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative rounded-[16px] border border-line bg-white p-7 flex flex-col gap-5 overflow-hidden hover:border-ink-mute/40 transition-colors ${f.span ?? ""}`}
            >
              <div>
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[14px] leading-[1.55] text-ink-mid max-w-[38ch]">{f.body}</p>
              </div>
              <div className="relative mt-auto h-[170px] w-full">
                <f.Visual />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
