import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Sparkles, Zap, Bot, Package, Users, Megaphone } from "lucide-react";

export const Route = createFileRoute("/admin/ai")({
  head: () => ({
    meta: [
      { title: "AI Config — Freshly Admin" },
      { name: "description", content: "Tune AI agents for inventory, retention, merchandising and pricing." },
    ],
  }),
  component: AIConfig,
});

const agents = [
  { icon: Package, n: "Auto reorder", d: "Predict low stock 6h ahead", on: true, tone: "from-emerald-400 to-teal-500" },
  { icon: Users, n: "Retention nudges", d: "Personal offers for at-risk customers", on: true, tone: "from-violet-400 to-indigo-500" },
  { icon: Megaphone, n: "Dynamic promos", d: "Trigger promo when demand dips 15%+", on: false, tone: "from-amber-400 to-orange-500" },
  { icon: Zap, n: "Smart pricing", d: "Micro price tuning within ±5%", on: false, tone: "from-rose-400 to-pink-500" },
];

function AIConfig() {
  return (
    <AdminMobileShell>
      <AdminTopBar title="AI copilots" subtitle="4 agents" back="/admin/mobile" />

      <div className="px-5 mt-4">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 shadow-emerald">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-100 font-semibold"><Sparkles className="size-3.5" />This month</div>
          <div className="mt-2 font-display text-2xl font-bold tabular-nums">$18,420</div>
          <div className="text-[12px] text-emerald-100">saved & lift attributed to AI</div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/10 backdrop-blur p-2"><div className="text-[10px] uppercase text-emerald-100">Reorders</div><div className="text-sm font-bold">124</div></div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-2"><div className="text-[10px] uppercase text-emerald-100">Nudges</div><div className="text-sm font-bold">2,148</div></div>
            <div className="rounded-2xl bg-white/10 backdrop-blur p-2"><div className="text-[10px] uppercase text-emerald-100">Uplift</div><div className="text-sm font-bold">+9.4%</div></div>
          </div>
        </div>
      </div>

      <SectionTitle>Agents</SectionTitle>
      <div className="px-5 space-y-2">
        {agents.map((a) => (
          <div key={a.n} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-4">
            <div className={`size-11 rounded-2xl bg-gradient-to-br ${a.tone} text-white flex items-center justify-center`}>
              <a.icon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold">{a.n}</div>
              <div className="text-[11px] text-muted-foreground">{a.d}</div>
            </div>
            <div className={`w-11 h-6 rounded-full p-0.5 flex ${a.on ? "bg-primary" : "bg-secondary"}`}>
              <div className={`size-5 rounded-full bg-white shadow transition-all ${a.on ? "ml-auto" : ""}`} />
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Assistant tone</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded-2xl bg-primary-soft text-accent-foreground flex items-center justify-center"><Bot className="size-5" /></div>
          <div>
            <div className="text-[13px] font-semibold">Shopper voice</div>
            <div className="text-[11px] text-muted-foreground">How AI speaks to your customers</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Warm", "Playful", "Concise", "Expert", "Bold"].map((t, i) => (
            <button key={t} className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>{t}</button>
          ))}
        </div>
      </div>

      <SectionTitle>Guardrails</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 space-y-4 text-[13px] pb-2">
        {[
          { l: "Max discount", v: "20%" },
          { l: "Reorder cap", v: "$1,500 / day" },
          { l: "Price change window", v: "±5%" },
          { l: "Approvals required over", v: "$500" },
        ].map((g) => (
          <div key={g.l} className="flex justify-between items-center">
            <span className="text-muted-foreground">{g.l}</span>
            <span className="font-semibold tabular-nums">{g.v}</span>
          </div>
        ))}
      </div>
    </AdminMobileShell>
  );
}
