import { generateReply, type ChatTurn } from "@/server/gemini";
import { detectMedicalIntent, MEDICAL_SAFE_REPLY } from "@/server/medicalGuard";
import type { ChatResponse } from "@/lib/types";

const FALLBACK =
  "I don't have enough information to answer that accurately. If you'd like immediate " +
  "assistance, you can contact Jarurat Care Foundation directly:\n\n" +
  "- **Email:** Priyanka.joshi@jarurat.care\n- **Phone / WhatsApp:** +91 99402 63931";

const WINDOW_MS = 60_000;
const MAX_REQ = 15;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQ;
}

function getIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  return xff?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return reply({ reply: FALLBACK, error: "bad request" }, 400);
  }

  const messages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(messages)) {
    return reply({ reply: FALLBACK, error: "no messages" }, 400);
  }

  const raw = messages as Array<{ role?: unknown; content?: unknown }>;
  const turns: ChatTurn[] = raw
    .filter(
      (m) =>
        typeof m?.content === "string" &&
        (m.role === "user" || m.role === "assistant"),
    )
    .slice(-10)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      text: (m.content as string).trim().slice(0, 2000),
    }));

  if (turns.length === 0) {
    return reply({ reply: FALLBACK, error: "empty" }, 400);
  }

  if (rateLimited(getIp(request))) {
    return reply(
      { reply: "You're sending messages very quickly - please wait a moment and try again." },
      429,
    );
  }

  const lastUser = [...turns].reverse().find((t) => t.role === "user");
  if (lastUser && detectMedicalIntent(lastUser.text)) {
    return reply({ reply: MEDICAL_SAFE_REPLY, blocked: true });
  }

  try {
    const text = await generateReply(turns);
    return reply({ reply: text || FALLBACK });
  } catch (err) {
    console.error("[chat] gemini error:", err);
    return reply({ reply: FALLBACK, error: "model error" });
  }
}

function reply(payload: ChatResponse, status = 200) {
  return Response.json(payload, { status });
}
