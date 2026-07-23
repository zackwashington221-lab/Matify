import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, AdminSearchBar } from "@/components/app/AdminMobileShell";
import { SlidersHorizontal, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Freshly Admin" },
      { name: "description", content: "Live orders queue with statuses, filters and delivery tracking." },
    ],
  }),
  component: Orders,
});

const orders = [
  { id: "FR-4821", n: "Alex Morgan", items: 12, t: "$37.32", s: "On the way", tone: "bg-sky-100 text-sky-700", time: "2m ago" },
  { id: "FR-4820", n: "Priya Patel", items: 24, t: "$104.10", s: "Preparing", tone: "bg-amber-100 text-amber-700", time: "8m ago" },
  { id: "FR-4819", n: "James Chen", items: 6, t: "$52.80", s: "Delivered", tone: "bg-emerald-100 text-emerald-700", time: "22m ago" },
  { id: "FR-4818", n: "Sofia Rossi", items: 9, t: "$28.45", s: "Delivered", tone: "bg-emerald-100 text-emerald-700", time: "34m ago" },
  { id: "FR-4817", n: "Mika Tanaka", items: 15, t: "$71.90", s: "Returned", tone: "bg-rose-100 text-rose-700", time: "51m ago" },
  { id: "FR-4816", n: "Diego Alvarez", items: 4, t: "$18.20", s: "Cancelled", tone: "bg-stone-200 text-stone-700", time: "1h ago" },
  { id: "FR-4815", n: "Yuki Sato", items: 21, t: "$142.40", s: "On the way", tone: "bg-sky-100 text-sky-700", time: "1h ago" },
];

function Orders() {
  return (
    <AdminMobileShell>
      <AdminTopBar
        title="Orders"
        subtitle="1,284 today"
        back="/admin/mobile"
        right={<button className="size-10 rounded-full bg-secondary flex items-center justify-center"><SlidersHorizontal className="size-4" /></button>}
      />
      <AdminSearchBar placeholder="Search order or customer…" />

      <div className="px-5 mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {["All 1284", "Preparing 42", "On the way 128", "Delivered 1102", "Returned 8", "Cancelled 4"].map((c, i) => (
          <button key={c} className={`whitespace-nowrap text-[12px] font-semibold rounded-full px-3 py-1.5 border ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>{c}</button>
        ))}
      </div>

      <div className="px-5 mt-4 space-y-2">
        {orders.map((o) => (
          <Link key={o.id} to="/admin/orders/$id" params={{ id: o.id }} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4">
            <div className="size-11 rounded-2xl bg-primary-soft text-accent-foreground flex items-center justify-center font-display font-bold text-[13px]">{o.n.split(" ").map(s => s[0]).join("")}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-[13px] font-semibold tabular-nums">#{o.id}</div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${o.tone}`}>{o.s}</span>
              </div>
              <div className="text-[12px] text-muted-foreground truncate mt-0.5">{o.n} · {o.items} items · {o.time}</div>
            </div>
            <div className="text-right">
              <div className="text-[13px] font-semibold tabular-nums">{o.t}</div>
              <ChevronRight className="size-4 text-muted-foreground inline-block mt-1" />
            </div>
          </Link>
        ))}
      </div>
    </AdminMobileShell>
  );
}
