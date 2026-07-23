import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, AdminSearchBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Plus, Star, ChevronRight } from "lucide-react";
import { products, categories } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Freshly Admin" },
      { name: "description", content: "Browse and edit the catalog: pricing, categories, badges and AI tags." },
    ],
  }),
  component: Products,
});

function Products() {
  return (
    <AdminMobileShell>
      <AdminTopBar
        title="Products"
        subtitle={`${products.length * 53} SKUs · 8 categories`}
        back="/admin/mobile"
        right={<button className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-emerald"><Plus className="size-4" /></button>}
      />
      <AdminSearchBar placeholder="Search catalog…" />

      <SectionTitle>Categories</SectionTitle>
      <div className="px-5 flex gap-2 overflow-x-auto no-scrollbar">
        {categories.map((c) => (
          <div key={c.id} className="shrink-0 w-24 rounded-2xl bg-card border border-border p-3 text-center">
            <div className="text-2xl">{c.emoji}</div>
            <div className="text-[11px] font-semibold mt-1 leading-tight">{c.name}</div>
            <div className="text-[10px] text-muted-foreground tabular-nums">{c.count}</div>
          </div>
        ))}
      </div>

      <SectionTitle action={<button className="text-[12px] font-semibold text-muted-foreground">Filter</button>}>All products</SectionTitle>
      <div className="px-5 grid grid-cols-2 gap-3 pb-2">
        {products.map((p) => (
          <Link key={p.id} to="/admin/product/$id" params={{ id: p.id }} className="rounded-2xl bg-card border border-border p-3 flex flex-col">
            <div className={`aspect-square rounded-2xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-4xl relative`}>
              <span>{p.emoji}</span>
              {p.aiTag && <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-white/80 backdrop-blur rounded-full px-2 py-0.5">{p.aiTag}</span>}
            </div>
            <div className="mt-2 text-[12px] font-semibold leading-tight truncate">{p.name}</div>
            <div className="text-[10px] text-muted-foreground">{p.brand}</div>
            <div className="mt-1 flex items-center justify-between">
              <div className="text-[13px] font-semibold tabular-nums">${p.price.toFixed(2)}</div>
              <div className="text-[10px] text-muted-foreground inline-flex items-center gap-0.5"><Star className="size-3 fill-amber-400 text-amber-400" />{p.rating}</div>
            </div>
          </Link>
        ))}
      </div>
    </AdminMobileShell>
  );
}
