import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { productById, products } from "@/lib/mock-data";
import { MobileShell, TopBar } from "@/components/app/MobileShell";
import { Heart, Share2, Star, Minus, Plus, Truck, Leaf, Sparkles, ShieldCheck, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => {
    const p = productById(params.id);
    return {
      meta: [
        { title: `${p.name} — Martify` },
        { name: "description", content: `${p.name} by ${p.brand} · $${p.price} · ${p.unit}. Order for same-day delivery on Martify.` },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const p = productById(id);
  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const related = products.filter((x) => x.id !== p.id).slice(0, 4);

  return (
    <MobileShell>
      <TopBar
        back="/home"
        title=""
        right={
          <div className="flex items-center gap-2">
            <button onClick={() => setLiked((v) => !v)} className="size-9 rounded-full bg-secondary flex items-center justify-center">
              <Heart className={`size-4 ${liked ? "fill-rose-500 stroke-rose-500" : ""}`} />
            </button>
            <button className="size-9 rounded-full bg-secondary flex items-center justify-center"><Share2 className="size-4" /></button>
          </div>
        }
      />

      {/* Hero image */}
      <div className="px-5 pt-2">
        <div className={`relative aspect-square rounded-[36px] bg-gradient-to-br ${p.gradient} flex items-center justify-center text-[180px] shadow-card overflow-hidden`}>
          <span>{p.emoji}</span>
          {p.organic && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-3 py-1 text-xs font-semibold text-emerald-700">
              <Leaf className="size-3" /> Organic
            </div>
          )}
        </div>
        <div className="mt-3 flex justify-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all ${i === 0 ? "w-6 bg-foreground" : "w-1.5 bg-border"}`} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-5 pt-6 pb-4">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{p.brand}</div>
        <h1 className="text-[26px] font-bold tracking-tight mt-1 leading-tight">{p.name}</h1>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <div className="inline-flex items-center gap-1 text-sm">
            <Star className="size-4 fill-amber-400 stroke-amber-400" />
            <span className="font-semibold">{p.rating}</span>
            <span className="text-muted-foreground">({p.reviews.toLocaleString()})</span>
          </div>
          <span className="text-muted-foreground text-sm">·</span>
          <span className="text-sm text-muted-foreground">{p.unit}</span>
          <span className="text-muted-foreground text-sm">·</span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-medium">
            <span className="size-1.5 rounded-full bg-emerald-500" /> In stock
          </span>
        </div>
      </div>

      {/* AI insight */}
      <div className="px-5 pb-5">
        <div className="rounded-2xl bg-primary-soft/60 border border-primary/10 p-4 flex gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-emerald shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="text-[13px] leading-relaxed">
            <span className="font-semibold text-foreground">Great pick.</span>{" "}
            <span className="text-muted-foreground">Rich in monounsaturated fats. Pairs well with your usual sourdough and eggs — save 12% ordering together.</span>
          </div>
        </div>
      </div>

      {/* Quantity + qty selector */}
      <div className="px-5 pb-5 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-2xl font-bold tracking-tight">${(p.price * qty).toFixed(2)}</div>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full bg-card border border-border p-1.5 shadow-soft">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="size-9 rounded-full bg-secondary flex items-center justify-center"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-6 text-center font-semibold tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="size-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-emerald"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Perks row */}
      <div className="px-5 pb-6 grid grid-cols-3 gap-2">
        <Perk icon={<Truck className="size-4" />} title="60 min" sub="Delivery" />
        <Perk icon={<ShieldCheck className="size-4" />} title="Fresh" sub="Guarantee" />
        <Perk icon={<Leaf className="size-4" />} title="Farm" sub="Direct" />
      </div>

      {/* About */}
      <div className="px-5 pb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">About</h2>
        <p className="text-[14px] leading-relaxed text-foreground/90">
          Hand-picked at peak ripeness from sun-drenched groves. Creamy texture, nutty flavor, and just the right give when you press the skin. Ready to enjoy in 1–2 days.
        </p>
      </div>

      {/* Reviews teaser */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[17px] font-bold">Reviews</h2>
          <button className="text-xs font-semibold text-primary flex items-center">See all <ChevronRight className="size-3" /></button>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-gradient-to-br from-rose-300 to-orange-400 text-white flex items-center justify-center font-semibold">S</div>
            <div className="flex-1">
              <div className="text-sm font-semibold">Sarah K.</div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3 fill-amber-400 stroke-amber-400" />
                ))}
                <span className="text-[11px] text-muted-foreground ml-1">2 days ago</span>
              </div>
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed">
            Perfectly ripe every single time. Martify's ripeness sensor thing actually works — no more brown surprises.
          </p>
        </div>
      </div>

      {/* Related */}
      <div className="pb-8">
        <div className="px-5 flex items-center justify-between mb-3">
          <h2 className="text-[17px] font-bold">Often bought together</h2>
        </div>
        <div className="pl-5 pr-5 flex gap-3 overflow-x-auto no-scrollbar">
          {related.map((r) => (
            <Link key={r.id} to="/product/$id" params={{ id: r.id }} className="shrink-0 w-32">
              <div className={`aspect-square rounded-2xl bg-gradient-to-br ${r.gradient} flex items-center justify-center text-5xl`}>{r.emoji}</div>
              <div className="mt-2 text-[12px] font-semibold line-clamp-1">{r.name}</div>
              <div className="text-[12px] font-bold">${r.price.toFixed(2)}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-24 inset-x-0 z-30 pointer-events-none">
        <div className="mx-auto max-w-md px-5 pointer-events-auto">
          <Link
            to="/cart"
            className="flex items-center justify-between h-14 pl-5 pr-2 rounded-full bg-primary text-primary-foreground font-semibold shadow-emerald"
          >
            Add {qty} to cart
            <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur rounded-full px-4 py-2 text-sm">
              ${(p.price * qty).toFixed(2)} <ChevronRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </MobileShell>
  );
}

function Perk({ icon, title, sub }: { icon: React.ReactNode; title: string; sub: string }) {
  return (
    <div className="rounded-2xl bg-secondary p-3">
      <div className="size-8 rounded-lg bg-card flex items-center justify-center text-primary mb-2">{icon}</div>
      <div className="text-[13px] font-semibold leading-none">{title}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
