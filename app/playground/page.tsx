import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HungryDB - Playground",
  description: "Interactive prototype of the HungryDB workspace.",
};

export default function PlaygroundPage() {
  return (
    <div className="fixed inset-0 bg-white">
      <iframe
        src="/playground/index.html"
        title="HungryDB Playground"
        className="h-full w-full border-0"
      />
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 inline-flex items-center gap-2 rounded-full border border-line bg-white/90 px-3.5 py-2 text-[13px] font-medium text-ink shadow-[0_8px_24px_-12px_rgba(15,20,25,0.18)] backdrop-blur hover:bg-white transition"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 7H3m0 0l3.5-3.5M3 7l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to landing
      </Link>
    </div>
  );
}
