import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageBody, StatCard, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Grid3x3, List, Plus, Sparkles, Star, Archive, Trash2 } from "lucide-react";
import { products, categories, type Product } from "@/lib/mock-data";
import { api, type InventoryItem, type Product as ApiProduct } from "@/lib/api-client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products — Martify Admin" },
      { name: "description", content: "Product catalog: pricing, variants, media, SEO, categories and AI optimization." },
    ],
  }),
  component: Products,
});

function Products() {
  const [view, setView] = useState<"grid" | "list">("list");
  const [cat, setCat] = useState<string>("all");
  const navigate = useNavigate();
  const [liveProducts, setLiveProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([api.products.list({ limit: 200 }), api.inventory.list({ limit: 200 })])
      .then(([catalog, inventory]) => {
        if (!active) return;
        const stockByProduct = new Map(inventory.data.map((item: InventoryItem) => [typeof item.product === "string" ? item.product : item.product._id, item.onHand - item.reserved]));
        const mapped = catalog.data.map((product: ApiProduct) => ({
          id: product._id,
          name: product.name,
          brand: product.brand || "Martify",
          price: product.price,
          compareAt: product.compareAt,
          unit: product.unit || "each",
          emoji: product.emoji || "🛒",
          gradient: product.gradient || "from-emerald-100 to-lime-100",
          category: product.category || "other",
          rating: product.rating || 0,
          reviews: product.reviews || 0,
          aiTag: product.aiTag,
          organic: product.organic,
          stock: stockByProduct.get(product._id) || 0,
        }));
        setLiveProducts(mapped.length ? mapped : null);
      })
      .catch(() => {
        if (active) toast.error("Products could not be refreshed", { description: "Showing demonstration catalog data until the API is available." });
      });
    return () => { active = false; };
  }, []);

  const catalog = liveProducts || products;
  const filtered = useMemo(() => cat === "all" ? catalog : catalog.filter((p) => p.category === cat), [cat, catalog]);
  async function bulk(selected: Product[], action: "archive" | "delete" | "optimize") {
    if (!liveProducts) return toast.error("Connect the backend catalog to use bulk actions.");
    try {
      if (action === "delete") { await Promise.all(selected.map((product) => api.products.remove(product.id))); setLiveProducts((all) => all?.filter((product) => !selected.some((item) => item.id === product.id)) || null); }
      else { const payload = action === "archive" ? { status: "archived" as const } : { aiTag: "AI optimized" }; await Promise.all(selected.map((product) => api.products.update(product.id, payload))); setLiveProducts((all) => all?.map((product) => selected.some((item) => item.id === product.id) ? { ...product, ...(action === "optimize" ? { aiTag: "AI optimized" } : {}) } : product) || null); }
      toast.success(`${selected.length} product${selected.length === 1 ? "" : "s"} ${action === "optimize" ? "optimized" : action === "archive" ? "archived" : "deleted"}`);
    } catch (error) { toast.error("Bulk action failed", { description: error instanceof Error ? error.message : "Please try again." }); }
  }

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
        description="Manage product data, pricing, availability and catalog quality from one workspace."
        actions={
          <>
            <div className="inline-flex bg-card border border-border rounded-lg p-1">
              <button onClick={() => setView("list")} className={cn("size-8 rounded-md inline-flex items-center justify-center", view === "list" ? "bg-secondary" : "text-muted-foreground")}><List className="size-4" /></button>
              <button onClick={() => setView("grid")} className={cn("size-8 rounded-md inline-flex items-center justify-center", view === "grid" ? "bg-secondary" : "text-muted-foreground")}><Grid3x3 className="size-4" /></button>
            </div>
            <ToolbarButton variant="primary" onClick={() => navigate({ to: "/admin/product/new" })}><Plus className="size-3.5" /> New product</ToolbarButton>
          </>
        }
      />

      <PageBody className="max-w-none">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <StatCard label="Total SKUs" value="632" delta="+12" deltaDir="up" hint="last 30d" />
          <StatCard label="Active" value="612" hint="20 archived" />
          <StatCard label="Low stock" value="17" delta="Action needed" deltaDir="down" />
          <StatCard label="AI optimized" value="284" delta="45%" deltaDir="flat" hint="of catalog" />
        </div>

        <SectionCard
          title={<div><div className="text-sm font-semibold">Catalog filters</div><div className="mt-0.5 text-[11px] font-normal text-muted-foreground">Narrow the workspace by product category.</div></div>}
          action={<span className="hidden lg:inline text-xs text-muted-foreground">{filtered.length} products shown</span>}
          padded={false}
        >
          <div className="flex flex-wrap gap-2 p-3">
            <button
              onClick={() => setCat("all")}
              className={cn("whitespace-nowrap text-[12px] font-semibold rounded-lg px-3 py-2 border transition-colors",
                cat === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border hover:bg-secondary")}
            >All ({catalog.length})</button>
            {categories.map((c) => (
              <button key={c.id}
                onClick={() => setCat(c.id)}
                className={cn("whitespace-nowrap text-[12px] font-semibold rounded-lg px-3 py-2 border transition-colors inline-flex items-center gap-1.5",
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
                <ToolbarButton variant="secondary" onClick={() => bulk(sel, "optimize")}><Sparkles className="size-3.5" /> AI optimize ({sel.length})</ToolbarButton>
                <ToolbarButton variant="secondary" onClick={() => bulk(sel, "archive")}><Archive className="size-3.5" /> Archive</ToolbarButton>
                <ToolbarButton variant="secondary" onClick={() => bulk(sel, "delete")}><Trash2 className="size-3.5" /> Delete</ToolbarButton>
              </>
            )}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-3">
            {filtered.map((p) => (
              <Link key={p.id} to="/admin/product/$id" params={{ id: p.id }}
                className="group flex min-w-0 items-center gap-4 rounded-xl bg-card border border-border p-3 hover:border-primary/30 hover:shadow-soft transition-all">
                <div className={cn("size-16 shrink-0 rounded-lg bg-gradient-to-br flex items-center justify-center text-3xl relative", p.gradient)}>
                  {p.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold group-hover:text-primary">{p.name}</div>
                      <div className="mt-0.5 truncate text-[11px] text-muted-foreground">{p.brand} · {p.unit}</div>
                    </div>
                    <div className="shrink-0 text-right text-sm font-semibold tabular-nums">${p.price.toFixed(2)}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    {p.aiTag ? <StatusBadge tone="info"><Sparkles className="size-2.5" />{p.aiTag}</StatusBadge> : <span className="text-[11px] capitalize text-muted-foreground">{p.category}</span>}
                    <div className={cn("text-[11px] font-medium tabular-nums", p.stock < 20 ? "text-amber-700" : "text-muted-foreground")}>{p.stock} in stock</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageBody>
    </>
  );
}
