import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, Tag, Sparkles, ArrowRight, Truck, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { useCart } from "@/lib/store-cart";
import { useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your shopping cart — Martify" },
      { name: "description", content: "Review your grocery cart, apply promo codes and check out with same-day delivery." },
      { property: "og:title", content: "Your shopping cart — Martify" },
      { property: "og:description", content: "Review items, apply promo codes and check out in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, count, subtotal, savings, delivery, tax, total, setQty, remove, clear, add } = useCart();
  const { products } = useStorefront();
  const [promo, setPromo] = useState("");
  const suggestions = products.filter((p) => !items.some((i) => i.product.id === p.id)).slice(0, 4);

  if (count === 0) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-3xl px-4 lg:px-8 py-24 text-center">
          <div className="mx-auto size-20 rounded-3xl bg-secondary flex items-center justify-center">
            <ShoppingBag className="size-8 text-muted-foreground" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">Your cart is empty</h1>
          <p className="mt-3 text-muted-foreground">Add a few essentials and we'll deliver them fresh today.</p>
          <Link to="/shop" className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold">
            Start shopping <ArrowRight className="size-4" />
          </Link>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Shopping cart</h1>
            <p className="mt-2 text-sm text-muted-foreground">{count} item{count === 1 ? "" : "s"} · delivered today</p>
          </div>
          <button onClick={clear} className="text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors">
            Clear cart
          </button>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_22rem] gap-8 items-start">
          <div className="space-y-4">
            {items.map(({ product, qty }) => (
              <div key={product.id} className="flex gap-4 p-4 rounded-3xl bg-card border border-border">
                <Link to="/product/$id" params={{ id: product.id }} className={`size-24 shrink-0 rounded-2xl bg-gradient-to-br ${product.gradient} flex items-center justify-center text-4xl`}>
                  {product.emoji}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{product.brand}</div>
                      <Link to="/product/$id" params={{ id: product.id }} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                      </Link>
                      <div className="text-xs text-muted-foreground mt-0.5">${product.price.toFixed(2)} · {product.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold">${(product.price * qty).toFixed(2)}</div>
                      {product.compareAt && (
                        <div className="text-xs text-primary font-semibold">save ${((product.compareAt - product.price) * qty).toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-secondary p-1">
                      <button onClick={() => setQty(product.id, qty - 1)} className="size-8 rounded-full bg-card flex items-center justify-center" aria-label="Decrease quantity">
                        {qty === 1 ? <Trash2 className="size-3.5 text-destructive" /> : <Minus className="size-3.5" />}
                      </button>
                      <span className="w-5 text-center text-sm font-semibold tabular-nums">{qty}</span>
                      <button onClick={() => setQty(product.id, qty + 1)} className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center" aria-label="Increase quantity">
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                    <button onClick={() => remove(product.id)} className="text-xs font-semibold text-muted-foreground hover:text-destructive">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-3xl bg-primary-soft/60 border border-primary/10 p-5 flex gap-4">
              <Sparkles className="size-5 text-primary shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold">Smart swaps available</div>
                <p className="text-[13px] text-muted-foreground mt-1">
                  Switching two items to store-brand equivalents keeps quality and trims about $3.40 from this basket.
                </p>
              </div>
              <Link to="/assistant" className="self-center text-sm font-semibold text-primary shrink-0">Review</Link>
            </div>
          </div>

          {/* Summary */}
          <aside className="lg:sticky lg:top-32 space-y-4">
            <div className="rounded-3xl bg-card border border-border p-6">
              <h2 className="font-display text-lg font-bold">Order summary</h2>
              <div className="mt-4 space-y-2.5 text-sm">
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                {savings > 0 && <Row label="Savings" value={`− $${savings.toFixed(2)}`} valueClass="text-primary font-semibold" />}
                <Row label="Delivery" value={delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`} />
                <Row label="Estimated tax" value={`$${tax.toFixed(2)}`} />
                <div className="h-px bg-border my-3" />
                <Row label="Total" value={`$${total.toFixed(2)}`} labelClass="font-bold text-base text-foreground" valueClass="font-bold text-base" />
              </div>

              {subtotal < 35 && (
                <div className="mt-4 rounded-2xl bg-secondary p-3 text-xs text-muted-foreground flex gap-2">
                  <Truck className="size-4 text-primary shrink-0" />
                  Add ${(35 - subtotal).toFixed(2)} more for free delivery.
                </div>
              )}

              <Link to="/checkout" className="mt-5 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Proceed to checkout <ArrowRight className="size-4" />
              </Link>
              <Link to="/shop" className="mt-2 block text-center text-sm font-medium text-muted-foreground py-2">
                Continue shopping
              </Link>
            </div>

            <div className="rounded-3xl bg-card border border-border p-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Promo code</div>
              <div className="mt-3 flex items-center gap-2 h-11 px-4 rounded-2xl bg-secondary">
                <Tag className="size-4 text-primary" />
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="FRESH15" className="flex-1 bg-transparent outline-none text-sm" />
                <button className="text-sm font-semibold text-primary">Apply</button>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight">Frequently bought together</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {suggestions.length > 0 && (
            <button
              onClick={() => suggestions.forEach((p) => add(p.id))}
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-card border border-border text-sm font-semibold hover:bg-secondary"
            >
              <Plus className="size-4" /> Add all four
            </button>
          )}
        </section>
      </div>
    </StoreLayout>
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
