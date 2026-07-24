import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, StatCard, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Grid3x3, List, Plus, Sparkles, Star, Upload, Archive, Trash2 } from "lucide-react";
import { products, categories, type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Freshly Admin" },
      { name: "description", content: "Product catalog: pricing, variants, media, SEO, categories and AI optimization." },
    ],
  }),
  component: Products,
});

function Products() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [cat, setCat] = useState<string>("all");
  const navigate = useNavigate();

  const filtered = cat === "all" ? products : products.filter((p) => p.category === cat);

  const columns: Column<Product>[] = [
    {
      key: "name", header: "Product", sortable: true, sortAccessor: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          <div className={cn("size-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0", p.gradient)}>
            {p.emoji}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate">{p.name}</div>
            <div className="text-[11px] text-muted-foreground">{p.brand}</div>
          </div>
        </div>
      ),
    },
    { key: "category", header: "Category", render: (p) => <span className="capitalize text-muted-foreground">{p.category}</span> },
    {
      key: "price", header: "Price", sortable: true, sortAccessor: (p) => p.price, align: "right",
      render: (p) => (
        <div className="tabular-nums">
          <div className="font-semibold">${p.price.toFixed(2)}</div>
          {p.compareAt && <div className="text-[11px] text-muted-foreground line-through">${p.compareAt.toFixed(2)}</div>}
        </div>
      ),
    },
    {
      key: "stock", header: "Stock", sortable: true, sortAccessor: (p) => p.stock, align: "right",
      render: (p) => (
        <span className={cn("tabular-nums font-medium", p.stock < 20 && "text-amber-700")}>{p.stock}</span>
      ),
    },
    {
      key: "rating", header: "Rating", sortable: true, sortAccessor: (p) => p.rating, align: "right",
      render: (p) => (
        <span className="inline-flex items-center gap-1 tabular-nums">
          <Star className="size-3 fill-amber-400 text-amber-400" />{p.rating} <span className="text-muted-foreground">({p.reviews})</span>
        </span>
      ),
    },
    {
      key: "aiTag", header: "AI tag",
      render: (p) => p.aiTag ? <StatusBadge tone="info"><Sparkles className="size-2.5" />{p.aiTag}</StatusBadge> : <span className="text-muted-foreground">—</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Products"
        description="Catalog with AI-assisted copy, SEO, pricing rules and variants."
        actions={
          <>
            <ToolbarButton variant="secondary"><Upload className="size-3.5" /> Import CSV</ToolbarButton>
            <div className="inline-flex bg-card border border-border rounded-lg p-1">
              <button onClick={() => setView("list")} className={cn("size-8 rounded-md inline-flex items-center justify-center", view === "list" ? "bg-secondary" : "text-muted-foreground")}><List className="size-4" /></button>
              <button onClick={() => setView("grid")} className={cn("size-8 rounded-md inline-flex items-center justify-center", view === "grid" ? "bg-secondary" : "text-muted-foreground")}><Grid3x3 className="size-4" /></button>
            </div>
            <ToolbarButton variant="primary"><Plus className="size-3.5" /> New product</ToolbarButton>
          </>
        }
      />

      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total SKUs" value="632" delta="+12" deltaDir="up" hint="last 30d" />
          <StatCard label="Active" value="612" hint="20 archived" />
          <StatCard label="Low stock" value="17" delta="Action needed" deltaDir="down" />
          <StatCard label="AI optimized" value="284" delta="45%" deltaDir="flat" hint="of catalog" />
        </div>

        <SectionCard title="Categories" padded={false}>
          <div className="flex gap-2 overflow-x-auto no-scrollbar p-4">
            <button
              onClick={() => setCat("all")}
              className={cn("whitespace-nowrap text-[13px] font-semibold rounded-full px-3 py-1.5 border transition-colors",
                cat === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-secondary")}
            >All ({products.length})</button>
            {categories.map((c) => (
              <button key={c.id}
                onClick={() => setCat(c.id)}
                className={cn("whitespace-nowrap text-[13px] font-semibold rounded-full px-3 py-1.5 border transition-colors inline-flex items-center gap-1.5",
                  cat === c.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-secondary")}
              >
                <span>{c.emoji}</span>{c.name} <span className="opacity-70 text-[11px]">({c.count})</span>
              </button>
            ))}
          </div>
        </SectionCard>

        {view === "list" ? (
          <DataTable<Product>
            data={filtered}
            columns={columns}
            rowKey={(p) => p.id}
            searchAccessor={(p) => `${p.name} ${p.brand} ${p.category}`}
            searchPlaceholder="Search catalog…"
            onRowClick={(p) => navigate({ to: "/admin/product/$id", params: { id: p.id } })}
            exportFilename="products.csv"
            bulkActions={(sel) => (
              <>
                <ToolbarButton variant="secondary"><Sparkles className="size-3.5" /> AI optimize ({sel.length})</ToolbarButton>
                <ToolbarButton variant="secondary"><Archive className="size-3.5" /> Archive</ToolbarButton>
                <ToolbarButton variant="secondary"><Trash2 className="size-3.5" /> Delete</ToolbarButton>
              </>
            )}
          />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <Link key={p.id} to="/admin/product/$id" params={{ id: p.id }}
                className="rounded-2xl bg-card border border-border p-3 hover:shadow-card transition-shadow">
                <div className={cn("aspect-square rounded-xl bg-gradient-to-br flex items-center justify-center text-5xl relative", p.gradient)}>
                  {p.emoji}
                  {p.aiTag && <span className="absolute top-2 left-2"><StatusBadge tone="info"><Sparkles className="size-2.5" />{p.aiTag}</StatusBadge></span>}
                </div>
                <div className="mt-2.5 font-semibold text-sm truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.brand}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold tabular-nums">${p.price.toFixed(2)}</div>
                  <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1"><Star className="size-3 fill-amber-400 text-amber-400" />{p.rating}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
