import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Freshly Admin" },
      { name: "description", content: "Revenue, conversion and cohort analytics with AI trend detection." },
    ],
  }),
  component: Analytics,
});

function Analytics() {
  return (
    <AdminMobileShell>
      <AdminTopBar title="Analytics" subtitle="Last 7 days" back="/admin/mobile" />

      <div className="px-5 mt-4 inline-flex bg-card border border-border rounded-2xl p-1 text-[11px] font-medium shadow-soft">
        {["Today", "7d", "30d", "Quarter", "Year"].map((t, i) => (
          <button key={t} className={`px-3 py-1.5 rounded-xl ${i === 1 ? "bg-secondary text-foreground" : "text-muted-foreground"}`}>{t}</button>
        ))}
      </div>

      <div className="mx-5 mt-4 rounded-3xl bg-card border border-border p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Revenue</div>
            <div className="font-display text-2xl font-bold tabular-nums mt-1">$48,290</div>
          </div>
          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-full px-2 py-0.5 bg-emerald-100 text-emerald-700">
            <ArrowUpRight className="size-3" /> +12.4%
          </span>
        </div>
        <div className="mt-4 h-40">
          <BarChart />
        </div>
      </div>

      <SectionTitle>Breakdown</SectionTitle>
      <div className="px-5 grid grid-cols-2 gap-3">
        {[
          { l: "Orders", v: "1,284", d: "+8.1%", up: true },
          { l: "Basket", v: "$37.60", d: "-2.3%", up: false },
          { l: "New buyers", v: "342", d: "+18%", up: true },
          { l: "Retention", v: "72.4%", d: "+1.2%", up: true },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl bg-card border border-border p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.l}</div>
            <div className="text-xl font-bold font-display tabular-nums mt-1">{k.v}</div>
            <div className={`text-[11px] font-semibold mt-1 inline-flex items-center gap-0.5 ${k.up ? "text-emerald-600" : "text-rose-600"}`}>
              <TrendingUp className={`size-3 ${k.up ? "" : "rotate-180"}`} />{k.d}
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Funnel</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 space-y-3">
        {[
          { l: "Visited", v: "48,201", w: 100 },
          { l: "Added to cart", v: "12,840", w: 62 },
          { l: "Checkout", v: "4,120", w: 32 },
          { l: "Purchased", v: "1,284", w: 18 },
        ].map((s) => (
          <div key={s.l}>
            <div className="flex justify-between text-[12px] mb-1"><span className="font-medium">{s.l}</span><span className="tabular-nums text-muted-foreground">{s.v}</span></div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${s.w}%` }} />
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Top products</SectionTitle>
      <div className="px-5 space-y-2 pb-2">
        {[
          { e: "🥑", n: "Hass Avocados", v: "$4,220" },
          { e: "🥛", n: "Oat Milk Barista", v: "$3,180" },
          { e: "🥖", n: "Artisan Sourdough", v: "$2,940" },
          { e: "🍓", n: "Organic Strawberries", v: "$2,410" },
        ].map((p, i) => (
          <div key={p.n} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
            <div className="size-6 text-[11px] font-bold text-muted-foreground tabular-nums text-center">{i + 1}</div>
            <div className="size-10 rounded-xl bg-secondary flex items-center justify-center text-lg">{p.e}</div>
            <div className="flex-1 text-[13px] font-semibold">{p.n}</div>
            <div className="text-[13px] font-semibold tabular-nums">{p.v}</div>
          </div>
        ))}
      </div>
    </AdminMobileShell>
  );
}

function BarChart() {
  const bars = [42, 55, 48, 68, 74, 62, 88];
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  return (
    <div className="h-full flex items-end justify-between gap-2">
      {bars.map((b, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex items-end justify-center h-32">
            <div className="w-full max-w-[18px] rounded-t-lg bg-gradient-to-t from-emerald-500 to-emerald-400" style={{ height: `${b}%` }} />
          </div>
          <div className="text-[10px] text-muted-foreground font-medium">{days[i]}</div>
        </div>
      ))}
    </div>
  );
}
