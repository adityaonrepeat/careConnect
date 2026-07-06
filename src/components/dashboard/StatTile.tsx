export function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs text-foreground/60">{label}</p>
      <p
        className={
          "mt-1 text-2xl font-bold tabular-nums " +
          (accent ? "text-teal-600 dark:text-teal-400" : "text-foreground")
        }
      >
        {value}
      </p>
    </div>
  );
}
