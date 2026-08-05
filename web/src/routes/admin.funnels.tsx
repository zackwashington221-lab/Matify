import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  PageHeader,
  PageBody,
  SectionCard,
  StatCard,
  StatusBadge,
} from "@/components/admin/primitives";
import { TrendingDown } from "lucide-react";
import { api } from "@/lib/api-client";
import { funnelSteps as fallbackFunnel, geoRows as fallbackGeo } from "@/lib/admin-platform-mock";
export const Route = createFileRoute("/admin/funnels")({
  head: () => ({ meta: [{ title: "Funnels & Geography — Freshly Admin" }] }),
  component: FunnelsPage,
});
function FunnelsPage() {
  const [days, setDays] = useState(30);
  const [funnel, setFunnel] = useState<{ step: string; users: number }[]>([]);
  const [geo, setGeo] = useState<{ region: string; orders: number; revenue: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([api.analytics.funnel(days), api.analytics.geography(days)])
      .then(([f, g]) => {
        if (active) {
          setFunnel(f.data);
          setGeo(g.data);
        }
      })
      .catch((error) => {
        if (active)
          toast.error("Funnel data could not be refreshed", {
            description: error instanceof Error ? error.message : "Showing demonstration data.",
          });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [days]);
  const steps = funnel.length ? funnel : fallbackFunnel;
  const regions = geo.length
    ? geo
    : fallbackGeo.map((row) => ({ region: row.region, orders: row.orders, revenue: row.revenue }));
  const top = steps[0]?.users || 1;
  const totalRevenue = regions.reduce((sum, row) => sum + row.revenue, 0) || 1;
  const overall = ((steps.at(-1)?.users || 0) / top) * 100;
  const cart = steps.findIndex((item) => /cart/i.test(item.step));
  const cartToCheckout =
    cart >= 0 && steps[cart + 1] ? (1 - steps[cart + 1].users / steps[cart].users) * 100 : 0;
  return (
    <>
      <PageHeader
        title="Funnels & geography"
        description="Find purchase drop-offs and see which customer regions drive sales."
        actions={
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="h-9 rounded-lg border border-border bg-card px-3 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Overall conversion"
            value={`${overall.toFixed(1)}%`}
            hint={loading ? "Refreshing…" : `${days}-day window`}
          />
          <StatCard label="Cart abandonment" value={`${cartToCheckout.toFixed(1)}%`} />
          <StatCard
            label="Checkout completion"
            value={`${steps.length > 1 ? (((steps.at(-1)?.users || 0) / (steps.at(-2)?.users || 1)) * 100).toFixed(1) : "0"}%`}
          />
          <StatCard
            label="Biggest drop-off"
            value={steps.length > 1 ? steps[1].step : "—"}
            icon={<TrendingDown className="size-4" />}
          />
        </div>
        <SectionCard title="Purchase funnel">
          <div className="space-y-3">
            {steps.map((step, index) => {
              const pct = (step.users / top) * 100;
              const previous = index ? steps[index - 1].users : 0;
              const drop = previous ? Math.round(((previous - step.users) / previous) * 100) : 0;
              return (
                <div key={step.step}>
                  <div className="flex items-center justify-between text-[12px] mb-1.5">
                    <span className="font-semibold">{step.step}</span>
                    <span className="text-muted-foreground tabular-nums">
                      {step.users.toLocaleString()} · {pct.toFixed(1)}%
                      {index > 0 && <span className="ml-2 text-destructive">−{drop}%</span>}
                    </span>
                  </div>
                  <div className="h-9 rounded-xl bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-xl bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${Math.max(2, pct)}%` }}
                    />
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
                  <th className="text-left font-semibold px-5 py-3 w-56">Share</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((row) => (
                  <tr
                    key={row.region}
                    className="border-b border-border/60 last:border-0 hover:bg-secondary/40"
                  >
                    <td className="px-5 py-3 font-medium">{row.region}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">
                      {row.orders.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums font-semibold">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(row.revenue / totalRevenue) * 100}%` }}
                        />
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
