import ReactMarkdown from "react-markdown";
import type { ChatMessage as Msg } from "@/lib/types";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatMessage({ message }: { message: Msg }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-2xl rounded-br-sm bg-teal-600 px-3.5 py-2 text-sm text-white"
            : "max-w-[85%] rounded-2xl rounded-bl-sm bg-black/5 px-3.5 py-2 text-sm text-foreground dark:bg-white/10"
        }
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-a:text-teal-600 dark:prose-a:text-teal-400">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
      </div>
      <span className="mt-0.5 px-1 text-[10px] text-foreground/40">{formatTime(message.ts)}</span>
    </div>
  );
}
