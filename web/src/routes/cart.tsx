import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell, TopBar } from "@/components/app/MobileShell";
import { products } from "@/lib/mock-data";
import { Minus, Plus, Trash2, Tag, Sparkles, ChevronRight, Truck } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — Freshly" },
      { name: "description", content: "Review your grocery cart, apply coupons, and check out." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const [items, setItems] = useState(() =>
    products.slice(0, 4).map((p, i) => ({ ...p, qty: [2, 1, 3, 1][i] }))
  );

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const savings = 4.5;
  const delivery = subtotal > 35 ? 0 : 3.99;
  const total = subtotal - savings + delivery;

  const setQty = (id: string, d: number) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, qty: Math.max(0, x.qty + d) } : x)).filter((x) => x.qty > 0));

  return (
    <MobileShell>
      <TopBar
        back="/home"
        title={`Cart · ${items.length} items`}
        right={<button className="text-xs font-semibold text-muted-foreground">Clear</button>}
      />

      {/* AI banner */}
      <div className="px-5 pt-4">
        <div className="rounded-2xl bg-primary-soft/60 border border-primary/10 p-4 flex gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-emerald shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">Add oat milk to save $2.10</div>
            <div className="text-[12px] text-muted-foreground mt-0.5">Based on your last 3 orders — it usually ships with these items.</div>
          </div>
          <button className="self-center text-xs font-semibold text-primary">Add</button>
        </div>
      </div>

      {/* Items */}
      <div className="px-5 pt-5 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className={`size-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-3xl shrink-0`}>{item.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold line-clamp-1">{item.name}</div>
              <div className="text-[11px] text-muted-foreground">{item.unit} · ${item.price.toFixed(2)}</div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-secondary p-1">
                  <button onClick={() => setQty(item.id, -1)} className="size-7 rounded-full bg-card flex items-center justify-center">
                    {item.qty === 1 ? <Trash2 className="size-3.5 text-destructive" /> : <Minus className="size-3.5" />}
                  </button>
                  <span className="text-xs font-semibold w-4 text-center tabular-nums">{item.qty}</span>
                  <button onClick={() => setQty(item.id, 1)} className="size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Plus className="size-3.5" />
                  </button>
                </div>
                <div className="ml-auto text-sm font-bold">${(item.price * item.qty).toFixed(2)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 h-12 px-4 rounded-2xl bg-card border border-border">
          <Tag className="size-4 text-primary" />
          <input placeholder="Promo code" className="flex-1 bg-transparent outline-none text-sm" />
          <button className="text-sm font-semibold text-primary">Apply</button>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto no-scrollbar">
          {["FRESH15 · 15% off", "FREESHIP · Free delivery", "WELCOME10"].map((c) => (
            <button key={c} className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary-soft text-accent-foreground px-3 py-1.5 text-xs font-medium">
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Delivery estimate */}
      <div className="px-5 pt-5">
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-secondary flex items-center justify-center"><Truck className="size-5 text-primary" /></div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">Delivery in 45–60 min</div>
            <div className="text-[11px] text-muted-foreground">1247 Elm Street · Today</div>
          </div>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 pt-5 pb-6">
        <div className="rounded-2xl bg-card border border-border p-4 space-y-2 text-sm">
          <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
          <Row label="AI savings" value={`− $${savings.toFixed(2)}`} valueClass="text-primary font-semibold" />
          <Row label="Delivery" value={delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`} />
          <div className="h-px bg-border my-2" />
          <Row label="Total" value={`$${total.toFixed(2)}`} labelClass="font-bold text-base" valueClass="font-bold text-base" />
        </div>
      </div>

      {/* CTA */}
      <div className="fixed bottom-24 inset-x-0 z-30 pointer-events-none">
        <div className="mx-auto max-w-md px-5 pointer-events-auto">
          <Link to="/checkout" className="flex items-center justify-between h-14 pl-5 pr-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-emerald">
            Checkout
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm">
              ${total.toFixed(2)} <ChevronRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

function Row({ label, value, labelClass, valueClass }: { label: string; value: string; labelClass?: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-muted-foreground ${labelClass ?? ""}`}>{label}</span>
      <span className={valueClass}>{value}</span>
    </div>
  );
}
