import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, StatCard, StatusBadge, Tabs, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Archive, Ban, Plus, Printer, Send, ShoppingBag } from "lucide-react";
import { orders, statusTone, paymentTone, type Order, type OrderStatus } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({
    meta: [
      { title: "Orders — Freshly Admin" },
      { name: "description", content: "Full order lifecycle: pending, packing, shipped, delivered, refunds and returns." },
    ],
  }),
  component: Orders,
});

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

function Orders() {
  const [tab, setTab] = useState<"all" | OrderStatus>("all");
  const navigate = useNavigate();

  const filtered = tab === "all" ? orders : orders.filter((o) => o.status === tab);
  const totals = {
    pending: orders.filter((o) => o.status === "pending").length,
    packing: orders.filter((o) => o.status === "packing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  const revenue = orders.reduce((s, o) => s + o.total, 0);

  const columns: Column<Order>[] = [
    {
      key: "id", header: "Order", sortable: true, sortAccessor: (o) => o.id,
      render: (o) => <span className="font-semibold tabular-nums">#{o.id}</span>,
    },
    {
      key: "customer", header: "Customer", sortable: true, sortAccessor: (o) => o.customer,
      render: (o) => (
        <div>
          <div className="font-medium">{o.customer}</div>
          <div className="text-[11px] text-muted-foreground">{o.email}</div>
        </div>
      ),
    },
    {
      key: "items", header: "Items", sortable: true, sortAccessor: (o) => o.items,
      align: "right",
      render: (o) => <span className="tabular-nums">{o.items}</span>,
    },
    {
      key: "status", header: "Status",
      render: (o) => <StatusBadge tone={statusTone[o.status]}>{o.status}</StatusBadge>,
    },
    {
      key: "payment", header: "Payment",
      render: (o) => <StatusBadge tone={paymentTone[o.payment]}>{o.payment}</StatusBadge>,
    },
    {
      key: "channel", header: "Channel",
      render: (o) => <span className="text-muted-foreground capitalize">{o.channel}</span>,
    },
    {
      key: "placedAt", header: "Placed", sortable: true, sortAccessor: (o) => o.placedAt,
      render: (o) => <span className="text-muted-foreground">{formatDate(o.placedAt)}</span>,
    },
    {
      key: "total", header: "Total", sortable: true, sortAccessor: (o) => o.total,
      align: "right",
      render: (o) => <span className="tabular-nums font-semibold">${o.total.toFixed(2)}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Orders"
        description="Every order across app, web and kiosk channels with live status and AI fraud signals."
        actions={
          <>
            <ToolbarButton variant="secondary"><Printer className="size-3.5" /> Print</ToolbarButton>
            <ToolbarButton variant="primary"><Plus className="size-3.5" /> New order</ToolbarButton>
          </>
        }
      />

      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Revenue · this batch" value={`$${revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} delta="+12.4%" deltaDir="up" icon={<ShoppingBag className="size-4" />} />
          <StatCard label="Pending fulfillment" value={String(totals.pending + totals.packing)} delta="6 urgent" deltaDir="flat" />
          <StatCard label="In transit" value={String(totals.shipped)} hint="avg 28min ETA" />
          <StatCard label="Delivered · today" value="248" delta="+8.1%" deltaDir="up" />
        </div>

        <Tabs
          value={tab}
          onChange={(v) => setTab(v as typeof tab)}
          items={[
            { value: "all", label: "All", count: orders.length },
            { value: "pending", label: "Pending", count: totals.pending },
            { value: "packing", label: "Packing", count: totals.packing },
            { value: "shipped", label: "Shipped", count: totals.shipped },
            { value: "delivered", label: "Delivered", count: totals.delivered },
            { value: "cancelled", label: "Cancelled" },
            { value: "refunded", label: "Refunded" },
          ]}
        />

        <DataTable<Order>
          data={filtered}
          columns={columns}
          rowKey={(o) => o.id}
          searchAccessor={(o) => `${o.id} ${o.customer} ${o.email}`}
          searchPlaceholder="Search orders, customers, emails…"
          onRowClick={(o) => navigate({ to: "/admin/orders/$id", params: { id: o.id } })}
          exportFilename="orders.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary"><Send className="size-3.5" /> Notify ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary"><Archive className="size-3.5" /> Archive</ToolbarButton>
              <ToolbarButton variant="secondary"><Ban className="size-3.5" /> Cancel</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
