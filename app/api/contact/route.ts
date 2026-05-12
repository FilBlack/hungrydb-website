import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  name: string;
  organization: string;
  email: string;
  note?: string;
};

function validate(body: any): { ok: true; data: Payload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid body." };
  const name = String(body.name || "").trim();
  const organization = String(body.organization || "").trim();
  const email = String(body.email || "").trim();
  const note = String(body.note || "").trim();
  if (!name) return { ok: false, error: "Name is required." };
  if (!organization) return { ok: false, error: "Organization is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Invalid email address." };
  if (name.length > 200 || organization.length > 200 || email.length > 320 || note.length > 4000) {
    return { ok: false, error: "Submission too large." };
  }
  return { ok: true, data: { name, organization, email, note } };
}

async function persist(entry: Payload & { receivedAt: string }) {
  const dataDir = path.join(process.cwd(), "data");
  await fs.mkdir(dataDir, { recursive: true });
  const file = path.join(dataDir, "contacts.jsonl");
  await fs.appendFile(file, JSON.stringify(entry) + "\n", "utf8");
}

async function sendViaResend(entry: Payload & { receivedAt: string }): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM;
  if (!key || !to || !from) return false;

  const subject = `[HungryDB] New inquiry from ${entry.organization}`;
  const text = [
    `Name: ${entry.name}`,
    `Organization: ${entry.organization}`,
    `Email: ${entry.email}`,
    `Received: ${entry.receivedAt}`,
    "",
    "Note:",
    entry.note || "(none)",
  ].join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: entry.email,
      subject,
      text,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend failed: ${res.status} ${detail}`);
  }
  return true;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Malformed JSON." }, { status: 400 });
  }
  const v = validate(body);
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });

  const entry = { ...v.data, receivedAt: new Date().toISOString() };

  try {
    await persist(entry);
  } catch (err) {
    console.error("[contact] persist failed:", err);
    return NextResponse.json({ error: "Failed to record submission." }, { status: 500 });
  }

  let emailed = false;
  try {
    emailed = await sendViaResend(entry);
  } catch (err) {
    console.error("[contact] email failed:", err);
  }

  return NextResponse.json({ ok: true, emailed });
}
