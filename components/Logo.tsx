"use client";

export function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-[8px] bg-accent text-white"
        style={{ width: size, height: size }}
      >
        <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 16 16" fill="none">
          <ellipse cx="8" cy="4" rx="5.5" ry="1.8" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2.5 4v8c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8V4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2.5 8c0 1 2.5 1.8 5.5 1.8s5.5-.8 5.5-1.8" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
      <span className="text-[17px] font-bold tracking-[-0.01em] text-ink">
        HungryDB
      </span>
    </div>
  );
}
