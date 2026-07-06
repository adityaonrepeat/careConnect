import { schemaByKind, type SubmissionKind } from "@/lib/schemas";
import { genRefId } from "@/lib/refId";
import { getSupabase } from "@/server/supabase";
import type { SubmitResponse } from "@/lib/types";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  const { kind, data } = (body ?? {}) as { kind?: string; data?: unknown };

  if (!kind || !(kind in schemaByKind)) {
    return json({ ok: false, error: "Unknown submission type." }, 400);
  }

  const rawWebsite = (data as { website?: unknown })?.website;
  if (typeof rawWebsite === "string" && rawWebsite.trim() !== "") {
    return json({ ok: true, refId: genRefId() });
  }

  const parsed = schemaByKind[kind as SubmissionKind].safeParse(data);
  if (!parsed.success) {
    return json({ ok: false, error: "Please check the form and try again." }, 400);
  }

  const clean = { ...parsed.data } as Record<string, unknown>;
  delete clean.website;

  const refId = genRefId();

  try {
    const { error } = await getSupabase()
      .from("submissions")
      .insert({
        kind,
        name: clean.name as string,
        email: clean.email as string,
        phone: (clean.phone as string | undefined) ?? null,
        payload: { ...clean, refId },
      });

    if (error) {
      console.error("[submit] supabase insert error:", error.message);
      return json(
        { ok: false, error: "We couldn't save your request. Please try again shortly." },
        500,
      );
    }
  } catch (err) {
    console.error("[submit] insert threw:", err);
    return json(
      { ok: false, error: "We couldn't save your request. Please try again shortly." },
      500,
    );
  }

  return json({ ok: true, refId });
}

function json(payload: SubmitResponse, status = 200) {
  return Response.json(payload, { status });
}
