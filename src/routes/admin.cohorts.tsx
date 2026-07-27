import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, SectionCard, StatCard, ToolbarButton } from "@/components/admin/primitives";
import { Download } from "lucide-react";
import { cohorts, retentionCurve } from "@/lib/admin-platform-mock";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/admin/cohorts")({
  head: () => ({
    meta: [
      { title: "Cohorts & Retention — Freshly Admin" },
      { name: "description", content: "Monthly acquisition cohorts, repeat-purchase decay and reactivation trends." },
      { property: "og:title", content: "Cohorts & Retention — Freshly Admin" },
      { property: "og:description", content: "Monthly acquisition cohorts, repeat-purchase decay and reactivation trends." },
    ],
  }),
  component: CohortsPage,
});

function heat(v: number) {
  if (v >= 70) return "bg-primary text-primary-foreground";
  if (v >= 45) return "bg-primary/70 text-primary-foreground";
  if (v >= 28) return "bg-primary/45 text-foreground";
  if (v >= 15) return "bg-primary/25 text-foreground";
  return "bg-primary/12 text-muted-foreground";
}

function CohortsPage() {
  const maxMonths = Math.max(...cohorts.map((c) => c.retention.length));

  return (
    <>
      <PageHeader
        title="Cohorts & retention"
        description="How each acquisition cohort keeps ordering over time — the truest signal of marketplace health."
        actions={<ToolbarButton variant="secondary"><Download className="size-3.5" /> Export cohort CSV</ToolbarButton>}
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="M1 retention" value="72%" delta="+3pp" deltaDir="up" />
          <StatCard label="M3 retention" value="41%" delta="+2pp" deltaDir="up" />
          <StatCard label="M6 retention" value="24%" delta="-1pp" deltaDir="down" />
          <StatCard label="Reactivation · 30d" value="1,860" delta="+9%" deltaDir="up" />
        </div>

        <SectionCard title="Monthly cohort retention" padded={false}>
          <div className="overflow-x-auto p-5">
            <table className="w-full border-separate border-spacing-1 text-[11px]">
              <thead>
                <tr>
                  <th className="text-left font-semibold text-muted-foreground px-2">Cohort</th>
                  <th className="text-right font-semibold text-muted-foreground px-2">Size</th>
                  {Array.from({ length: maxMonths }, (_, i) => (
                    <th key={i} className="font-semibold text-muted-foreground w-14">M{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.label}>
                    <td className="px-2 font-semibold whitespace-nowrap">{c.label}</td>
                    <td className="px-2 text-right tabular-nums text-muted-foreground">{c.size.toLocaleString()}</td>
                    {Array.from({ length: maxMonths }, (_, i) => {
                      const v = c.retention[i];
                      return (
                        <td key={i} className="p-0">
                          {v === undefined ? (
                            <div className="h-9 rounded-lg bg-secondary/40" />
                          ) : (
                            <div className={cn("h-9 rounded-lg flex items-center justify-center font-semibold tabular-nums", heat(v))}>{v}%</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Weekly retention curve">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={retentionCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" />
                <YAxis tickLine={false} axisLine={false} fontSize={11} stroke="var(--muted-foreground)" unit="%" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", fontSize: 12 }} />
                <Line type="monotone" dataKey="retained" stroke="var(--primary)" strokeWidth={2.5} dot={false} name="Retained %" />
                <Line type="monotone" dataKey="reactivated" stroke="var(--accent)" strokeWidth={2} strokeDasharray="4 4" dot={false} name="Reactivated %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
