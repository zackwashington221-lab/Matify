import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, SectionCard, StatCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { Filter, TrendingDown } from "lucide-react";
import { funnelSteps, geoRows } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/funnels")({
  head: () => ({
    meta: [
      { title: "Funnels & Geography — Freshly Admin" },
      { name: "description", content: "Checkout funnel conversion, drop-off diagnosis and regional revenue distribution." },
      { property: "og:title", content: "Funnels & Geography — Freshly Admin" },
      { property: "og:description", content: "Checkout funnel conversion, drop-off diagnosis and regional revenue distribution." },
    ],
  }),
  component: FunnelsPage,
});

function FunnelsPage() {
  const top = funnelSteps[0].users;

  return (
    <>
      <PageHeader
        title="Funnels & geography"
        description="Where shoppers fall out of the purchase path, and which regions drive the revenue."
        actions={<ToolbarButton variant="secondary"><Filter className="size-3.5" /> Last 30 days</ToolbarButton>}
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Overall conversion" value="20.5%" delta="+1.4pp" deltaDir="up" />
          <StatCard label="Cart abandonment" value="37.5%" delta="-2.1pp" deltaDir="down" />
          <StatCard label="Checkout completion" value="79.4%" delta="+0.8pp" deltaDir="up" />
          <StatCard label="Biggest drop-off" value="Cart → Checkout" hint="7,450 users" icon={<TrendingDown className="size-4" />} />
        </div>

        <SectionCard title="Purchase funnel">
          <div className="space-y-3">
            {funnelSteps.map((s, i) => {
              const pct = (s.users / top) * 100;
              const prev = i === 0 ? null : funnelSteps[i - 1].users;
              const drop = prev ? Math.round(((prev - s.users) / prev) * 100) : 0;
              return (
                <div key={s.step}>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="font-semibold">{s.step}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {s.users.toLocaleString()} · {pct.toFixed(1)}%
                      {prev && <span className="ml-2 text-destructive">−{drop}%</span>}
                    </span>
                  </div>
                  <div className="h-9 rounded-xl bg-secondary overflow-hidden">
                    <div className="h-full rounded-xl bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Revenue by region" padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="text-left font-semibold px-5 py-3">Region</th>
                  <th className="text-right font-semibold px-5 py-3">Orders</th>
                  <th className="text-right font-semibold px-5 py-3">Revenue</th>
                  <th className="text-right font-semibold px-5 py-3">Growth</th>
                  <th className="text-left font-semibold px-5 py-3 w-56">Share</th>
                </tr>
              </thead>
              <tbody>
                {geoRows.map((r) => (
                  <tr key={r.region} className="border-b border-border/60 last:border-0 hover:bg-secondary/40">
                    <td className="px-5 py-3 font-medium">{r.region}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{r.orders.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">${r.revenue.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge tone={r.growth.startsWith("-") ? "danger" : "success"}>{r.growth}</StatusBadge>
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${r.share * 4}%` }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
