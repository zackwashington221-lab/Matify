import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, TopBar } from "@/components/app/MobileShell";
import { MapPin, Clock, CreditCard, Check, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Freshly" },
      { name: "description", content: "Confirm delivery, payment, and place your order securely." },
    ],
  }),
  component: Checkout,
});

function Checkout() {
  const [slot, setSlot] = useState("60min");
  const [payment, setPayment] = useState("apple");

  return (
    <MobileShell>
      <TopBar back="/cart" title="Checkout" />

      {/* Stepper */}
      <div className="px-5 pt-4 pb-2 flex items-center gap-2">
        {["Address", "Delivery", "Payment", "Review"].map((s, i) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`h-1 rounded-full flex-1 ${i <= 2 ? "bg-primary" : "bg-border"}`} />
          </div>
        ))}
      </div>
      <div className="px-5 pb-4 text-xs text-muted-foreground">Step 3 of 4 · Payment</div>

      {/* Address */}
      <div className="px-5 pb-4">
        <SectionLabel>Delivery address</SectionLabel>
        <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
          <div className="size-10 rounded-xl bg-primary-soft flex items-center justify-center"><MapPin className="size-4 text-primary" /></div>
          <div className="flex-1 text-left">
            <div className="text-[13px] font-semibold">Home · 1247 Elm Street</div>
            <div className="text-[11px] text-muted-foreground">Apt 4B, Brooklyn, NY 11201</div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>

      {/* Delivery slot */}
      <div className="px-5 pb-4">
        <SectionLabel>Delivery time</SectionLabel>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "60min", top: "60 min", bot: "$3.99" },
            { id: "2h", top: "2 hours", bot: "Free" },
            { id: "sched", top: "Schedule", bot: "Choose" },
          ].map((s) => {
            const active = slot === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSlot(s.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  active ? "bg-primary-soft border-primary" : "bg-card border-border"
                }`}
              >
                <Clock className={`size-4 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
                <div className="text-[13px] font-semibold">{s.top}</div>
                <div className="text-[11px] text-muted-foreground">{s.bot}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment methods */}
      <div className="px-5 pb-4">
        <SectionLabel>Payment method</SectionLabel>
        <div className="space-y-2">
          {[
            { id: "apple", label: "Apple Pay", sub: "Face ID confirmed", emoji: "" },
            { id: "card", label: "Visa · 4242", sub: "Expires 08/28", emoji: "💳" },
            { id: "wallet", label: "Freshly Wallet", sub: "Balance $28.40", emoji: "💰" },
          ].map((m) => {
            const active = payment === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setPayment(m.id)}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                  active ? "bg-primary-soft border-primary" : "bg-card border-border"
                }`}
              >
                <div className="size-10 rounded-xl bg-secondary flex items-center justify-center text-lg">
                  {m.id === "apple" ? <Apple /> : m.emoji}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-[13px] font-semibold">{m.label}</div>
                  <div className="text-[11px] text-muted-foreground">{m.sub}</div>
                </div>
                <div className={`size-5 rounded-full border-2 flex items-center justify-center ${active ? "bg-primary border-primary" : "border-border"}`}>
                  {active && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AI tip */}
      <div className="px-5 pb-4">
        <div className="rounded-2xl bg-card border border-border p-4 flex gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-emerald shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="text-[13px] leading-relaxed">
            <span className="font-semibold">Pay with Freshly Wallet</span>{" "}
            <span className="text-muted-foreground">and earn 3% back — about <span className="font-semibold text-primary">$1.20</span> on this order.</span>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="px-5 pb-4">
        <SectionLabel>Order review</SectionLabel>
        <div className="rounded-2xl bg-card border border-border p-4 space-y-2 text-sm">
          <Row label="Items (4)" value="$34.96" />
          <Row label="AI savings" value="− $4.50" cls="text-primary font-semibold" />
          <Row label="Delivery" value={slot === "2h" ? "Free" : "$3.99"} />
          <Row label="Tax" value="$2.87" />
          <div className="h-px bg-border my-2" />
          <Row label="Total" value={`$${(34.96 - 4.5 + (slot === "2h" ? 0 : 3.99) + 2.87).toFixed(2)}`} labelCls="font-bold text-base" cls="font-bold text-base" />
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="size-3.5" /> Secure 256-bit checkout · encrypted end-to-end
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-24 inset-x-0 z-30 pointer-events-none">
        <div className="mx-auto max-w-md px-5 pointer-events-auto">
          <Link to="/tracking" className="flex items-center justify-between h-14 pl-5 pr-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-emerald">
            <span className="inline-flex items-center gap-2"><CreditCard className="size-4" /> Place order</span>
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm">
              $37.32 <ChevronRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">{children}</div>;
}

function Row({ label, value, labelCls, cls }: { label: string; value: string; labelCls?: string; cls?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-muted-foreground ${labelCls ?? ""}`}>{label}</span>
      <span className={cls}>{value}</span>
    </div>
  );
}

function Apple() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
  );
}
