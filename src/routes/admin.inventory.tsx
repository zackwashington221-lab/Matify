import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, StatCard, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { AlertTriangle, ArrowUp, ArrowDown, Boxes, Plus, RefreshCw, Sparkles, Upload } from "lucide-react";
import { products, type Product } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { revenueSeries } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — Freshly Admin" },
      { name: "description", content: "Real-time stock, forecasting, low-stock alerts and AI auto-reorder." },
    ],
  }),
  component: Inventory,
});

type InventoryRow = Product & { cap: number; velocity: number; forecast: string };

function Inventory() {
  const rows: InventoryRow[] = products.map((p) => ({
    ...p,
    cap: p.stock < 20 ? 50 : Math.max(p.stock * 1.4, 80),
    velocity: Math.round(2 + Math.random() * 40),
    forecast: p.stock < 20 ? "6h" : p.stock < 40 ? "2d" : "7d+",
  }));

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
  ];

  return (
    <>
      <PageHeader
        title="Inventory"
        description="Live stock levels, velocity, AI forecasts and auto-reorder rules."
        actions={
          <>
            <ToolbarButton variant="secondary"><Upload className="size-3.5" /> Import</ToolbarButton>
            <ToolbarButton variant="secondary"><RefreshCw className="size-3.5" /> Adjust</ToolbarButton>
            <ToolbarButton variant="primary"><Plus className="size-3.5" /> Add SKU</ToolbarButton>
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
              <button className="mt-3 h-8 px-3 rounded-lg bg-amber-600 text-white text-[12px] font-semibold inline-flex items-center gap-1.5">
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
          exportFilename="inventory.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary"><RefreshCw className="size-3.5" /> Reorder ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary">Set min stock</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
