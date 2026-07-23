import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { AlertTriangle, ShoppingBag, Sparkles, Users, CheckCheck } from "lucide-react";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Freshly Admin" },
      { name: "description", content: "Store alerts, AI signals and operational notifications for your team." },
    ],
  }),
  component: Notifications,
});

const groups = [
  {
    label: "Today",
    items: [
      { icon: AlertTriangle, tone: "bg-amber-100 text-amber-700", t: "Salmon may sell out in 6h", d: "12 left · 40/h velocity", time: "2m" },
      { icon: ShoppingBag, tone: "bg-sky-100 text-sky-700", t: "Large order · #FR-4820", d: "Priya Patel · $104.10 · 24 items", time: "8m" },
      { icon: Sparkles, tone: "bg-emerald-100 text-emerald-700", t: "AI reorder ready to send", d: "3 SKUs · est. $2.4k protected sales", time: "22m" },
      { icon: Users, tone: "bg-violet-100 text-violet-700", t: "New Platinum customer", d: "Yuki Sato reached $4k LTV", time: "1h" },
    ],
  },
  {
    label: "Yesterday",
    items: [
      { icon: ShoppingBag, tone: "bg-rose-100 text-rose-700", t: "Return processed · #FR-4788", d: "Mika Tanaka · $71.90 refunded", time: "1d" },
      { icon: Sparkles, tone: "bg-emerald-100 text-emerald-700", t: "Weekly AI report ready", d: "Fresh score up 1.8 points", time: "1d" },
    ],
  },
];

function Notifications() {
  return (
    <AdminMobileShell>
      <AdminTopBar
        title="Notifications"
        subtitle="6 unread"
        back="/admin/mobile"
        right={<button className="text-[12px] font-semibold text-primary inline-flex items-center gap-1"><CheckCheck className="size-4" />Read all</button>}
      />

      <div className="px-5 mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "Alerts", "Orders", "AI", "Team"].map((c, i) => (
          <button key={c} className={`whitespace-nowrap text-[12px] font-semibold rounded-full px-3 py-1.5 border ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>{c}</button>
        ))}
      </div>

      {groups.map((g) => (
        <div key={g.label}>
          <SectionTitle>{g.label}</SectionTitle>
          <div className="px-5 space-y-2">
            {g.items.map((n, i) => (
              <div key={i} className="flex items-start gap-3 rounded-2xl bg-card border border-border p-4">
                <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${n.tone}`}>
                  <n.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold leading-tight">{n.t}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{n.d}</div>
                </div>
                <div className="text-[10px] text-muted-foreground shrink-0">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </AdminMobileShell>
  );
}
