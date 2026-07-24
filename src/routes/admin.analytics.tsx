import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, StatCard, SectionCard, Tabs, ToolbarButton } from "@/components/admin/primitives";
import { Download, Calendar, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Line, LineChart, Pie, PieChart, Cell,
} from "recharts";
import { revenueSeries, weeklyBars, categoryShare } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Freshly Admin" },
      { name: "description", content: "Enterprise analytics: revenue, orders, retention, funnels, cohorts and geography." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  const [tab, setTab] = useState("revenue");

  const funnel = [
    { stage: "Visitors", value: 48200, pct: 100 },
    { stage: "Added to cart", value: 12400, pct: 26 },
    { stage: "Checkout started", value: 5820, pct: 12 },
    { stage: "Purchased", value: 3240, pct: 6.7 },
  ];

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Revenue, retention, funnels and cohorts across every channel."
        actions={
          <>
            <ToolbarButton variant="secondary"><Calendar className="size-3.5" /> Last 30 days</ToolbarButton>
            <ToolbarButton variant="secondary"><Download className="size-3.5" /> Schedule report</ToolbarButton>
          </>
        }
        tabs={
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: "revenue", label: "Revenue" },
              { value: "orders", label: "Orders" },
              { value: "customers", label: "Customers" },
              { value: "products", label: "Products" },
              { value: "geo", label: "Geography" },
              { value: "ai", label: "AI Performance" },
            ]}
          />
        }
      />

      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Revenue · 30d" value="$482,910" delta="+18.4%" deltaDir="up" />
          <StatCard label="Orders" value="12,840" delta="+11.2%" deltaDir="up" />
          <StatCard label="Conversion" value="6.7%" delta="+0.4pp" deltaDir="up" />
          <StatCard label="Retention · 30d" value="58%" delta="+2pp" deltaDir="up" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SectionCard className="lg:col-span-2" title="Revenue trend">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient id="rev2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Category mix">
            <div className="h-48">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={categoryShare} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                    {categoryShare.map((c, i) => <Cell key={i} fill={c.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 mt-2">
              {categoryShare.map((c) => (
                <li key={c.name} className="flex items-center justify-between text-[12px]">
                  <span className="inline-flex items-center gap-2"><span className="size-2 rounded-full" style={{ background: c.color }} />{c.name}</span>
                  <span className="tabular-nums font-semibold">{c.value}%</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SectionCard title="Conversion funnel">
            <ul className="space-y-3">
              {funnel.map((f) => (
                <li key={f.stage}>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-medium">{f.stage}</span>
                    <span className="tabular-nums text-muted-foreground">{f.value.toLocaleString()} · {f.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${f.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Weekly orders">
            <div className="h-56">
              <ResponsiveContainer>
                <BarChart data={weeklyBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="thisWeek" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>
        </div>

        <SectionCard title={<div className="inline-flex items-center gap-1.5 text-sm font-semibold"><Sparkles className="size-4 text-primary" />AI forecast</div>}>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={revenueSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="orders" stroke="var(--color-accent)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
