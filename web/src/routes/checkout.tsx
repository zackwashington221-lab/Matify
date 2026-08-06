import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MapPin, Clock, Check, ShieldCheck, Sparkles, CreditCard, Lock } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { useCart } from "@/lib/store-cart";
import { api } from "@/lib/api-client";
import { useCustomerSession } from "@/lib/customer-session";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure checkout — Martify" },
      { name: "description", content: "Confirm your delivery address, pick a time window and pay securely for your grocery order." },
      { property: "og:title", content: "Secure checkout — Martify" },
      { property: "og:description", content: "Confirm delivery, choose a window and pay securely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});

const slots = [
  { id: "60min", top: "Within 60 min", bot: "$3.99 · fastest" },
  { id: "2h", top: "2-hour window", bot: "Free" },
  { id: "evening", top: "Tonight 6–8pm", bot: "Free" },
];

const payments = [
  { id: "card", label: "Credit or debit card", sub: "Visa · Mastercard · Amex" },
  { id: "apple", label: "Apple Pay", sub: "One-tap, biometric confirmed" },
  { id: "wallet", label: "Martify Wallet", sub: "Balance $28.40 · earn 3% back" },
];

function Checkout() {
  const { items, count, subtotal, savings, delivery, tax, total } = useCart();
  const { user } = useCustomerSession();
  const [slot, setSlot] = useState("2h");
  const [payment, setPayment] = useState("card");
  const [details, setDetails] = useState({ name: "", email: "", phone: "", company: "", address: "", apartment: "", city: "", state: "", postcode: "", notes: "", cardNumber: "", expiry: "", cvc: "", cardPostcode: "" });

  useEffect(() => {
    if (!user) return;
    setDetails((current) => ({ ...current, name: current.name || user.name, email: current.email || user.email }));
    api.customer.addresses().then(({ data }) => {
      const address = data.find((item) => item.isDefault) || data[0];
      if (!address) return;
      setDetails((current) => ({
        ...current,
        address: current.address || address.line1,
        city: current.city || address.city,
        postcode: current.postcode || address.postcode,
      }));
    }).catch(() => undefined);
  }, [user?.id]);

  const updateDetail = (key: keyof typeof details) => (value: string) => setDetails((current) => ({ ...current, [key]: value }));

  const shipping = slot === "60min" ? 3.99 : delivery;
  const grand = subtotal + shipping + tax;

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">{count} item{count === 1 ? "" : "s"} · secure 256-bit encrypted payment</p>

        <div className="mt-8 grid lg:grid-cols-[1fr_24rem] gap-8 items-start">
          <div className="space-y-6">
            {/* Contact */}
            <Section title="1. Contact details">
              <div className="grid sm:grid-cols-2 gap-3">
                <Input label="Full name" placeholder="Alex Morgan" value={details.name} onChange={updateDetail("name")} />
                <Input label="Email" placeholder="alex@example.com" type="email" value={details.email} onChange={updateDetail("email")} />
                <Input label="Phone" placeholder="(555) 018-2245" value={details.phone} onChange={updateDetail("phone")} />
                <Input label="Company (optional)" placeholder="—" value={details.company} onChange={updateDetail("company")} />
              </div>
            </Section>

            {/* Address */}
            <Section title="2. Delivery address">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <Input label="Street address" placeholder="1247 Elm Street" value={details.address} onChange={updateDetail("address")} />
                </div>
                <Input label="Apartment / suite" placeholder="Apt 4B" value={details.apartment} onChange={updateDetail("apartment")} />
                <Input label="City" placeholder="Brooklyn" value={details.city} onChange={updateDetail("city")} />
                <Input label="State" placeholder="NY" value={details.state} onChange={updateDetail("state")} />
                <Input label="ZIP code" placeholder="11201" value={details.postcode} onChange={updateDetail("postcode")} />
                <div className="sm:col-span-2">
                  <Input label="Delivery notes" placeholder="Leave with the doorman" value={details.notes} onChange={updateDetail("notes")} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm">
                <MapPin className="size-4 text-primary" /> We deliver to this ZIP within 60 minutes.
              </div>
            </Section>

            {/* Slot */}
            <Section title="3. Delivery window">
              <div className="grid sm:grid-cols-3 gap-3">
                {slots.map((s) => {
                  const active = slot === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setSlot(s.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${active ? "bg-primary-soft border-primary" : "bg-card border-border hover:bg-secondary"}`}
                    >
                      <Clock className={`size-4 mb-2 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="text-sm font-semibold">{s.top}</div>
                      <div className="text-xs text-muted-foreground">{s.bot}</div>
                    </button>
                  );
                })}
              </div>
            </Section>

            {/* Payment */}
            <Section title="4. Payment method">
              <div className="space-y-3">
                {payments.map((m) => {
                  const active = payment === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setPayment(m.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl border transition-all ${active ? "bg-primary-soft border-primary" : "bg-card border-border hover:bg-secondary"}`}
                    >
                      <CreditCard className={`size-5 ${active ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1 text-left">
                        <div className="text-sm font-semibold">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.sub}</div>
                      </div>
                      <span className={`size-5 rounded-full border-2 flex items-center justify-center ${active ? "bg-primary border-primary" : "border-border"}`}>
                        {active && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {payment === "card" && (
                <div className="mt-4 grid sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <Input label="Card number" placeholder="4242 4242 4242 4242" value={details.cardNumber} onChange={updateDetail("cardNumber")} />
                  </div>
                  <Input label="Expiry" placeholder="08 / 28" value={details.expiry} onChange={updateDetail("expiry")} />
                  <Input label="CVC" placeholder="123" value={details.cvc} onChange={updateDetail("cvc")} />
                  <Input label="ZIP" placeholder="11201" value={details.cardPostcode} onChange={updateDetail("cardPostcode")} />
                </div>
              )}
            </Section>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-32 space-y-4">
            <div className="rounded-3xl bg-card border border-border p-6">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(({ product, qty }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className={`size-11 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-xl shrink-0`}>{product.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold line-clamp-1">{product.name}</div>
                      <div className="text-[11px] text-muted-foreground">Qty {qty} · {product.unit}</div>
                    </div>
                    <div className="text-sm font-semibold">${(product.price * qty).toFixed(2)}</div>
                  </div>
                ))}
                {items.length === 0 && <div className="text-sm text-muted-foreground">Your cart is empty.</div>}
              </div>

              <div className="mt-5 space-y-2.5 text-sm border-t border-border pt-4">
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                {savings > 0 && <Row label="Savings" value={`− $${savings.toFixed(2)}`} valueClass="text-primary font-semibold" />}
                <Row label="Delivery" value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`} />
                <Row label="Estimated tax" value={`$${tax.toFixed(2)}`} />
                <div className="h-px bg-border my-3" />
                <Row label="Total" value={`$${grand.toFixed(2)}`} labelClass="font-bold text-base text-foreground" valueClass="font-bold text-base" />
              </div>

              <Link
                to="/tracking"
                className="mt-5 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <Lock className="size-4" /> Place order · ${grand.toFixed(2)}
              </Link>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5" /> Encrypted end-to-end. Cancel free within 5 minutes.
              </div>
            </div>

            <div className="rounded-3xl bg-primary-soft/60 border border-primary/10 p-5 flex gap-3">
              <Sparkles className="size-5 text-primary shrink-0" />
              <p className="text-[13px] leading-relaxed">
                <span className="font-semibold">Pay with Martify Wallet</span>{" "}
                <span className="text-muted-foreground">to earn 3% back — about ${(grand * 0.03).toFixed(2)} on this order.</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </StoreLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl bg-card border border-border p-6">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Input({ label, placeholder, type = "text", value, onChange }: { label: string; placeholder?: string; type?: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 w-full h-11 px-4 rounded-2xl bg-secondary border border-transparent focus:border-primary focus:bg-card outline-none text-sm transition-colors"
      />
    </label>
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
