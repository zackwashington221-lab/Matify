import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, AdminSearchBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { ChevronRight, Crown } from "lucide-react";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Freshly Admin" },
      { name: "description", content: "Segmented customer list with lifetime value, tier and AI churn signals." },
    ],
  }),
  component: Customers,
});

const customers = [
  { id: "1", n: "Alex Morgan", tier: "Gold", orders: 34, ltv: "$1,240", risk: "low", tone: "from-amber-300 to-rose-400" },
  { id: "2", n: "Priya Patel", tier: "Platinum", orders: 78, ltv: "$3,910", risk: "low", tone: "from-violet-300 to-indigo-400" },
  { id: "3", n: "James Chen", tier: "Silver", orders: 12, ltv: "$482", risk: "medium", tone: "from-sky-300 to-cyan-400" },
  { id: "4", n: "Sofia Rossi", tier: "Gold", orders: 22, ltv: "$914", risk: "low", tone: "from-emerald-300 to-teal-400" },
  { id: "5", n: "Mika Tanaka", tier: "New", orders: 2, ltv: "$74", risk: "high", tone: "from-rose-300 to-pink-400" },
  { id: "6", n: "Diego Alvarez", tier: "Silver", orders: 9, ltv: "$318", risk: "medium", tone: "from-amber-300 to-orange-400" },
  { id: "7", n: "Yuki Sato", tier: "Platinum", orders: 92, ltv: "$4,520", risk: "low", tone: "from-fuchsia-300 to-pink-400" },
];

function Customers() {
  return (
    <AdminMobileShell>
      <AdminTopBar title="Customers" subtitle="12,482 total" back="/admin/mobile" />
      <AdminSearchBar placeholder="Search by name, email, phone…" />

      <div className="px-5 mt-4 grid grid-cols-3 gap-2">
        {[
          { l: "New · 7d", v: "342" },
          { l: "Active", v: "8.1k" },
          { l: "At risk", v: "128", warn: true },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl bg-card border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.l}</div>
            <div className={`text-lg font-bold font-display tabular-nums mt-0.5 ${k.warn ? "text-amber-600" : ""}`}>{k.v}</div>
          </div>
        ))}
      </div>

      <SectionTitle>Segments</SectionTitle>
      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "Platinum", "Gold", "Silver", "New", "Churn risk"].map((s, i) => (
          <button key={s} className={`whitespace-nowrap text-[12px] font-semibold rounded-full px-3 py-1.5 border ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>{s}</button>
        ))}
      </div>

      <SectionTitle>Directory</SectionTitle>
      <div className="px-5 space-y-2 pb-2">
        {customers.map((c) => (
          <Link key={c.id} to="/admin/customer/$id" params={{ id: c.id }} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
            <div className={`size-11 rounded-full bg-gradient-to-br ${c.tone} text-white font-semibold flex items-center justify-center text-[13px]`}>
              {c.n.split(" ").map(s => s[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <div className="text-[13px] font-semibold truncate">{c.n}</div>
                {c.tier === "Platinum" && <Crown className="size-3.5 text-violet-500" />}
              </div>
              <div className="text-[11px] text-muted-foreground">{c.tier} · {c.orders} orders · LTV {c.ltv}</div>
            </div>
            {c.risk === "high" && <span className="text-[9px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 rounded px-1.5 py-0.5">Risk</span>}
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </AdminMobileShell>
  );
}
