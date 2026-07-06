import type { SubmitResponse } from "./types";
import type { SubmissionKind } from "./schemas";

export async function submitForm(
  kind: SubmissionKind,
  data: unknown,
): Promise<SubmitResponse> {
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, data }),
    });
    const json = (await res.json()) as SubmitResponse;
    if (!res.ok || !json.ok) {
      return { ok: false, error: json.error ?? "Something went wrong. Please try again." };
    }
    return json;
  } catch {
    return { ok: false, error: "Network error - please check your connection and try again." };
  }
}
