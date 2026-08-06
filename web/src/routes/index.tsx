import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Clock, Star } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { useStorefront } from "@/lib/storefront";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Martify — Buy groceries online with AI-curated picks" },
      { name: "description", content: "Shop fresh produce, bakery, dairy and pantry staples online. AI-curated picks, transparent pricing and same-day delivery." },
      { property: "og:title", content: "Martify — Buy groceries online with AI-curated picks" },
      { property: "og:description", content: "Shop fresh groceries online with AI-curated picks and same-day delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { categories, products, loading } = useStorefront();
  const deals = products.filter((p) => p.compareAt);
  const featured = products.slice(0, 6);
  const trending = products.slice(6, 12);

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div aria-hidden className="absolute -top-32 -right-24 size-[28rem] rounded-full bg-primary-soft blur-3xl opacity-70" />
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" /> AI-curated grocery marketplace
            </span>
            <h1 className="mt-5 font-display text-4xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Real food, <span className="text-primary">smarter baskets</span>, delivered today.
            </h1>
            <p className="mt-5 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Shop thousands of everyday essentials from local growers and artisan makers. Martify's assistant plans meals,
              finds cheaper swaps and keeps you inside your budget.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 h-13 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
                Start shopping <ArrowRight className="size-4" />
              </Link>
              <Link to="/assistant" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-card border border-border font-semibold hover:bg-secondary transition-colors">
                <Sparkles className="size-4 text-primary" /> Build my basket with AI
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              <Stat value="12k+" label="Products in stock" />
              <Stat value="45 min" label="Average delivery" />
              <Stat value="4.9★" label="From 38k reviews" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className={`rounded-3xl border border-border bg-gradient-to-br ${p.gradient} p-6 hover:shadow-pop transition-all ${i % 3 === 0 ? "row-span-1 pt-10" : ""}`}
              >
                <div className="text-5xl">{p.emoji}</div>
                <div className="mt-4 text-sm font-semibold text-foreground">{p.name}</div>
                <div className="text-xs text-foreground/70">${p.price.toFixed(2)} · {p.unit}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Value icon={<Truck className="size-5" />} title="Same-day delivery" body="Order by 6pm for delivery tonight, free over $35." />
          <Value icon={<ShieldCheck className="size-5" />} title="Freshness promise" body="Not perfect? We refund the item, no questions asked." />
          <Value icon={<Sparkles className="size-5" />} title="Smart savings" body="AI swaps surface cheaper equivalents as you shop." />
          <Value icon={<Clock className="size-5" />} title="One-tap reorders" body="Your weekly staples rebuilt in a single click." />
        </div>
      </section>

      {/* Departments */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <SectionHead title="Shop by department" href="/shop" cta="Browse all" />
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="rounded-3xl bg-card border border-border p-5 text-center hover:shadow-card hover:-translate-y-0.5 transition-all"
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-3 text-[13px] font-semibold leading-tight">{c.name}</div>
              <div className="text-[11px] text-muted-foreground">{c.count} items</div>
            </Link>
          ))}
        </div>
      </section>

      {loading && (
        <div className="mx-auto max-w-7xl px-4 lg:px-8 -mt-10 text-xs text-muted-foreground">Refreshing today’s catalogue…</div>
      )}

      {/* Deals */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-16">
        <SectionHead title="This week's deals" href="/shop" cta="See all deals" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-16">
        <SectionHead title="Trending in your area" href="/shop" cta="Shop all" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-16">
        <div className="rounded-[2rem] bg-card border border-border p-8 lg:p-12 grid lg:grid-cols-3 gap-8">
          {[
            { name: "Amara D.", text: "The AI basket saved me $22 on my usual weekly shop and it still felt like my own list." },
            { name: "Jonas P.", text: "Produce arrives better than my local store, and the delivery windows are actually accurate." },
            { name: "Priya S.", text: "Reordering staples takes seconds now. It's the only grocery site I use on desktop." },
          ].map((r) => (
            <figure key={r.name}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-warning text-warning" />
                ))}
              </div>
              <blockquote className="mt-3 text-[15px] leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-muted-foreground">{r.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-4">
        <div className="rounded-[2rem] bg-primary text-primary-foreground p-10 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Your first delivery is on us.</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl">
              Create a free account and get free delivery on your first three orders, plus AI meal planning built in.
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/auth" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-foreground text-primary font-semibold">
              Create account
            </Link>
            <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-primary-foreground/30 font-semibold">
              Shop as guest
            </Link>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function Value({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="size-10 shrink-0 rounded-2xl bg-primary-soft text-accent-foreground flex items-center justify-center">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <p className="text-[13px] text-muted-foreground leading-relaxed mt-0.5">{body}</p>
      </div>
    </div>
  );
}

function SectionHead({ title, href, cta }: { title: string; href: "/shop"; cta: string }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl lg:text-3xl font-bold tracking-tight">{title}</h2>
      <Link to={href} className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {cta} <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
