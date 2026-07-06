import { AlertTriangle } from "lucide-react";

export function EmergencyBanner() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-lg border border-amber-500/40 bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <p>
        <strong>Medical emergency?</strong> This form is not monitored in real time. If you
        or someone else needs urgent care, please contact your local emergency services
        immediately.
      </p>
    </div>
  );
}
