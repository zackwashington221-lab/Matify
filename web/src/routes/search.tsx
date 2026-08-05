import { createFileRoute } from "@tanstack/react-router";
import { MobileShell, TopBar } from "@/components/app/MobileShell";
import { categories, products } from "@/lib/mock-data";
import { Search as SearchIcon, Mic, Sparkles, Filter } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Freshly" },
      { name: "description", content: "Browse fresh categories and find groceries with AI-powered search." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  return (
    <MobileShell>
      <TopBar title="Discover" right={<button className="size-9 rounded-full bg-secondary flex items-center justify-center"><Filter className="size-4" /></button>} />

      <div className="px-5 pt-3 pb-4">
        <div className="flex items-center gap-3 h-12 px-4 rounded-2xl bg-card border border-border shadow-soft">
          <SearchIcon className="size-4 text-muted-foreground" />
          <input placeholder="Try 'high protein under $10'" className="flex-1 bg-transparent outline-none text-sm" />
          <button className="size-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Mic className="size-4" /></button>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="rounded-2xl bg-primary-soft/60 border border-primary/10 p-3 flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <div className="text-[12px] text-muted-foreground flex-1">
            <span className="font-semibold text-foreground">Try:</span> "quick weeknight dinner under $25 for 2"
          </div>
        </div>
      </div>

      <div className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Recent</div>
      <div className="px-5 pb-5 flex flex-wrap gap-2">
        {["Avocado", "Sourdough", "Oat milk", "Salmon", "Kale"].map((r) => (
          <button key={r} className="rounded-full bg-card border border-border px-3 py-1.5 text-xs font-medium">{r}</button>
        ))}
      </div>

      <div className="px-5 pb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Browse categories</div>
      <div className="px-5 pb-6 grid grid-cols-2 gap-3">
        {categories.map((c) => (
          <button key={c.id} className={`relative aspect-[4/3] rounded-3xl bg-gradient-to-br ${c.gradient} p-4 text-white overflow-hidden text-left shadow-card`}>
            <div className="absolute right-2 bottom-2 text-6xl opacity-90">{c.emoji}</div>
            <div className="relative">
              <div className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">{c.count} items</div>
              <div className="text-[15px] font-bold leading-tight mt-1 max-w-[60%]">{c.name}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="px-5 pb-8">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">Popular</div>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 6).map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }}>
              <div className={`aspect-square rounded-3xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-5xl`}>{p.emoji}</div>
              <div className="mt-2 text-[13px] font-semibold line-clamp-1">{p.name}</div>
              <div className="text-[12px] font-bold">${p.price.toFixed(2)}</div>
            </Link>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}
