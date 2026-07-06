import { Hero } from "@/components/Hero";
import { Tabs } from "@/components/Tabs";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />

      <section className="mx-auto w-full max-w-3xl px-4 pb-16">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5 sm:p-7">
          <Tabs />
        </div>
      </section>

      <footer className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-xs text-foreground/50">
          <p>
            CareConnect is a concept prototype for{" "}
            <a
              href="https://www.jarurat.care"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 underline dark:text-teal-400"
            >
              Jarurat Care Foundation
            </a>
            . CareBot is an informational assistant and does not provide medical advice.
          </p>
          <p className="mt-1">Contact: Priyanka.joshi@jarurat.care · +91 99402 63931</p>
        </div>
      </footer>
    </main>
  );
}
