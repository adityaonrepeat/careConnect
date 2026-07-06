import Link from "next/link";
import { ArrowLeft, Inbox } from "lucide-react";
import { getSupabase } from "@/server/supabase";
import { StatTile } from "@/components/dashboard/StatTile";
import { BarChart } from "@/components/dashboard/BarChart";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  kind: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

async function loadRows(): Promise<{ rows: Row[]; error: string | null }> {
  try {
    const { data, error } = await getSupabase()
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return { rows: [], error: error.message };
    return { rows: (data ?? []) as Row[], error: null };
  } catch (e) {
    return { rows: [], error: e instanceof Error ? e.message : "Unable to load data." };
  }
}

function countBy<T>(items: T[], key: (item: T) => string): { label: string; value: number }[] {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

const KIND_LABEL: Record<string, string> = {
  patient: "Patient Support",
  volunteer: "Volunteer",
  contact: "Contact",
};

export default async function DashboardPage() {
  const { rows, error } = await loadRows();

  const total = rows.length;
  const patients = rows.filter((r) => r.kind === "patient");
  const volunteers = rows.filter((r) => r.kind === "volunteer");
  const contacts = rows.filter((r) => r.kind === "contact");
  const bySupport = countBy(patients, (r) => String(r.payload?.supportNeeded ?? "Other"));
  const byKind = countBy(rows, (r) => KIND_LABEL[r.kind] ?? r.kind);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Submissions dashboard</h1>
          <p className="mt-1 text-sm text-foreground/60">
            Live overview of requests captured by CareConnect.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm text-foreground/70 transition hover:bg-black/[0.03] dark:border-white/15 dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
      </div>

      {error ? (
        <div className="mt-8 rounded-xl border border-amber-500/40 bg-amber-50 p-5 text-sm text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
          <p className="font-medium">Couldn&apos;t load submissions.</p>
          <p className="mt-1 opacity-90">
            Make sure Supabase env vars are set and the <code>submissions</code> table has an
            anon <code>SELECT</code> policy (see README). Details: {error}
          </p>
        </div>
      ) : total === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-black/15 p-10 text-center dark:border-white/15">
          <Inbox className="h-8 w-8 text-foreground/40" aria-hidden />
          <p className="text-foreground/60">
            No submissions yet. Fill in a form on the{" "}
            <Link href="/" className="text-teal-600 underline dark:text-teal-400">
              home page
            </Link>{" "}
            and it&apos;ll appear here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Total submissions" value={total} accent />
            <StatTile label="Patient requests" value={patients.length} />
            <StatTile label="Volunteers" value={volunteers.length} />
            <StatTile label="Contacts" value={contacts.length} />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <BarChart title="Submissions by type" data={byKind} />
            <BarChart title="Patient requests by support category" data={bySupport} />
          </div>

          <section className="mt-6 overflow-hidden rounded-xl border border-black/10 dark:border-white/10">
            <div className="border-b border-black/10 bg-black/[0.02] px-4 py-3 text-sm font-medium dark:border-white/10 dark:bg-white/5">
              Recent submissions
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-foreground/50">
                  <tr className="border-b border-black/5 dark:border-white/10">
                    <th className="px-4 py-2 font-medium">When</th>
                    <th className="py-2 pl-6 pr-4 font-medium">Type</th>
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 25).map((r) => (
                    <tr key={r.id} className="border-b border-black/5 last:border-0 dark:border-white/5">
                      <td className="whitespace-nowrap px-4 py-2 text-foreground/60">
                        {new Date(r.created_at).toLocaleString([], {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2">
                        <span className="rounded-full bg-teal-600/10 px-2 py-0.5 text-xs text-teal-700 dark:text-teal-300">
                          {KIND_LABEL[r.kind] ?? r.kind}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-foreground/80">{r.name ?? "-"}</td>
                      <td className="max-w-[16rem] truncate px-4 py-2 text-foreground/60">
                        {detailOf(r)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function detailOf(r: Row): string {
  const p = r.payload ?? {};
  if (r.kind === "patient") return String(p.supportNeeded ?? "");
  if (r.kind === "volunteer") return String(p.skills ?? "");
  if (r.kind === "contact") return String(p.subject ?? "");
  return "";
}
