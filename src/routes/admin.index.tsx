import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageBody, SectionCard, StatCard, StatusBadge, Tabs, ToolbarButton } from "@/components/admin/primitives";
import { DollarSign, ShoppingBag, Users, Activity, Sparkles, ArrowUpRight, ChevronRight, Server, Database, Zap, Plus, Download } from "lucide-react";
import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell, PieChart, Pie,
} from "recharts";
import { orders, revenueSeries, weeklyBars, categoryShare, statusTone } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Freshly Admin" },
      { name: "description", content: "Executive dashboard: revenue, orders, customers, AI signals and system health." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [range, setRange] = useState("7d");
  const recentOrders = orders.slice(0, 6);

  return (
    <>
      <PageHeader
        title="Good afternoon, Alex"
        description="Here's what's happening across your store today."
        actions={
          <>
            <Tabs
              value={range}
              onChange={setRange}
              items={[
                { value: "today", label: "Today" },
                { value: "7d", label: "7 days" },
                { value: "30d", label: "30 days" },
                { value: "q", label: "Quarter" },
              ]}
            />
            <ToolbarButton variant="secondary"><Download className="size-3.5" /> Export</ToolbarButton>
            <ToolbarButton variant="primary"><Plus className="size-3.5" /> New product</ToolbarButton>
          </>
        }
      />

      <PageBody>
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Revenue" value="$48,290" delta="+12.4%" deltaDir="up" hint="vs last week" icon={<DollarSign className="size-4" />} />
          <StatCard label="Orders" value="1,284" delta="+8.1%" deltaDir="up" hint="248 today" icon={<ShoppingBag className="size-4" />} />
          <StatCard label="Customers" value="12,482" delta="+3.6%" deltaDir="up" hint="342 new · 7d" icon={<Users className="size-4" />} />
          <StatCard label="Avg. basket" value="$37.60" delta="-2.3%" deltaDir="down" hint="vs last week" icon={<Activity className="size-4" />} />
        </div>

        {/* Main charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SectionCard
            className="lg:col-span-2"
            title={<div>
              <div className="text-sm font-semibold">Revenue over time</div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">Last 30 days</div>
            </div>}
            action={<div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-primary" /> Revenue</span>
              <span className="inline-flex items-center gap-1"><span className="size-2 rounded-full bg-accent" /> Orders</span>
            </div>}
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Top categories" action={<Link to="/admin/analytics" className="text-[12px] font-semibold text-primary inline-flex items-center gap-0.5">View all <ChevronRight className="size-3" /></Link>}>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} paddingAngle={2}>
                    {categoryShare.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {categoryShare.map((c) => (
                <div key={c.name} className="flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: c.color }} />{c.name}</span>
                  <span className="tabular-nums font-semibold">{c.value}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* AI + Weekly */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SectionCard
            className="lg:col-span-2"
            title="Weekly comparison"
            action={<Link to="/admin/analytics" className="text-[12px] font-semibold text-primary">Full report</Link>}
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="lastWeek" fill="var(--color-accent)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="thisWeek" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title={<div className="inline-flex items-center gap-1.5 text-sm font-semibold"><Sparkles className="size-4 text-primary" /> AI recommendations</div>}>
            <ul className="space-y-3">
              {[
                { t: "Reorder 3 low-stock SKUs", d: "Prevent $2.4k in lost sales", to: "/admin/inventory" },
                { t: "Boost salmon by 8%", d: "Demand up 42% vs last week", to: "/admin/products" },
                { t: "Retention offer to 128 at-risk", d: "Predicted +$3.1k revenue", to: "/admin/customers" },
              ].map((r) => (
                <li key={r.t}>
                  <Link to={r.to} className="block rounded-xl border border-border p-3 hover:bg-secondary/50 transition-colors">
                    <div className="text-[13px] font-semibold flex items-center gap-1.5">{r.t}<ArrowUpRight className="size-3.5 text-muted-foreground" /></div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{r.d}</div>
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* Live orders + system health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SectionCard
            className="lg:col-span-2"
            title="Live orders"
            action={<Link to="/admin/orders" className="text-[12px] font-semibold text-primary inline-flex items-center gap-0.5">View all <ChevronRight className="size-3" /></Link>}
            padded={false}
          >
            <table className="w-full text-[13px]">
              <thead className="text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="text-left px-5 py-2 font-semibold">Order</th>
                  <th className="text-left px-3 py-2 font-semibold">Customer</th>
                  <th className="text-left px-3 py-2 font-semibold">Status</th>
                  <th className="text-right px-5 py-2 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-border/60 hover:bg-secondary/40">
                    <td className="px-5 py-2.5 font-semibold tabular-nums">#{o.id}</td>
                    <td className="px-3 py-2.5">{o.customer}</td>
                    <td className="px-3 py-2.5"><StatusBadge tone={statusTone[o.status]}>{o.status}</StatusBadge></td>
                    <td className="px-5 py-2.5 text-right tabular-nums font-semibold">${o.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <SectionCard title="System health">
            <ul className="space-y-3">
              {[
                { icon: Server, label: "API", value: "Operational", tone: "success" as const, meta: "128ms p95" },
                { icon: Database, label: "Database", value: "Operational", tone: "success" as const, meta: "24 conns" },
                { icon: Zap, label: "AI Gateway", value: "Degraded", tone: "warning" as const, meta: "410ms p95" },
              ].map((s) => (
                <li key={s.label} className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-secondary flex items-center justify-center"><s.icon className="size-4 text-muted-foreground" /></div>
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold">{s.label}</div>
                    <div className="text-[11px] text-muted-foreground">{s.meta}</div>
                  </div>
                  <StatusBadge tone={s.tone}>{s.value}</StatusBadge>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </PageBody>
    </>
  );
}
