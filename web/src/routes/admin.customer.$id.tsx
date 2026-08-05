import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Mail, Phone, MapPin, Sparkles, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/customer/$id")({
  head: () => ({
    meta: [
      { title: "Customer — Martify Admin" },
      { name: "description", content: "Customer profile with orders, tier, LTV and AI retention insights." },
    ],
  }),
  component: CustomerDetail,
});

function CustomerDetail() {
  return (
    <AdminMobileShell hideTabs>
      <AdminTopBar title="Customer" back="/admin/customers" right={<button className="h-10 px-4 rounded-full bg-secondary text-[12px] font-semibold">Message</button>} />

      <div className="px-5 mt-4">
        <div className="rounded-3xl bg-card border border-border p-5 flex items-center gap-4">
          <div className="size-16 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 text-white font-semibold flex items-center justify-center text-lg">AM</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-lg leading-tight">Alex Morgan</div>
            <div className="text-[12px] text-muted-foreground">Gold tier · Member since 2023</div>
            <div className="mt-1 flex gap-1">
              <span className="text-[10px] font-semibold bg-primary-soft text-accent-foreground rounded-full px-2 py-0.5">Weekly buyer</span>
              <span className="text-[10px] font-semibold bg-secondary rounded-full px-2 py-0.5">Organic</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 mt-3 grid grid-cols-3 gap-2">
        {[
          { l: "Orders", v: "34" },
          { l: "LTV", v: "$1,240" },
          { l: "Basket", v: "$36.5" },
        ].map((k) => (
          <div key={k.l} className="rounded-2xl bg-card border border-border p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.l}</div>
            <div className="text-lg font-bold font-display tabular-nums mt-0.5">{k.v}</div>
          </div>
        ))}
      </div>

      <SectionTitle>AI insights</SectionTitle>
      <div className="mx-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 shadow-emerald">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-100 font-semibold"><Sparkles className="size-3.5" />Retention</div>
        <div className="mt-2 text-[14px] font-semibold leading-snug">Likely to reorder oat milk in 3 days. A 10% cross-sell on sourdough could add $8/mo.</div>
        <button className="mt-4 h-10 px-4 rounded-xl bg-white text-emerald-700 text-[12px] font-semibold">Send offer</button>
      </div>

      <SectionTitle>Contact</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 space-y-3 text-[13px]">
        <div className="flex items-center gap-3"><Mail className="size-4 text-muted-foreground" /><span>alex.morgan@mail.com</span></div>
        <div className="flex items-center gap-3"><Phone className="size-4 text-muted-foreground" /><span>+1 (212) 555-0134</span></div>
        <div className="flex items-start gap-3"><MapPin className="size-4 text-muted-foreground mt-0.5" /><span>218 Bleecker St, Apt 3B · New York, NY 10012</span></div>
      </div>

      <SectionTitle action={<button className="text-[12px] font-semibold text-primary">See all</button>}>Recent orders</SectionTitle>
      <div className="px-5 space-y-2 pb-2">
        {[
          { id: "FR-4821", t: "$37.32", s: "On the way", tone: "bg-sky-100 text-sky-700" },
          { id: "FR-4712", t: "$42.10", s: "Delivered", tone: "bg-emerald-100 text-emerald-700" },
          { id: "FR-4644", t: "$28.90", s: "Delivered", tone: "bg-emerald-100 text-emerald-700" },
        ].map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-2xl bg-card border border-border p-3">
            <div>
              <div className="text-[13px] font-semibold tabular-nums">#{o.id}</div>
              <span className={`inline-block mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${o.tone}`}>{o.s}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[13px] font-semibold tabular-nums">{o.t}</div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>
    </AdminMobileShell>
  );
}
