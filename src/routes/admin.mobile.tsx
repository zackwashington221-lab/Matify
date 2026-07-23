import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { ArrowUpRight, ArrowDownRight, Bell, Sparkles, ShoppingBag, Package, Users, TrendingUp, ChevronRight, Megaphone } from "lucide-react";

export const Route = createFileRoute("/admin/mobile")({
  head: () => ({
    meta: [
      { title: "Admin Home — Freshly" },
      { name: "description", content: "Freshly admin mobile: live KPIs, orders and AI alerts on the go." },
    ],
  }),
  component: AdminMobile,
});

function AdminMobile() {
  return (
    <AdminMobileShell>
      <AdminTopBar
        title="Good afternoon, Alex"
        subtitle="Freshly · Downtown"
        right={
          <div className="flex items-center gap-2">
            <Link to="/admin/notifications" className="size-10 rounded-full bg-secondary flex items-center justify-center relative">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-destructive" />
            </Link>
            <div className="size-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-semibold flex items-center justify-center text-sm">AM</div>
          </div>
        }
      />

      <div className="px-5 mt-4">
        <div className="inline-flex bg-card border border-border rounded-2xl p-1 text-[11px] font-medium shadow-soft">
          {["Today", "7d", "30d", "Quarter"].map((t, i) => (
            <button key={t} className={`px-3 py-1.5 rounded-xl ${i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-4 grid grid-cols-2 gap-3">
        <Kpi label="Revenue" value="$48.2k" delta="+12.4%" up />
        <Kpi label="Orders" value="1,284" delta="+8.1%" up />
        <Kpi label="Basket" value="$37.60" delta="-2.3%" />
        <Kpi label="Fresh score" value="94.2" delta="+1.8" up />
      </div>

      {/* AI alert */}
      <div className="mx-5 mt-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-emerald">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-100 font-semibold">
          <Sparkles className="size-3.5" /> AI insight
        </div>
        <div className="mt-2 text-[15px] font-semibold leading-snug">
          3 SKUs may sell out in the next 6 hours. Reorder now to protect $2.4k in sales.
        </div>
        <div className="mt-4 flex gap-2">
          <Link to="/admin/ai" className="text-[12px] font-semibold bg-white text-emerald-700 rounded-xl px-3 py-2">Review picks</Link>
          <button className="text-[12px] font-semibold bg-white/15 text-white rounded-xl px-3 py-2">Snooze</button>
        </div>
      </div>

      <SectionTitle action={<Link to="/admin/orders" className="text-[12px] font-semibold text-primary">See all</Link>}>Live orders</SectionTitle>
      <div className="px-5 space-y-2">
        {[
          { id: "#FR-4821", n: "Alex Morgan", t: "$37.32", s: "On the way", tone: "bg-sky-100 text-sky-700" },
          { id: "#FR-4820", n: "Priya Patel", t: "$104.10", s: "Preparing", tone: "bg-amber-100 text-amber-700" },
          { id: "#FR-4819", n: "James Chen", t: "$52.80", s: "Delivered", tone: "bg-emerald-100 text-emerald-700" },
        ].map((o) => (
          <Link to="/admin/orders/$id" params={{ id: o.id.replace("#", "") }} key={o.id} className="flex items-center justify-between rounded-2xl bg-card border border-border p-4">
            <div>
              <div className="text-[13px] font-semibold tabular-nums">{o.id}</div>
              <div className="text-[12px] text-muted-foreground">{o.n} · {o.t}</div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${o.tone}`}>{o.s}</span>
          </Link>
        ))}
      </div>

      <SectionTitle>Quick actions</SectionTitle>
      <div className="px-5 grid grid-cols-4 gap-3">
        {[
          { icon: Package, label: "New SKU", to: "/admin/products" },
          { icon: Megaphone, label: "Promo", to: "/admin/promotions" },
          { icon: Users, label: "Customers", to: "/admin/customers" },
          { icon: ShoppingBag, label: "Orders", to: "/admin/orders" },
        ].map((q) => (
          <Link key={q.label} to={q.to} className="flex flex-col items-center gap-2 rounded-2xl bg-card border border-border p-3">
            <div className="size-10 rounded-2xl bg-primary-soft text-accent-foreground flex items-center justify-center">
              <q.icon className="size-5" />
            </div>
            <div className="text-[11px] font-medium text-center leading-tight">{q.label}</div>
          </Link>
        ))}
      </div>

      <SectionTitle action={<Link to="/admin/analytics" className="text-[12px] font-semibold text-primary">Details</Link>}>Top categories</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 space-y-4">
        {[
          { n: "Produce", v: 34, c: "bg-emerald-500" },
          { n: "Dairy & Eggs", v: 22, c: "bg-sky-500" },
          { n: "Bakery", v: 18, c: "bg-amber-500" },
          { n: "Seafood", v: 14, c: "bg-rose-500" },
        ].map((c) => (
          <div key={c.n}>
            <div className="flex items-center justify-between text-[12px] mb-1.5">
              <span className="font-medium">{c.n}</span>
              <span className="tabular-nums text-muted-foreground">{c.v}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={`h-full ${c.c} rounded-full`} style={{ width: `${c.v * 2.5}%` }} />
            </div>
          </div>
        ))}
      </div>

      <SectionTitle action={<Link to="/admin/inventory" className="text-[12px] font-semibold text-primary">Manage</Link>}>Low stock</SectionTitle>
      <div className="px-5 space-y-2 pb-2">
        {[
          { e: "🐟", n: "Wild Atlantic Salmon", s: 12, t: "+42%" },
          { e: "🥬", n: "Organic Kale", s: 8, t: "+15%" },
          { e: "🥖", n: "Artisan Sourdough", s: 18, t: "+9%" },
        ].map((p) => (
          <div key={p.n} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
            <div className="size-11 rounded-2xl bg-secondary flex items-center justify-center text-xl">{p.e}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{p.n}</div>
              <div className="text-[11px] text-muted-foreground">{p.s} left · <span className="text-emerald-600 font-semibold inline-flex items-center gap-0.5"><TrendingUp className="size-3" />{p.t}</span></div>
            </div>
            <button className="text-[11px] font-semibold bg-primary text-primary-foreground rounded-xl px-3 py-2">Reorder</button>
            <ChevronRight className="size-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </AdminMobileShell>
  );
}

function Kpi({ label, value, delta, up }: { label: string; value: string; delta: string; up?: boolean }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-xl font-bold font-display tracking-tight mt-1 tabular-nums">{value}</div>
      <div className={`mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
        {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />} {delta}
      </div>
    </div>
  );
}
