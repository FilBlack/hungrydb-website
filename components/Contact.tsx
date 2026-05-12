"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type Status = "idle" | "submitting" | "ok" | "err";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || "").trim(),
      organization: String(form.get("organization") || "").trim(),
      email: String(form.get("email") || "").trim(),
      note: String(form.get("note") || "").trim(),
    };

    if (!payload.name || !payload.organization || !payload.email) {
      setStatus("err");
      setError("Name, organization and email are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      setStatus("err");
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      setStatus("err");
      setError(err?.message || "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Pricing</span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-3 text-[34px] sm:text-[44px] leading-[1.05] tracking-[-0.02em] font-bold text-ink"
          >
            Built around <span className="text-accent">your data.</span>
          </motion.h2>
          <p className="mt-5 text-[16px] text-ink-mid">
            Tell us what you have. We&apos;ll shape an offer that fits.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="mt-14 mx-auto max-w-2xl rounded-[16px] border border-line bg-white p-8 sm:p-10"
        >
          <div className="flex items-center gap-2">
            <span className="pill-dot" />
            <span className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-mute">
              Custom · Contact us
            </span>
          </div>
          <h3 className="mt-4 text-[24px] font-semibold tracking-[-0.01em] text-ink">
            One quote. One database. Yours.
          </h3>
          <p className="mt-2 text-[14px] text-ink-mid">
            Share a few details and we&apos;ll come back with a scoped proposal.
          </p>

          {status === "ok" ? (
            <div className="mt-7 rounded-[12px] border border-accent/30 bg-accent-soft px-5 py-6 text-[14px] text-ink">
              <p className="font-semibold text-accent">Message received.</p>
              <p className="mt-1 text-ink-mid">
                We&apos;ll reply to your address shortly. No follow-up needed from your side.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-7 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" required placeholder="Jane Doe" />
                <Field label="Organization" name="organization" required placeholder="Acme GmbH" />
              </div>
              <Field label="Email" name="email" type="email" required placeholder="jane@acme.com" />
              <div>
                <label className="text-[12.5px] font-medium text-ink-mid">
                  What should we know?{" "}
                  <span className="text-ink-mute font-normal">(optional)</span>
                </label>
                <textarea
                  name="note"
                  rows={4}
                  placeholder="A line or two about your data: formats, volume, what's painful today."
                  className="mt-2 w-full rounded-[10px] border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition"
                />
              </div>

              {status === "err" && (
                <p className="text-[13px] text-[#D24637]">{error}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary justify-center text-[14px] py-3 rounded-[10px] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Sending…" : "Send"}
                {status !== "submitting" && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7h8m0 0L7.5 3.5M11 7l-3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[12.5px] font-medium text-ink-mid">
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-[10px] border border-line bg-white px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-mute focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/15 transition"
      />
    </div>
  );
}
