import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, AdminSearchBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Plus, TrendingUp, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Freshly Admin" },
      { name: "description", content: "Real-time inventory levels, restock forecasts and low-stock alerts." },
    ],
  }),
  component: Inventory,
});

const items = [
  { e: "🥑", n: "Hass Avocados", c: "Produce", p: "$1.49", s: 42, cap: 100, t: "+18%", up: true },
  { e: "🐟", n: "Wild Atlantic Salmon", c: "Seafood", p: "$14.99", s: 12, cap: 60, t: "+42%", up: true, low: true },
  { e: "🥖", n: "Artisan Sourdough", c: "Bakery", p: "$6.50", s: 18, cap: 40, t: "+9%", up: true, low: true },
  { e: "🥛", n: "Oat Milk Barista", c: "Dairy", p: "$4.99", s: 88, cap: 120, t: "+3%", up: true },
  { e: "🍓", n: "Organic Strawberries", c: "Produce", p: "$4.99", s: 24, cap: 80, t: "-4%", up: false },
  { e: "🥬", n: "Organic Kale", c: "Produce", p: "$2.99", s: 8, cap: 50, t: "+15%", up: true, low: true },
  { e: "🍫", n: "Dark Chocolate 72%", c: "Snacks", p: "$4.50", s: 44, cap: 80, t: "+2%", up: true },
  { e: "🍝", n: "Bronze-Cut Pasta", c: "Pantry", p: "$5.99", s: 70, cap: 100, t: "+6%", up: true },
];

function Inventory() {
  return (
    <AdminMobileShell>
      <AdminTopBar
        title="Inventory"
        subtitle="632 SKUs · 3 low"
        back="/admin/mobile"
        right={<button className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-emerald"><Plus className="size-4" /></button>}
      />
      <AdminSearchBar placeholder="Search product or SKU…" />

      <div className="px-5 mt-4 grid grid-cols-3 gap-2">
        {[
          { l: "In stock", v: "612" },
          { l: "Low", v: "17", warn: true },
          { l: "Out", v: "3", warn: true },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl bg-card border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.l}</div>
            <div className={`text-lg font-bold font-display tabular-nums mt-0.5 ${k.warn ? "text-amber-600" : ""}`}>{k.v}</div>
          </div>
        ))}
      </div>

      <SectionTitle>Restock alerts</SectionTitle>
      <div className="mx-5 rounded-3xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
        <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-amber-900">3 items may sell out in 6h</div>
          <div className="text-[11px] text-amber-800/80 mt-0.5">AI reorder can save ~$2.4k in lost sales.</div>
        </div>
        <Link to="/admin/ai" className="text-[11px] font-semibold bg-amber-600 text-white rounded-xl px-3 py-2">Auto-reorder</Link>
      </div>

      <SectionTitle action={<button className="text-[12px] font-semibold text-muted-foreground">Sort</button>}>All SKUs</SectionTitle>
      <div className="px-5 space-y-2 pb-2">
        {items.map((p) => (
          <Link key={p.n} to="/admin/product/$id" params={{ id: p.n.toLowerCase().replace(/\s+/g, "-") }} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
            <div className="size-11 rounded-2xl bg-secondary flex items-center justify-center text-xl shrink-0">{p.e}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-[13px] font-semibold truncate">{p.n}</div>
                {p.low && <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 rounded px-1.5 py-0.5">Low</span>}
              </div>
              <div className="text-[11px] text-muted-foreground">{p.c} · {p.p}</div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden max-w-[120px]">
                  <div className={`h-full rounded-full ${p.low ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${Math.min(100, (p.s / p.cap) * 100)}%` }} />
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground">{p.s}/{p.cap}</span>
              </div>
            </div>
            <div className={`text-[11px] font-semibold ${p.up ? "text-emerald-600" : "text-rose-600"} inline-flex items-center gap-0.5`}>
              <TrendingUp className={`size-3 ${p.up ? "" : "rotate-180"}`} />{p.t}
            </div>
          </Link>
        ))}
      </div>
    </AdminMobileShell>
  );
}
