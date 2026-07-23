import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, Package, Tag, Users, ShoppingBag, BarChart3, Megaphone, Image as ImageIcon, Bell, Sparkles, Search, ArrowUpRight, ArrowDownRight, MoreHorizontal, Plus, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Freshly" },
      { name: "description", content: "Freshly admin dashboard: inventory, orders, customers, analytics." },
    ],
  }),
  component: Admin,
});

const nav = [
  { icon: LayoutDashboard, label: "Overview", active: true },
  { icon: Package, label: "Inventory" },
  { icon: Tag, label: "Products" },
  { icon: ShoppingBag, label: "Orders", badge: 12 },
  { icon: Users, label: "Customers" },
  { icon: Megaphone, label: "Promotions" },
  { icon: BarChart3, label: "Analytics" },
  { icon: ImageIcon, label: "Banners" },
  { icon: Bell, label: "Notifications" },
  { icon: Sparkles, label: "AI config" },
];

function Admin() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen">
        <div className="px-5 h-16 flex items-center gap-2 border-b border-border">
          <div className="size-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald flex items-center justify-center text-white font-bold text-sm">F</div>
          <div>
            <div className="text-sm font-bold leading-tight">Freshly</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin</div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map((n) => (
            <button
              key={n.label}
              className={`w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-colors ${
                n.active ? "bg-primary-soft text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <n.icon className="size-4" />
              <span className="flex-1 text-left">{n.label}</span>
              {n.badge && <span className="text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1.5 py-0.5">{n.badge}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white">
            <Sparkles className="size-4 mb-2" />
            <div className="text-[13px] font-semibold leading-tight">AI insights ready</div>
            <div className="text-[11px] text-emerald-100 mt-1 leading-snug">3 SKUs need restocking soon.</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 px-6 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1 max-w-md h-10 px-4 rounded-xl bg-secondary">
            <Search className="size-4 text-muted-foreground" />
            <input placeholder="Search orders, products, customers…" className="flex-1 bg-transparent outline-none text-sm" />
            <kbd className="text-[10px] text-muted-foreground bg-card border border-border rounded px-1.5 py-0.5">⌘K</kbd>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-10 px-4 rounded-xl bg-secondary text-sm font-medium">Export</button>
            <button className="h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-emerald">
              <Plus className="size-4" /> New product
            </button>
            <div className="size-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold flex items-center justify-center text-sm">AM</div>
          </div>
        </header>

        <div className="p-6 space-y-6 max-w-[1400px]">
          <div className="flex items-end justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Good afternoon, Alex</h1>
              <p className="text-sm text-muted-foreground mt-1">Here's what's happening across your store today.</p>
            </div>
            <div className="inline-flex bg-card border border-border rounded-xl p-1 text-xs font-medium">
              {["Today", "7 days", "30 days", "Quarter"].map((t, i) => (
                <button key={t} className={`px-3 py-1.5 rounded-lg ${i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>{t}</button>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Kpi label="Revenue" value="$48,290" delta="+12.4%" up chart={<Spark up />} />
            <Kpi label="Orders" value="1,284" delta="+8.1%" up chart={<Spark up />} />
            <Kpi label="Avg. basket" value="$37.60" delta="-2.3%" chart={<Spark />} />
            <Kpi label="Fresh score" value="94.2" delta="+1.8" up chart={<Spark up />} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-3xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-sm font-semibold">Revenue over time</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">Last 7 days</div>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <Legend color="bg-emerald-500" label="This week" />
                  <Legend color="bg-emerald-500/30" label="Last week" />
                </div>
              </div>
              <div className="h-56 relative">
                <BarChart />
              </div>
            </div>
            <div className="rounded-3xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold">Top categories</div>
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </div>
              <div className="space-y-4">
                {[
                  { n: "Produce", v: 34, c: "bg-emerald-500" },
                  { n: "Dairy & Eggs", v: 22, c: "bg-sky-500" },
                  { n: "Bakery", v: 18, c: "bg-amber-500" },
                  { n: "Seafood", v: 14, c: "bg-rose-500" },
                  { n: "Pantry", v: 12, c: "bg-violet-500" },
                ].map((c) => (
                  <div key={c.n}>
                    <div className="flex items-center justify-between text-[13px] mb-1.5">
                      <span className="font-medium">{c.n}</span>
                      <span className="tabular-nums text-muted-foreground">{c.v}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full ${c.c} rounded-full`} style={{ width: `${c.v * 2.5}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI + orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-emerald">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-emerald-100 font-semibold">
                <Sparkles className="size-3.5" /> AI recommendations
              </div>
              <div className="mt-3 text-lg font-semibold leading-snug">
                3 low-stock SKUs may sell out in the next 6 hours.
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { n: "Wild Salmon", s: "12 left · 40/h" },
                  { n: "Sourdough", s: "18 left · 22/h" },
                  { n: "Organic Kale", s: "8 left · 15/h" },
                ].map((r) => (
                  <div key={r.n} className="flex items-center justify-between rounded-xl bg-white/10 backdrop-blur px-3 py-2">
                    <div>
                      <div className="text-[13px] font-semibold">{r.n}</div>
                      <div className="text-[11px] text-emerald-100">{r.s}</div>
                    </div>
                    <button className="text-[11px] font-semibold bg-white text-emerald-700 rounded-lg px-2.5 py-1">Reorder</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 rounded-3xl bg-card border border-border overflow-hidden">
              <div className="p-6 pb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Recent orders</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">Live</div>
                </div>
                <button className="text-xs font-semibold text-primary">View all</button>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                    <th className="text-left font-semibold px-6 py-2">Order</th>
                    <th className="text-left font-semibold px-6 py-2">Customer</th>
                    <th className="text-left font-semibold px-6 py-2">Total</th>
                    <th className="text-left font-semibold px-6 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: "#FR-4821", n: "Alex Morgan", t: "$37.32", s: "On the way", tone: "bg-sky-100 text-sky-700" },
                    { id: "#FR-4820", n: "Priya Patel", t: "$104.10", s: "Preparing", tone: "bg-amber-100 text-amber-700" },
                    { id: "#FR-4819", n: "James Chen", t: "$52.80", s: "Delivered", tone: "bg-emerald-100 text-emerald-700" },
                    { id: "#FR-4818", n: "Sofia Rossi", t: "$28.45", s: "Delivered", tone: "bg-emerald-100 text-emerald-700" },
                    { id: "#FR-4817", n: "Mika Tanaka", t: "$71.90", s: "Returned", tone: "bg-rose-100 text-rose-700" },
                  ].map((o) => (
                    <tr key={o.id} className="border-t border-border">
                      <td className="px-6 py-3 font-semibold tabular-nums">{o.id}</td>
                      <td className="px-6 py-3">{o.n}</td>
                      <td className="px-6 py-3 tabular-nums font-semibold">{o.t}</td>
                      <td className="px-6 py-3"><span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${o.tone}`}>{o.s}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory table */}
          <div className="rounded-3xl bg-card border border-border overflow-hidden">
            <div className="p-6 pb-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Inventory</div>
                <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5">632 SKUs</div>
              </div>
              <div className="flex gap-2">
                <button className="h-9 px-3 rounded-xl bg-secondary text-xs font-medium">Filters</button>
                <button className="h-9 px-3 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">Add item</button>
              </div>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[11px] text-muted-foreground uppercase tracking-wider">
                  <th className="text-left font-semibold px-6 py-2">Product</th>
                  <th className="text-left font-semibold px-6 py-2">Category</th>
                  <th className="text-left font-semibold px-6 py-2">Price</th>
                  <th className="text-left font-semibold px-6 py-2">Stock</th>
                  <th className="text-left font-semibold px-6 py-2">Trend</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { e: "🥑", n: "Hass Avocados", c: "Produce", p: "$1.49", s: 42, t: "+18%" },
                  { e: "🐟", n: "Wild Atlantic Salmon", c: "Seafood", p: "$14.99", s: 12, t: "+42%" },
                  { e: "🥖", n: "Artisan Sourdough", c: "Bakery", p: "$6.50", s: 18, t: "+9%" },
                  { e: "🥛", n: "Oat Milk Barista", c: "Dairy", p: "$4.99", s: 88, t: "+3%" },
                  { e: "🍓", n: "Organic Strawberries", c: "Produce", p: "$4.99", s: 24, t: "-4%" },
                ].map((p) => (
                  <tr key={p.n} className="border-t border-border">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-xl bg-secondary flex items-center justify-center text-lg">{p.e}</div>
                        <div className="font-semibold text-[13px]">{p.n}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted-foreground">{p.c}</td>
                    <td className="px-6 py-3 tabular-nums font-semibold">{p.p}</td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div className={`h-full ${p.s < 20 ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, p.s)}%` }} />
                        </div>
                        <span className="text-xs tabular-nums text-muted-foreground">{p.s}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${p.t.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                        <TrendingUp className="size-3" /> {p.t}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function Kpi({ label, value, delta, up, chart }: { label: string; value: string; delta: string; up?: boolean; chart: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-5">
      <div className="flex items-start justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-full px-2 py-0.5 ${up ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
          {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />} {delta}
        </div>
      </div>
      <div className="text-2xl font-bold tracking-tight mt-2 tabular-nums">{value}</div>
      <div className="mt-3 h-10">{chart}</div>
    </div>
  );
}

function Spark({ up = false }: { up?: boolean }) {
  const d = up
    ? "M0 30 L10 24 L20 26 L30 18 L40 20 L50 12 L60 14 L70 8 L80 10 L90 4 L100 6"
    : "M0 12 L10 16 L20 14 L30 22 L40 20 L50 26 L60 24 L70 28 L80 26 L90 30 L100 28";
  return (
    <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={up ? "rgb(16 185 129)" : "rgb(244 63 94)"} stopOpacity="0.3" />
          <stop offset="1" stopColor={up ? "rgb(16 185 129)" : "rgb(244 63 94)"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${d} L100 40 L0 40 Z`} fill={`url(#sg-${up})`} />
      <path d={d} fill="none" stroke={up ? "rgb(16 185 129)" : "rgb(244 63 94)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarChart() {
  const bars = [42, 55, 48, 68, 74, 62, 88];
  const prev = [38, 42, 50, 55, 60, 58, 70];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="h-full flex items-end justify-between gap-2 px-2">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-end justify-center gap-1 h-44">
            <div className="w-3 rounded-t-lg bg-emerald-500/30" style={{ height: `${prev[i]}%` }} />
            <div className="w-3 rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400" style={{ height: `${b}%` }} />
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">{days[i]}</div>
        </div>
      ))}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-muted-foreground">
      <span className={`size-2 rounded-full ${color}`} /> {label}
    </div>
  );
}
