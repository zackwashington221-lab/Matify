import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Minus, Plus, Truck, ShieldCheck, Leaf, Sparkles, Check } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { productById, products } from "@/lib/mock-data";
import { useCart } from "@/lib/store-cart";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = productById(params.id);
    return {
      meta: [
        { title: `${p.name} — ${p.brand} | Martify` },
        { name: "description", content: `Buy ${p.name} by ${p.brand} — $${p.price.toFixed(2)} per ${p.unit}. Same-day grocery delivery from Martify.` },
        { property: "og:title", content: `${p.name} — Martify` },
        { property: "og:description", content: `${p.name} by ${p.brand}, $${p.price.toFixed(2)} per ${p.unit}.` },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const product = productById(id);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <nav className="text-xs text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" search={{ category: product.category }} className="hover:text-primary capitalize">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        <div className="mt-6 grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className={`aspect-square rounded-[2rem] border border-border bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
              <span className="text-[10rem] leading-none">{product.emoji}</span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={`aspect-square rounded-2xl border border-border bg-gradient-to-br ${product.gradient} flex items-center justify-center text-3xl opacity-${i === 0 ? "100" : "70"}`}>
                  {product.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Buy box */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{product.brand}</div>
            <h1 className="mt-2 font-display text-3xl lg:text-4xl font-bold tracking-tight">{product.name}</h1>

            <div className="mt-3 flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-warning text-warning" />
                <span className="font-semibold">{product.rating}</span>
              </span>
              <span className="text-muted-foreground">{product.reviews.toLocaleString()} reviews</span>
              {product.organic && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  <Leaf className="size-3" /> Organic
                </span>
              )}
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-display text-4xl font-bold">${product.price.toFixed(2)}</span>
              {product.compareAt && <span className="text-lg text-muted-foreground line-through">${product.compareAt.toFixed(2)}</span>}
              <span className="text-sm text-muted-foreground pb-1">per {product.unit}</span>
            </div>

            <p className="mt-5 text-[15px] text-muted-foreground leading-relaxed">
              Sourced from {product.brand} and shipped within hours of harvest. Kept at optimal temperature through our cold chain so
              it arrives exactly as it left the farm — crisp, fragrant and ready for tonight's table.
            </p>

            {product.aiTag && (
              <div className="mt-6 rounded-2xl bg-primary-soft/60 border border-primary/10 p-4 flex gap-3">
                <Sparkles className="size-5 text-primary shrink-0" />
                <div className="text-[13px] leading-relaxed">
                  <span className="font-semibold">{product.aiTag}.</span>{" "}
                  <span className="text-muted-foreground">Martify's assistant recommends this based on your basket and past orders.</span>
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-3 h-13 px-2 py-2 rounded-2xl bg-secondary">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-9 rounded-xl bg-card flex items-center justify-center" aria-label="Decrease quantity">
                  <Minus className="size-4" />
                </button>
                <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="size-9 rounded-xl bg-card flex items-center justify-center" aria-label="Increase quantity">
                  <Plus className="size-4" />
                </button>
              </div>
              <button
                onClick={() => {
                  add(product.id, qty);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 1500);
                }}
                className="flex-1 min-w-[12rem] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                {added ? <Check className="size-4" /> : <Plus className="size-4" />}
                {added ? "Added to cart" : `Add ${qty} to cart · $${(product.price * qty).toFixed(2)}`}
              </button>
              <Link to="/cart" className="px-6 py-3.5 rounded-2xl bg-card border border-border font-semibold hover:bg-secondary transition-colors">
                View cart
              </Link>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-2xl bg-card border border-border px-4 py-3">
                <Truck className="size-4 text-primary" /> Delivery today, 45–60 min
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-card border border-border px-4 py-3">
                <ShieldCheck className="size-4 text-primary" /> {product.stock} in stock · fresh guarantee
              </div>
            </div>

            {/* Details */}
            <div className="mt-8 divide-y divide-border border-t border-border">
              {[
                { t: "Nutrition", b: "Per serving: 120 kcal · 4g protein · 9g fat · 6g carbs · 3g fibre." },
                { t: "Storage & handling", b: "Refrigerate on arrival. Best within 5 days of delivery." },
                { t: "Delivery & returns", b: "Free delivery over $35. Damaged or off items refunded instantly in-app." },
              ].map((d) => (
                <details key={d.t} className="py-4 group">
                  <summary className="cursor-pointer list-none flex items-center justify-between font-semibold text-sm">
                    {d.t}
                    <Plus className="size-4 text-muted-foreground group-open:rotate-45 transition-transform" />
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d.b}</p>
                </details>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-display text-2xl font-bold tracking-tight">Pairs well with</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </StoreLayout>
  );
}
