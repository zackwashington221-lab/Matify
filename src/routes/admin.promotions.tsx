import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Plus, Sparkles, Calendar, Percent } from "lucide-react";

export const Route = createFileRoute("/admin/promotions")({
  head: () => ({
    meta: [
      { title: "Promotions — Freshly Admin" },
      { name: "description", content: "Design promo codes, bundles and AI-personalized offers for shoppers." },
    ],
  }),
  component: Promotions,
});

const promos = [
  { n: "Weekend Fresh Fridays", code: "FRESH20", status: "Live", tone: "bg-emerald-100 text-emerald-700", off: "20%", uses: "1,248", ends: "in 3d", grad: "from-emerald-400 to-teal-500" },
  { n: "Sunday Basket Boost", code: "BASKET10", status: "Scheduled", tone: "bg-sky-100 text-sky-700", off: "$10", uses: "—", ends: "starts 21 Nov", grad: "from-sky-400 to-indigo-500" },
  { n: "New shopper welcome", code: "HELLO15", status: "Live", tone: "bg-emerald-100 text-emerald-700", off: "15%", uses: "312", ends: "always", grad: "from-amber-400 to-orange-500" },
  { n: "Meal-plan bundle", code: "MEAL5", status: "Paused", tone: "bg-stone-200 text-stone-700", off: "$5", uses: "84", ends: "paused", grad: "from-rose-400 to-pink-500" },
];

function Promotions() {
  return (
    <AdminMobileShell>
      <AdminTopBar
        title="Promotions"
        subtitle="4 active · $12k lift"
        back="/admin/mobile"
        right={<button className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-emerald"><Plus className="size-4" /></button>}
      />

      <div className="px-5 mt-4">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 shadow-emerald">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-100 font-semibold"><Sparkles className="size-3.5" />AI suggestion</div>
          <div className="mt-2 text-[14px] font-semibold leading-snug">Tuesday demand dips 18%. A 12% produce bundle for Gold tier could recover $1,850/wk.</div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 h-10 rounded-xl bg-white text-emerald-700 text-[12px] font-semibold">Launch draft</button>
            <button className="h-10 px-3 rounded-xl bg-white/15 text-white text-[12px] font-semibold">Later</button>
          </div>
        </div>
      </div>

      <SectionTitle>Active campaigns</SectionTitle>
      <div className="px-5 space-y-3 pb-2">
        {promos.map((p) => (
          <div key={p.code} className="rounded-3xl bg-card border border-border overflow-hidden">
            <div className={`h-24 bg-gradient-to-br ${p.grad} p-4 flex items-start justify-between text-white`}>
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">Promo code</div>
                <div className="font-display font-bold text-lg mt-0.5 tracking-wider">{p.code}</div>
              </div>
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold leading-none">{p.off}</div>
                  <div className="text-[9px] uppercase tracking-wider">off</div>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold">{p.n}</div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${p.tone}`}>{p.status}</span>
              </div>
              <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Percent className="size-3" />{p.uses} uses</span>
                <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{p.ends}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminMobileShell>
  );
}
