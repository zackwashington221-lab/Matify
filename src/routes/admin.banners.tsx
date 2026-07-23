import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Plus, GripVertical, Eye } from "lucide-react";

export const Route = createFileRoute("/admin/banners")({
  head: () => ({
    meta: [
      { title: "Banners — Freshly Admin" },
      { name: "description", content: "Manage home page banners, hero placements and merchandising slots." },
    ],
  }),
  component: Banners,
});

const banners = [
  { t: "Weekend Fresh Fridays", s: "20% off produce", grad: "from-emerald-400 to-teal-500", ctr: "3.2%", live: true },
  { t: "Sunday Basket Boost", s: "Extra $10 off $60", grad: "from-sky-400 to-indigo-500", ctr: "—", live: false },
  { t: "Meal-plan bundle", s: "AI plans starting $19", grad: "from-amber-400 to-orange-500", ctr: "2.4%", live: true },
  { t: "New shopper welcome", s: "15% off first order", grad: "from-rose-400 to-pink-500", ctr: "5.1%", live: true },
];

function Banners() {
  return (
    <AdminMobileShell>
      <AdminTopBar
        title="Banners"
        subtitle="Home hero rotation"
        back="/admin/mobile"
        right={<button className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-emerald"><Plus className="size-4" /></button>}
      />

      <SectionTitle action={<button className="text-[12px] font-semibold text-primary inline-flex items-center gap-1"><Eye className="size-3.5" />Preview</button>}>Live slots · 3</SectionTitle>
      <div className="px-5 space-y-3 pb-2">
        {banners.map((b, i) => (
          <div key={b.t} className="flex items-center gap-3">
            <GripVertical className="size-4 text-muted-foreground shrink-0" />
            <div className={`flex-1 rounded-3xl overflow-hidden border border-border`}>
              <div className={`h-28 bg-gradient-to-br ${b.grad} p-4 flex flex-col justify-between text-white`}>
                <div>
                  <div className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">Slot {i + 1}</div>
                  <div className="font-display font-bold text-[15px] leading-tight mt-0.5">{b.t}</div>
                  <div className="text-[11px] opacity-90 mt-0.5">{b.s}</div>
                </div>
                <div className="flex items-center justify-between text-[10px] font-semibold">
                  <span className={`rounded-full px-2 py-0.5 ${b.live ? "bg-white/25" : "bg-black/25"}`}>{b.live ? "Live" : "Draft"}</span>
                  <span>CTR {b.ctr}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminMobileShell>
  );
}
