import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/app/MobileShell";
import { products, categories } from "@/lib/mock-data";
import { Sparkles, MapPin, Bell, Search, Zap, TrendingUp, ChevronRight, Plus, Star } from "lucide-react";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Freshly" },
      { name: "description", content: "Your AI-curated grocery feed with personalized picks and same-day delivery." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.slice(0, 4);
  const trending = products.slice(4, 10);

  return (
    <MobileShell>
      {/* Header */}
      <div className="px-5 pt-6 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              <MapPin className="size-3" /> Deliver to
            </div>
            <button className="flex items-center gap-1 mt-0.5">
              <span className="font-semibold text-[15px]">1247 Elm Street</span>
              <ChevronRight className="size-4 text-muted-foreground rotate-90" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-10 rounded-full bg-card border border-border flex items-center justify-center relative">
              <Bell className="size-4" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
            </button>
            <div className="size-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-semibold flex items-center justify-center text-sm">AM</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 pb-4">
        <Link
          to="/search"
          className="flex items-center gap-3 h-12 px-4 rounded-2xl bg-secondary text-muted-foreground text-sm"
        >
          <Search className="size-4" />
          Search apples, milk, snacks…
          <div className="ml-auto size-6 rounded-full bg-primary flex items-center justify-center">
            <Sparkles className="size-3 text-white" />
          </div>
        </Link>
      </div>

      {/* AI Hero */}
      <div className="px-5 pb-5">
        <Link to="/assistant" className="block relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 p-5 text-white shadow-emerald">
          <div aria-hidden className="absolute -right-6 -top-6 size-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-100">
              <Sparkles className="size-3" /> AI concierge
            </div>
            <div className="mt-2 text-[18px] font-semibold leading-snug max-w-[85%]">
              Plan a $75 healthy week for 2 in one tap.
            </div>
            <div className="mt-4 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1.5 text-xs font-medium">
                Try meal plan
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur px-3 py-1.5 text-xs font-medium">
                Chat
              </div>
            </div>
          </div>
          <div className="absolute right-3 bottom-3 text-5xl opacity-90">🥗</div>
        </Link>
      </div>

      {/* Quick pills */}
      <div className="px-5 pb-4 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { icon: <Zap className="size-3.5" />, label: "In 60 min", tone: "primary" },
          { icon: <Sparkles className="size-3.5" />, label: "For you" },
          { icon: <TrendingUp className="size-3.5" />, label: "Trending" },
          { label: "🥗 Meal plans" },
          { label: "🌱 Organic" },
          { label: "💸 Under $5" },
        ].map((p, i) => (
          <button
            key={i}
            className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-xs font-semibold border transition-all ${
              p.tone === "primary"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-foreground"
            }`}
          >
            {p.icon}
            {p.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <SectionHeader title="Shop by category" href="/search" />
      <div className="px-5 pb-6 grid grid-cols-4 gap-3">
        {categories.slice(0, 8).map((c) => (
          <Link key={c.id} to="/search" className="flex flex-col items-center gap-1.5">
            <div className={`size-16 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center text-2xl shadow-soft`}>
              {c.emoji}
            </div>
            <span className="text-[11px] font-medium text-center leading-tight">{c.name}</span>
          </Link>
        ))}
      </div>

      {/* AI recommended */}
      <SectionHeader
        title="Picked for you"
        subtitle="Based on your last 4 orders"
        icon={<Sparkles className="size-4 text-primary" />}
      />
      <div className="pl-5 pb-6 flex gap-3 overflow-x-auto no-scrollbar pr-5">
        {featured.map((p) => (
          <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="shrink-0 w-40 group">
            <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-6xl overflow-hidden`}>
              {p.emoji}
              {p.aiTag && (
                <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  <Sparkles className="size-2.5" /> {p.aiTag}
                </div>
              )}
              <button className="absolute bottom-2 right-2 size-8 rounded-full bg-primary text-primary-foreground shadow-emerald flex items-center justify-center">
                <Plus className="size-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="mt-2 space-y-0.5">
              <div className="text-[13px] font-semibold leading-tight line-clamp-1">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">{p.unit}</div>
              <div className="flex items-baseline gap-1.5 pt-0.5">
                <span className="text-sm font-bold">${p.price.toFixed(2)}</span>
                {p.compareAt && <span className="text-[11px] text-muted-foreground line-through">${p.compareAt}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Insights card */}
      <div className="px-5 pb-6">
        <div className="rounded-3xl bg-card border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-8 rounded-xl bg-primary-soft flex items-center justify-center">
              <TrendingUp className="size-4 text-primary" />
            </div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Your insights</span>
          </div>
          <div className="text-[15px] font-semibold leading-snug">
            You saved <span className="text-primary">$18.40</span> this month on organic swaps.
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { v: "$247", l: "Spent" },
              { v: "32", l: "Items" },
              { v: "84%", l: "Fresh" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-secondary p-3">
                <div className="text-sm font-bold">{s.v}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trending grid */}
      <SectionHeader title="Trending near you" />
      <div className="px-5 pb-8 grid grid-cols-2 gap-3">
        {trending.map((p) => (
          <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group">
            <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-5xl`}>
              {p.emoji}
              <button className="absolute bottom-2 right-2 size-8 rounded-full bg-white shadow-card flex items-center justify-center">
                <Plus className="size-4 text-foreground" strokeWidth={2.5} />
              </button>
              {p.organic && (
                <div className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                  Organic
                </div>
              )}
            </div>
            <div className="mt-2 space-y-0.5">
              <div className="text-[13px] font-semibold leading-tight line-clamp-1">{p.name}</div>
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <Star className="size-3 fill-amber-400 stroke-amber-400" /> {p.rating} · {p.unit}
              </div>
              <div className="text-sm font-bold pt-0.5">${p.price.toFixed(2)}</div>
            </div>
          </Link>
        ))}
      </div>
    </MobileShell>
  );
}

function SectionHeader({ title, subtitle, href, icon }: { title: string; subtitle?: string; href?: string; icon?: React.ReactNode }) {
  return (
    <div className="px-5 pb-3 flex items-end justify-between">
      <div>
        <div className="flex items-center gap-1.5">
          {icon}
          <h2 className="text-[17px] font-bold tracking-tight">{title}</h2>
        </div>
        {subtitle && <div className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</div>}
      </div>
      {href && (
        <Link to={href} className="text-xs font-semibold text-primary flex items-center gap-0.5">
          See all <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  );
}
