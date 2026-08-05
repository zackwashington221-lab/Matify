import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  PageHeader,
  PageBody,
  SectionCard,
  StatCard,
  ToolbarButton,
} from "@/components/admin/primitives";
import { api } from "@/lib/api-client";
import { cohorts as fallback } from "@/lib/admin-platform-mock";
export const Route = createFileRoute("/admin/cohorts")({
  head: () => ({ meta: [{ title: "Cohorts & Retention — Martify Admin" }] }),
  component: CohortsPage,
});
type Cohort = { month: string; size: number; avgLtv: number; repeatRate: number; orders: number };
function CohortsPage() {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.analytics
      .cohorts()
      .then((result) => setCohorts(result.data))
      .catch((error) =>
        toast.error("Cohorts could not be refreshed", {
          description: error instanceof Error ? error.message : "Showing demonstration data.",
        }),
      )
      .finally(() => setLoading(false));
  }, []);
  const rows = cohorts.length
    ? cohorts
    : fallback.map((row) => ({
        month: row.label,
        size: row.size,
        avgLtv: 0,
        repeatRate: row.retention[1] || 0,
        orders: 0,
      }));
  const metrics = useMemo(
    () => ({
      repeat: rows.length
        ? Math.round(rows.reduce((sum, row) => sum + row.repeatRate, 0) / rows.length)
        : 0,
      ltv: rows.length ? rows.reduce((sum, row) => sum + row.avgLtv, 0) / rows.length : 0,
      orders: rows.reduce((sum, row) => sum + row.orders, 0),
    }),
    [rows],
  );
  const exportCsv = () => {
    const data = [
      "cohort,size,repeat_rate,average_ltv,orders",
      ...rows.map(
        (row) => `${row.month},${row.size},${row.repeatRate}%,${row.avgLtv},${row.orders}`,
      ),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([data], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "customer-cohorts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <PageHeader
        title="Cohorts & retention"
        description="Compare customer groups by the month they joined and how often they return."
        actions={
          <ToolbarButton variant="secondary" onClick={exportCsv}>
            <Download className="size-3.5" /> Export cohort CSV
          </ToolbarButton>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Repeat customer rate"
            value={`${metrics.repeat}%`}
            hint={loading ? "Refreshing…" : "Customers with 2+ orders"}
          />
          <StatCard label="Avg customer value" value={`$${metrics.ltv.toFixed(0)}`} />
          <StatCard label="Cohorts tracked" value={String(rows.length)} />
          <StatCard label="Orders represented" value={metrics.orders.toLocaleString()} />
        </div>
        <SectionCard title="Customer cohorts" padded={false}>
          <div className="overflow-x-auto p-5">
            <table className="w-full text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left py-2">Joined</th>
                  <th className="text-right py-2">Customers</th>
                  <th className="text-right py-2">Repeat rate</th>
                  <th className="text-right py-2">Average LTV</th>
                  <th className="text-right py-2">Orders</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.month} className="border-t border-border/60">
                    <td className="py-3 font-semibold">{row.month}</td>
                    <td className="py-3 text-right tabular-nums">{row.size.toLocaleString()}</td>
                    <td className="py-3 text-right tabular-nums">{row.repeatRate}%</td>
                    <td className="py-3 text-right tabular-nums">${row.avgLtv.toLocaleString()}</td>
                    <td className="py-3 text-right tabular-nums">{row.orders.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
        <SectionCard title="Repeat-customer trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rows}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--color-border)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  fontSize={11}
                  stroke="var(--color-muted-foreground)"
                  unit="%"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-card)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="repeatRate"
                  stroke="var(--color-primary)"
                  strokeWidth={2.5}
                  dot={false}
                  name="Repeat rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
