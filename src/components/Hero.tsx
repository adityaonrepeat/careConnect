import Link from "next/link";
import { HeartPulse, LayoutDashboard } from "lucide-react";

export function Hero() {
  return (
    <header className="bg-linear-to-b from-teal-50 to-transparent dark:from-teal-500/10">
      <div className="mx-auto max-w-3xl px-4 pb-8 pt-12 text-center sm:pt-16">
        <div className="cb-fade-up inline-flex items-center gap-2 rounded-full border border-teal-600/20 bg-white/70 px-3 py-1 text-xs font-medium text-teal-700 dark:bg-white/5 dark:text-teal-300">
          <HeartPulse className="h-3.5 w-3.5" />
          Jarurat Care Foundation
        </div>
        <h1 className="cb-fade-up mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Support for cancer patients, when it matters most
        </h1>
        <p className="cb-fade-up mx-auto mt-3 max-w-xl text-sm leading-relaxed text-foreground/70 sm:text-base">
          Supporting cancer patients through expert guidance, community, and compassionate
          care. Request support, register to volunteer, or ask{" "}
          <strong className="text-teal-700 dark:text-teal-300">CareBot</strong> a question.
        </p>
        <Link
          href="/dashboard"
          className="cb-fade-up mt-6 inline-flex items-center gap-2 rounded-lg border border-teal-600/30 bg-white/60 px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-600/10 dark:bg-white/5 dark:text-teal-300 dark:hover:bg-teal-500/10"
        >
          <LayoutDashboard className="h-4 w-4" />
          View submissions dashboard
        </Link>
      </div>
    </header>
  );
}
