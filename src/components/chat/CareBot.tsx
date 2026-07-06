"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { QuickActions } from "./QuickActions";
import { TypingDots } from "@/components/ui/TypingDots";

export function CareBot() {
  const [open, setOpen] = useState(false);
  const { messages, isLoading, send } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close CareBot" : "Open CareBot chat"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-teal-600 text-white shadow-lg transition hover:scale-105 hover:bg-teal-700 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="CareBot chat"
          className="cb-slide-in fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[560px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-black/10 bg-background shadow-2xl dark:border-white/10"
        >
          <header className="bg-teal-600 px-4 py-3 text-white">
            <p className="flex items-center gap-2 font-semibold">
              CareBot
              <span className="inline-flex items-center gap-1 text-xs font-normal opacity-90">
                <span className="h-2 w-2 rounded-full bg-emerald-300" /> Online
              </span>
            </p>
            <p className="text-[11px] opacity-80">Informational assistant - not medical advice</p>
          </header>

          <div ref={scrollRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-black/5 px-3.5 py-2 text-sm text-foreground dark:bg-white/10">
                  Hello! I&apos;m CareBot, the Jarurat Care Foundation assistant. I can help you
                  learn about our services, volunteering, donations, medical report review, and
                  how to get in touch. I can&apos;t provide medical advice, but I&apos;ll do my
                  best to guide you to the right resources.
                </div>
                <QuickActions onPick={send} disabled={isLoading} />
              </div>
            )}

            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}

            {isLoading && (
              <div className="flex items-start">
                <div className="rounded-2xl rounded-bl-sm bg-black/5 px-3.5 py-2.5 dark:bg-white/10">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          <ChatInput ref={inputRef} onSend={send} disabled={isLoading} />
        </div>
      )}
    </>
  );
}
