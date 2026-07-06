import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatMessage, ChatResponse } from "@/lib/types";

const STORAGE_KEY = "careconnect.chat.v1";
const MAX_STORED = 20;

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(-MAX_STORED) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages: ChatMessage[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
  } catch {}
}

const NETWORK_FALLBACK =
  "I couldn't reach the server just now. Please contact Jarurat Care Foundation at " +
  "Priyanka.joshi@jarurat.care or +91 99402 63931.";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    const history = loadHistory();
    if (history.length) setMessages(history);
  }, []);

  useEffect(() => {
    messagesRef.current = messages;
    if (messages.length) saveHistory(messages);
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const clean = text.trim();
      if (!clean || isLoading) return;

      const userMsg: ChatMessage = { id: uid(), role: "user", content: clean, ts: Date.now() };
      const next = [...messagesRef.current, userMsg];
      setMessages(next);
      setIsLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        const data = (await res.json()) as ChatResponse;
        const botMsg: ChatMessage = {
          id: uid(),
          role: "assistant",
          content: data.reply?.trim() || NETWORK_FALLBACK,
          ts: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: "assistant", content: NETWORK_FALLBACK, ts: Date.now() },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading],
  );

  const clear = useCallback(() => {
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return { messages, isLoading, send, clear };
}
