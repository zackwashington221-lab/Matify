import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Truck, ShieldCheck, Clock, Star } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { HomeSkeleton, InlineLoader } from "@/components/store/LoadingState";
import { useStorefrontHome } from "@/lib/storefront";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Martify — Buy groceries online with AI-curated picks" },
      {
        name: "description",
        content:
          "Shop fresh produce, bakery, dairy and pantry staples online. AI-curated picks, transparent pricing and same-day delivery.",
      },
      { property: "og:title", content: "Martify — Buy groceries online with AI-curated picks" },
      {
        property: "og:description",
        content: "Shop fresh groceries online with AI-curated picks and same-day delivery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { categories, featured, deals, trending, banners, promotions, metrics, content, loading } =
    useStorefrontHome();
  const heroBanner = banners[0];
  const promotion = promotions[0];

  if (!content) {
    return (
      <StoreLayout>
        <HomeSkeleton />
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-accent-foreground">
              <Sparkles className="size-3.5" /> {content.hero.eyebrow}
            </span>
            <h1 className="mt-5 font-display text-4xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              {heroBanner?.title || content.hero.title}
            </h1>
            <p className="mt-5 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl">
              {heroBanner?.subtitle || content.hero.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 h-13 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                {content.hero.primaryCta} <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-card border border-border font-semibold hover:bg-secondary transition-colors"
              >
                <Sparkles className="size-4 text-primary" /> {content.hero.secondaryCta}
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-lg">
              {metrics.map((metric) => (
                <Stat key={metric.label} {...metric} />
              ))}
            </div>
            {promotion && (
              <div className="mt-5 text-xs font-semibold text-primary">
                Use code {promotion.code}
                {promotion.name ? ` · ${promotion.name}` : ""}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((p, i) => (
              <Link
                key={p.id}
                to="/product/$id"
                params={{ id: p.id }}
                className={`rounded-lg border border-border bg-gradient-to-br ${p.gradient} p-6 hover:shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 ${i % 3 === 0 ? "row-span-1 pt-10" : ""}`}
              >
                <div className="text-5xl">{p.emoji}</div>
                <div className="mt-4 text-sm font-semibold text-foreground">{p.name}</div>
                <div className="text-xs text-foreground/70">
                  ${p.price.toFixed(2)} · {p.unit}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.valueProps.map((value) => (
            <Value key={value.title} {...value} />
          ))}
        </div>
      </section>

      {/* Departments */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <SectionHead
          title={content.sections.departments.title}
          href="/shop"
          cta={content.sections.departments.cta}
        />
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/shop"
              search={{ category: c.id }}
              className="rounded-lg bg-card border border-border p-5 text-center hover:shadow-card hover:-translate-y-0.5 transition-[box-shadow,transform] duration-200"
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-3 text-[13px] font-semibold leading-tight">{c.name}</div>
              <div className="text-[11px] text-muted-foreground">{c.count} items</div>
            </Link>
          ))}
        </div>
      </section>

      {loading && (
        <div className="mx-auto -mt-10 flex max-w-7xl px-4 lg:px-8">
          <InlineLoader label="Refreshing today’s catalogue" />
        </div>
      )}

      {/* Deals */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-16">
        <SectionHead
          title={content.sections.deals.title}
          href="/shop"
          cta={content.sections.deals.cta}
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-16">
        <SectionHead
          title={content.sections.trending.title}
          href="/shop"
          cta={content.sections.trending.cta}
        />
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-16">
        <div className="rounded-lg bg-card border border-border p-8 lg:p-12 grid lg:grid-cols-3 gap-8">
          {content.testimonials.map((r) => (
            <figure key={r.name}>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-warning text-warning" />
                ))}
              </div>
              <blockquote className="mt-3 text-[15px] leading-relaxed">“{r.text}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-muted-foreground">
                {r.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 lg:px-8 pb-4">
        <div className="rounded-[2rem] bg-primary text-primary-foreground p-10 lg:p-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">
              {content.cta.title}
            </h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl">{content.cta.body}</p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-foreground text-primary font-semibold"
            >
              {content.cta.primaryLabel}
            </Link>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-primary-foreground/30 font-semibold"
            >
              {content.cta.secondaryLabel}
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

const valueIcons = { truck: Truck, shield: ShieldCheck, sparkles: Sparkles, clock: Clock };

function Value({
  icon,
  title,
  body,
}: {
  icon: keyof typeof valueIcons;
  title: string;
  body: string;
}) {
  const Icon = valueIcons[icon];
  return (
    <div className="flex gap-3">
      <div className="size-10 shrink-0 rounded-2xl bg-primary-soft text-accent-foreground flex items-center justify-center">
        <Icon className="size-5" />
      </div>
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
