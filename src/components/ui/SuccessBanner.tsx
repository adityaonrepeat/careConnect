import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

export function SuccessBanner({
  title,
  refId,
  children,
  onReset,
  resetLabel = "Submit another request",
}: {
  title: string;
  refId?: string;
  children: ReactNode;
  onReset: () => void;
  resetLabel?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="cb-pop flex flex-col items-center gap-3 rounded-xl border border-teal-500/30 bg-teal-50 p-6 text-center dark:bg-teal-500/10"
    >
      <CheckCircle2 className="h-12 w-12 text-teal-600 dark:text-teal-400" aria-hidden />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {refId && (
        <p className="text-sm text-foreground/70">
          Reference ID:{" "}
          <span className="rounded bg-teal-600/10 px-2 py-0.5 font-mono font-semibold text-teal-700 dark:text-teal-300">
            {refId}
          </span>
        </p>
      )}
      <div className="text-sm leading-relaxed text-foreground/80">{children}</div>
      <button
        type="button"
        onClick={onReset}
        className="mt-1 rounded-lg border border-teal-600/40 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-600/10 dark:text-teal-300"
      >
        {resetLabel}
      </button>
    </div>
  );
}
