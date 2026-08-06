import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Leaf, Sparkles } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { ProductCard } from "@/components/store/ProductCard";
import { categories, products } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type ShopSearch = { category?: string; q?: string };

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): ShopSearch => ({
    category: typeof search.category === "string" ? search.category : undefined,
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop groceries online — Martify" },
      { name: "description", content: "Browse fresh produce, bakery, dairy, pantry and more. Filter by category, diet and price, then check out in minutes." },
      { property: "og:title", content: "Shop groceries online — Martify" },
      { property: "og:description", content: "Browse thousands of grocery items with AI-curated picks and same-day delivery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

const sorts = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Top rated" },
] as const;

function Shop() {
  const { category, q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [query, setQuery] = useState(q ?? "");
  const [sort, setSort] = useState<(typeof sorts)[number]["id"]>("featured");
  const [maxPrice, setMaxPrice] = useState(20);
  const [organicOnly, setOrganicOnly] = useState(false);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (category && p.category !== category) return false;
      if (organicOnly && !p.organic) return false;
      if (p.price > maxPrice) return false;
      if (term && !`${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(term)) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, query, sort, maxPrice, organicOnly]);

  const activeCategory = categories.find((c) => c.id === category);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-7xl px-4 lg:px-8 pt-8">
        <nav className="text-xs text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          {activeCategory && (
            <>
              <span>/</span>
              <span className="text-foreground font-medium">{activeCategory.name}</span>
            </>
          )}
        </nav>

        <div className="mt-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">
              {activeCategory ? activeCategory.name : "Shop all groceries"}
            </h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {results.length} items · delivered fresh to your door today
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 h-11 px-4 rounded-2xl bg-card border border-border w-full sm:w-80">
              <Search className="size-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search groceries"
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="h-11 px-4 rounded-2xl bg-card border border-border text-sm font-medium outline-none"
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8 mt-8 flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-32 space-y-6">
            <div className="rounded-3xl bg-card border border-border p-5">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <SlidersHorizontal className="size-3.5" /> Categories
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={() => navigate({ search: { q: undefined, category: undefined } })}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    !category ? "bg-primary-soft text-accent-foreground" : "hover:bg-secondary text-muted-foreground"
                  )}
                >
                  All departments
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => navigate({ search: { category: c.id, q: undefined } })}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                      category === c.id ? "bg-primary-soft text-accent-foreground" : "hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    <span>{c.emoji}</span> {c.name}
                    <span className="ml-auto text-[11px] text-muted-foreground">{c.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-card border border-border p-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Price</div>
              <div className="mt-3 text-sm font-semibold">Up to ${maxPrice.toFixed(2)}</div>
              <input
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-primary"
              />
              <label className="mt-5 flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={organicOnly} onChange={(e) => setOrganicOnly(e.target.checked)} className="size-4 accent-primary" />
                <Leaf className="size-4 text-primary" /> Organic only
              </label>
            </div>

            <div className="rounded-3xl bg-primary-soft/60 border border-primary/10 p-5">
              <Sparkles className="size-5 text-primary" />
              <div className="mt-2 font-semibold text-sm">Let AI build your basket</div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Tell us your budget and diet — we'll fill the cart with the best-value picks.
              </p>
              <Link to="/assistant" className="mt-3 inline-flex h-9 items-center rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground">
                Open assistant
              </Link>
            </div>
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar pb-4">
            {[{ id: undefined, name: "All", emoji: "🛒" }, ...categories].map((c) => (
              <button
                key={c.name}
                onClick={() => navigate({ search: { category: c.id, q: undefined } })}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium border",
                  category === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
                )}
              >
                <span>{c.emoji}</span> {c.name}
              </button>
            ))}
          </div>

          {results.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center">
              <div className="text-4xl">🧺</div>
              <div className="mt-3 font-semibold">No items match those filters</div>
              <p className="mt-1 text-sm text-muted-foreground">Try widening your price range or clearing the search.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </StoreLayout>
  );
}
