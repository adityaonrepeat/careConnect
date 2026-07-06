export function BarChart({
  title,
  data,
}: {
  title: string;
  data: { label: string; value: number }[];
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <figure className="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/5">
      <figcaption className="text-sm font-medium text-foreground">{title}</figcaption>
      {data.length === 0 ? (
        <p className="mt-4 text-sm text-foreground/50">No data yet.</p>
      ) : (
        <div className="mt-4 flex flex-col gap-2.5">
          {data.map((d) => (
            <div
              key={d.label}
              className="grid grid-cols-[8rem_1fr_1.75rem] items-center gap-3 text-sm sm:grid-cols-[10rem_1fr_2rem]"
            >
              <span className="truncate text-foreground/70" title={d.label}>
                {d.label}
              </span>
              <div className="h-3 rounded-full bg-black/[0.06] dark:bg-white/10">
                <div
                  className="h-3 rounded-full bg-teal-600 dark:bg-teal-400"
                  style={{ width: `${(d.value / max) * 100}%` }}
                />
              </div>
              <span className="text-right font-medium tabular-nums text-foreground">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </figure>
  );
}
