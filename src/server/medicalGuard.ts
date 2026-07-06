const MEDICAL_PATTERNS: RegExp[] = [
  /\b(should|can|could|may)\s+i\b.*\b(take|stop|start|use|change|switch|reduce|increase|skip)\b/i,
  /\b(is it safe to|what('?s| is) the best)\b.*\b(take|stop|use|medicine|drug|treatment|chemo|therapy|dose)\b/i,
  /\bwhich\s+(medicine|drug|chemo|treatment|therapy)\b/i,
  /\b(dose|dosage|side\s?effects?|symptoms?|survival(\s+rate)?)\b/i,
  /\b(fever|bleeding|vomit(ing)?|nausea|pain)\b/i,
];

export function detectMedicalIntent(text: string): boolean {
  return MEDICAL_PATTERNS.some((re) => re.test(text));
}

export const MEDICAL_SAFE_REPLY =
  "I'm not able to give medical advice. For anything about symptoms, medicines, doses, " +
  "or treatment decisions, please consult your oncologist or medical team. You can also " +
  "reach the Jarurat Care Foundation team, who can guide you to the right support:\n\n" +
  "- **Email:** Priyanka.joshi@jarurat.care\n- **Phone / WhatsApp:** +91 99402 63931";
