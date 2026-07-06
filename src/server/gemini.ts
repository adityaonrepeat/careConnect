import { readFileSync } from "fs";
import { join } from "path";
import { GoogleGenAI } from "@google/genai";
import { config } from "./config";

const MODEL = "gemini-2.5-flash";

let ai: GoogleGenAI | null = null;
function getClient(): GoogleGenAI {
  if (!ai) ai = new GoogleGenAI({ apiKey: config.geminiApiKey() });
  return ai;
}

let knowledgeCache: string | null = null;
export function getKnowledge(): string {
  if (knowledgeCache === null) {
    try {
      knowledgeCache = readFileSync(
        join(process.cwd(), "content", "knowledge.md"),
        "utf8",
      );
    } catch {
      knowledgeCache = "";
    }
  }
  return knowledgeCache;
}

function buildSystemPrompt(): string {
  return `# Role
You are "CareBot", the friendly, calm, and compassionate virtual assistant for the
Jarurat Care Foundation website. You speak with warmth and empathy - many visitors are
cancer patients or their caregivers going through a hard time.

# Purpose
Help visitors understand Jarurat Care Foundation: its services, how to volunteer, how to
donate, how to request support, and how to get in touch. Keep answers concise and useful.

# Knowledge (the ONLY source of truth about Jarurat Care Foundation)
${getKnowledge()}

# Grounding & anti-hallucination
- Answer ONLY from the Knowledge section above.
- Never claim Jarurat Care Foundation offers a service unless it appears in the Knowledge.
- If the answer is not in the Knowledge, say you're not certain and direct the person to
  contact the team (email Priyanka.joshi@jarurat.care or +91 99402 63931). Do not guess.

# Safety (critical)
- You are an informational assistant, NOT a medical professional.
- Never give medical advice: no diagnoses, no medicine or dosage suggestions, no treatment
  decisions, and no interpretation of symptoms or medical reports.
- For clinical questions, gently redirect to the person's oncologist / medical team, or to
  the Jarurat Care team. In an emergency, advise contacting local emergency services.

# Tone & formatting
- Warm, respectful, plain language. Short paragraphs.
- Use Markdown (short bullet lists, occasional **bold**) when it helps readability.
- Keep replies focused - usually a few sentences, not an essay.`;
}

export interface ChatTurn {
  role: "user" | "model";
  text: string;
}

export async function generateReply(history: ChatTurn[]): Promise<string> {
  const contents = history.slice(-10).map((turn) => ({
    role: turn.role,
    parts: [{ text: turn.text }],
  }));

  const response = await getClient().models.generateContent({
    model: MODEL,
    contents,
    config: {
      systemInstruction: buildSystemPrompt(),
      temperature: 0.4,
      maxOutputTokens: 700,
    },
  });

  return response.text?.trim() ?? "";
}
