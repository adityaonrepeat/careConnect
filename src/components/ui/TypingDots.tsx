export function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="CareBot is typing">
      <span className="cb-dot h-1.5 w-1.5 rounded-full bg-foreground/50" />
      <span className="cb-dot h-1.5 w-1.5 rounded-full bg-foreground/50 [animation-delay:150ms]" />
      <span className="cb-dot h-1.5 w-1.5 rounded-full bg-foreground/50 [animation-delay:300ms]" />
    </span>
  );
}
