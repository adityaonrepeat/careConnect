"use client";

import { forwardRef, useState, type FormEvent } from "react";
import { SendHorizontal } from "lucide-react";

export const ChatInput = forwardRef<
  HTMLInputElement,
  { onSend: (text: string) => void; disabled?: boolean }
>(function ChatInput({ onSend, disabled }, ref) {
  const [value, setValue] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-black/10 p-2 dark:border-white/10">
      <input
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
        placeholder="Ask about services, volunteering…"
        aria-label="Message CareBot"
        className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-3.5 py-2 text-sm outline-none transition focus:border-teal-500 disabled:opacity-60 dark:border-white/15 dark:bg-white/5"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 disabled:opacity-50"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </form>
  );
});
