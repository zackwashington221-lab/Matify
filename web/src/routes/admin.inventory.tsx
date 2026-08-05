import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageBody, StatCard, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AlertTriangle, ArrowUp, ArrowDown, Boxes, Plus, RefreshCw, Sparkles } from "lucide-react";
import { products, type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { revenueSeries } from "@/lib/admin-mock";
import { api, type InventoryItem } from "@/lib/api-client";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Freshly Admin" },
      { name: "description", content: "Real-time stock, forecasting, low-stock alerts and AI auto-reorder." },
    ],
  }),
  component: Inventory,
});

type InventoryRow = Product & { inventoryId?: string; productId?: string; cap: number; velocity: number; forecast: string };

function Inventory() {
  const navigate = useNavigate();
  const fallbackRows: InventoryRow[] = products.map((p) => ({
    ...p,
    cap: p.stock < 20 ? 50 : Math.max(p.stock * 1.4, 80),
    velocity: Math.round(2 + Math.random() * 40),
    forecast: p.stock < 20 ? "6h" : p.stock < 40 ? "2d" : "7d+",
  }));
  const [liveRows, setLiveRows] = useState<InventoryRow[] | null>(null);
  const rows = liveRows || fallbackRows;
  const load = () => api.inventory.list({ limit: 200 }).then(({ data }) => {
    const mapped = data.map((item: InventoryItem) => {
      const product = typeof item.product === "string" ? undefined : item.product;
      const stock = item.onHand - item.reserved;
      return { id: item._id, inventoryId: item._id, productId: product?._id, name: product?.name || item.sku, brand: product?.brand || item.supplier || "Freshly", price: product?.price || 0, unit: product?.unit || "each", emoji: product?.emoji || "📦", gradient: product?.gradient || "from-emerald-100 to-lime-100", category: product?.category || "inventory", rating: product?.rating || 0, reviews: product?.reviews || 0, stock, cap: Math.max(item.reorderPoint * 3, stock || 1), velocity: Math.max(1, Math.round(stock / 7)), forecast: stock <= item.reorderPoint ? "Restock now" : "Healthy" };
    });
    setLiveRows(mapped.length ? mapped : null);
  }).catch(() => toast.error("Inventory could not be refreshed", { description: "Showing demonstration inventory data until the API is available." }));

  useEffect(() => { load(); }, []);
  async function reorderLowStock() {
    const targets = rows.filter((row) => row.inventoryId && row.stock < 20);
    if (!targets.length) return toast.success("No low-stock items need reordering");
    try { await Promise.all(targets.map((row) => api.inventory.reorder(row.inventoryId!))); await load(); toast.success(`${targets.length} SKUs reordered`); }
    catch (error) { toast.error("Could not reorder inventory", { description: error instanceof Error ? error.message : "Please try again." }); }
  }
  async function adjust(row: InventoryRow) {
    if (!row.inventoryId) return toast.error("This demonstration item cannot be adjusted until it exists in the backend.");
    const value = window.prompt(`Adjust ${row.name} stock. Enter a positive or negative quantity:`, "0");
    if (value === null) return;
    const delta = Number(value);
    if (!Number.isFinite(delta) || delta === 0) return toast.error("Enter a non-zero stock adjustment.");
    try { await api.inventory.adjust(row.inventoryId, delta, "Manual admin adjustment"); await load(); toast.success("Inventory adjusted"); }
    catch (error) { toast.error("Could not adjust inventory", { description: error instanceof Error ? error.message : "Please try again." }); }
  }
  async function bulkReorder(selected: InventoryRow[]) {
    const targets = selected.filter((row) => row.inventoryId);
    if (!targets.length) return toast.error("Select backend inventory rows to reorder.");
    try { await Promise.all(targets.map((row) => api.inventory.reorder(row.inventoryId!))); await load(); toast.success(`${targets.length} SKUs reordered`); }
    catch (error) { toast.error("Could not reorder selected items", { description: error instanceof Error ? error.message : "Please try again." }); }
  }
  async function setMinimum(selected: InventoryRow[]) {
    const value = window.prompt("Set the reorder point for selected SKUs:", "15");
    if (value === null) return;
    const reorderPoint = Number(value);
    const targets = selected.filter((row) => row.inventoryId);
    if (!Number.isFinite(reorderPoint) || reorderPoint < 0 || !targets.length) return toast.error("Enter a valid reorder point and select backend inventory rows.");
    try { await Promise.all(targets.map((row) => api.inventory.update(row.inventoryId!, { reorderPoint }))); await load(); toast.success("Reorder points updated"); }
    catch (error) { toast.error("Could not update reorder points", { description: error instanceof Error ? error.message : "Please try again." }); }
  }

  const columns: Column<InventoryRow>[] = [
    {
      key: "name", header: "SKU", sortable: true, sortAccessor: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className={cn("size-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-xl shrink-0", r.gradient)}>{r.emoji}</div>
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-[11px] text-muted-foreground capitalize">{r.category} · {r.brand}</div>
          </div>
        </div>
      ),
    },
    {
      key: "stock", header: "Stock", sortable: true, sortAccessor: (r) => r.stock,
      render: (r) => {
        const pct = Math.min(100, (r.stock / r.cap) * 100);
        const low = r.stock < 20;
        return (
          <div className="min-w-[140px]">
            <div className="flex items-center justify-between text-[12px] mb-1">
              <span className={cn("tabular-nums font-semibold", low && "text-amber-700")}>{r.stock}/{Math.round(r.cap)}</span>
              {low && <StatusBadge tone="warning">Low</StatusBadge>}
            </div>
            <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
              <div className={cn("h-full rounded-full", low ? "bg-amber-500" : "bg-emerald-500")} style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      },
    },
    {
      key: "velocity", header: "Velocity", sortable: true, sortAccessor: (r) => r.velocity, align: "right",
      render: (r) => <span className="tabular-nums">{r.velocity}/hr</span>,
    },
    { key: "forecast", header: "Stockout ETA", render: (r) => <span className="text-muted-foreground">{r.forecast}</span> },
    {
      key: "price", header: "Price", sortable: true, sortAccessor: (r) => r.price, align: "right",
      render: (r) => <span className="tabular-nums font-semibold">${r.price.toFixed(2)}</span>,
    },
    {
      key: "trend", header: "Trend", align: "right",
      render: () => {
        const up = Math.random() > 0.3;
        const v = (Math.random() * 40 + 2).toFixed(1);
        return (
          <span className={cn("inline-flex items-center gap-0.5 tabular-nums text-[12px] font-semibold", up ? "text-emerald-600" : "text-rose-600")}>
            {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}{v}%
          </span>
        );
      },
    },
    { key: "actions", header: "", align: "right", render: (r) => <ToolbarButton variant="secondary" onClick={(event) => { event.stopPropagation(); adjust(r); }}>Adjust</ToolbarButton> },
  ];

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Live stock levels, velocity, AI forecasts and auto-reorder rules."
        actions={
          <>
            <ToolbarButton variant="secondary" onClick={() => load()}><RefreshCw className="size-3.5" /> Refresh</ToolbarButton>
            <ToolbarButton variant="primary" onClick={() => navigate({ to: "/admin/product/new" })}><Plus className="size-3.5" /> Add SKU</ToolbarButton>
          </>
        }
      />

      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total SKUs" value="632" icon={<Boxes className="size-4" />} />
          <StatCard label="In stock" value="612" delta="97%" deltaDir="up" />
          <StatCard label="Low stock" value="17" delta="Restock" deltaDir="down" />
          <StatCard label="Out of stock" value="3" delta="~$2.4k risk" deltaDir="down" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <SectionCard
            className="lg:col-span-2"
            title="Stock movement · 30 days"
          >
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueSeries}>
                  <defs>
                    <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" dataKey="orders" stroke="var(--color-primary)" strokeWidth={2} fill="url(#stockGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title={<div className="inline-flex items-center gap-1.5"><AlertTriangle className="size-4 text-amber-600" /> <span className="text-sm font-semibold">Restock alerts</span></div>}>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 mb-3">
              <div className="text-[13px] font-semibold text-amber-900">3 items may sell out in 6h</div>
              <div className="text-[11px] text-amber-800/80 mt-0.5">AI reorder can save ~$2.4k in lost sales.</div>
              <button onClick={reorderLowStock} className="mt-3 h-8 px-3 rounded-lg bg-amber-600 text-white text-[12px] font-semibold inline-flex items-center gap-1.5">
                <Sparkles className="size-3" /> Auto-reorder
              </button>
            </div>
            <ul className="space-y-2 text-[12px]">
              {rows.filter((r) => r.stock < 20).map((r) => (
                <li key={r.id} className="flex items-center gap-2">
                  <span className="text-lg">{r.emoji}</span>
                  <span className="flex-1 truncate">{r.name}</span>
                  <span className="tabular-nums text-amber-700 font-semibold">{r.stock}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        <DataTable<InventoryRow>
          data={rows}
          columns={columns}
          rowKey={(r) => r.id}
          searchAccessor={(r) => `${r.name} ${r.brand} ${r.category}`}
          searchPlaceholder="Search SKU, brand, category…"
          onRowClick={(row) => row.productId ? navigate({ to: "/admin/product/$id", params: { id: row.productId } }) : toast.error("Product details are unavailable for this demonstration item.")}
          exportFilename="inventory.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary" onClick={() => bulkReorder(sel)}><RefreshCw className="size-3.5" /> Reorder ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary" onClick={() => setMinimum(sel)}>Set min stock</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
