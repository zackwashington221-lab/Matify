import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageBody, SectionCard, StatCard, StatusBadge, Tabs, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Ban, Plus, Printer, Send, ShoppingBag, Trash2 } from "lucide-react";
import { orders, statusTone, paymentTone, type Order, type OrderStatus } from "@/lib/admin-mock";
import { api, type Customer, type Order as ApiOrder, type Product } from "@/lib/api-client";

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
  const [creating, setCreating] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [liveOrders, setLiveOrders] = useState<Order[] | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState([{ productId: "", qty: 1 }]);
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const load = () => Promise.all([api.orders.list({ limit: 200, sort: "-placedAt" }), api.customers.list({ limit: 200 }), api.products.list({ limit: 200 })])
    .then(([orderList, customerList, productList]) => {
      const mapped = orderList.data.map(toOrderRow);
      setLiveOrders(mapped.length ? mapped : null);
      setCustomers(customerList.data);
      setProducts(productList.data);
    })
    .catch(() => toast.error("Orders could not be refreshed", { description: "Showing demonstration order data until the API is available." }));

  useEffect(() => { load(); }, []);

  const orderData = liveOrders || orders;
  const filtered = tab === "all" ? orderData : orderData.filter((o) => o.status === tab);
  const totals = {
    pending: orderData.filter((o) => o.status === "pending").length,
    packing: orderData.filter((o) => o.status === "packing").length,
    shipped: orderData.filter((o) => o.status === "shipped").length,
    delivered: orderData.filter((o) => o.status === "delivered").length,
  };

  const revenue = orderData.reduce((s, o) => s + o.total, 0);

  async function createOrder(event: React.FormEvent) {
    event.preventDefault();
    if (!customerId || lines.some((line) => !line.productId)) return toast.error("Select a customer and product for every line");
    setSaving(true);
    try {
      await api.orders.createManual({ customerId, items: lines, address, channel: "web" });
      toast.success("Order created");
      setCreating(false); setCustomerId(""); setLines([{ productId: "", qty: 1 }]); setAddress("");
      await load();
    } catch (error) {
      toast.error("Could not create order", { description: error instanceof Error ? error.message : "Please try again." });
    } finally { setSaving(false); }
  }

  async function updateMany(selected: Order[]) {
    if (!liveOrders) return toast.error("Bulk actions need orders saved in the backend.");
    try {
      await Promise.all(selected.map((order) => api.orders.setStatus(order.id, "cancelled", "Cancelled in bulk from admin")));
      await load();
      toast.success(`${selected.length} order${selected.length === 1 ? "" : "s"} cancelled`);
    } catch (error) { toast.error("Bulk action failed", { description: error instanceof Error ? error.message : "Please try again." }); }
  }

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
            <ToolbarButton variant="secondary" onClick={() => window.print()}><Printer className="size-3.5" /> Print</ToolbarButton>
            <ToolbarButton variant="primary" onClick={() => setCreating((value) => !value)}><Plus className="size-3.5" /> New order</ToolbarButton>
          </>
        }
      />

      <PageBody>
        {creating && (
          <SectionCard title="Create order" action={<ToolbarButton variant="ghost" onClick={() => setCreating(false)}>Close</ToolbarButton>}>
            <form onSubmit={createOrder} className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-xs font-semibold">Customer<select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"><option value="">Select customer</option>{customers.map((customer) => <option key={customer._id} value={customer._id}>{customer.name} · {customer.email}</option>)}</select></label>
                <label className="text-xs font-semibold">Delivery address<input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Customer delivery address" className="mt-1.5 h-10 w-full rounded-lg border border-border bg-background px-3 text-sm" /></label>
              </div>
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_40px] gap-3 bg-secondary/60 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"><span>Product</span><span>Quantity</span><span /></div>
                {lines.map((line, index) => <div key={index} className="grid grid-cols-[1fr_100px_40px] items-center gap-3 border-t border-border px-3 py-2"><select value={line.productId} onChange={(e) => setLines((all) => all.map((item, i) => i === index ? { ...item, productId: e.target.value } : item))} className="h-10 min-w-0 rounded-lg border border-border bg-background px-3 text-sm"><option value="">Select product</option>{products.map((product) => <option key={product._id} value={product._id}>{product.name} · ${product.price.toFixed(2)}</option>)}</select><input value={line.qty} onChange={(e) => setLines((all) => all.map((item, i) => i === index ? { ...item, qty: Math.max(1, Number(e.target.value) || 1) } : item))} type="number" min="1" className="h-10 rounded-lg border border-border bg-background px-3 text-sm" /><button type="button" disabled={lines.length === 1} onClick={() => setLines((all) => all.filter((_, i) => i !== index))} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-secondary disabled:opacity-30"><Trash2 className="size-4" /></button></div>)}
              </div>
              <div className="flex justify-between"><ToolbarButton type="button" variant="secondary" onClick={() => setLines((all) => [...all, { productId: "", qty: 1 }])}><Plus className="size-3.5" /> Add item</ToolbarButton><ToolbarButton type="submit" variant="primary" disabled={saving}>{saving ? "Creating…" : "Create order"}</ToolbarButton></div>
            </form>
          </SectionCard>
        )}
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
            { value: "all", label: "All", count: orderData.length },
            { value: "pending", label: "Pending", count: totals.pending },
            { value: "packing", label: "Packing", count: totals.packing },
            { value: "shipped", label: "Shipped", count: totals.shipped },
            { value: "delivered", label: "Delivered", count: totals.delivered },
            { value: "cancelled", label: "Cancelled" },
            { value: "refunded", label: "Refunded" },
          ]}
        />

        {activeOrder && (
          <SectionCard title={`Order #${activeOrder.id}`} action={<ToolbarButton variant="ghost" onClick={() => setActiveOrder(null)}>Close</ToolbarButton>}>
            <div className="grid gap-5 md:grid-cols-3">
              <div><div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Customer</div><div className="mt-1 font-semibold">{activeOrder.customer}</div><div className="text-sm text-muted-foreground">{activeOrder.email || "No email recorded"}</div></div>
              <div><div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Fulfilment</div><div className="mt-1"><StatusBadge tone={statusTone[activeOrder.status]}>{activeOrder.status}</StatusBadge></div><div className="mt-2 text-sm text-muted-foreground">Placed {formatDate(activeOrder.placedAt)}</div></div>
              <div><div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Payment</div><div className="mt-1"><StatusBadge tone={paymentTone[activeOrder.payment]}>{activeOrder.payment}</StatusBadge></div><div className="mt-2 text-lg font-semibold tabular-nums">${activeOrder.total.toFixed(2)} · {activeOrder.items} items</div></div>
            </div>
          </SectionCard>
        )}

        <DataTable<Order>
          data={filtered}
          columns={columns}
          rowKey={(o) => o.id}
          searchAccessor={(o) => `${o.id} ${o.customer} ${o.email}`}
          searchPlaceholder="Search orders, customers, emails…"
          onRowClick={setActiveOrder}
          exportFilename="orders.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary" onClick={() => navigate({ to: "/admin/notification/new" })}><Send className="size-3.5" /> Notify ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary" onClick={() => void updateMany(sel)}><Ban className="size-3.5" /> Cancel</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}

function toOrderRow(order: ApiOrder): Order {
  const status: OrderStatus = order.status === "confirmed" || order.status === "picking" ? "packing" : order.status === "out_for_delivery" ? "shipped" : order.status;
  const payment = order.paymentStatus === "paid" ? "paid" : order.paymentStatus.includes("refund") ? "refunded" : order.paymentStatus === "unpaid" ? "pending" : "failed";
  const customer = typeof order.customer === "object" ? order.customer : undefined;
  return { id: order._id, customer: customer?.name || "Customer", email: customer?.email || "", total: order.total, items: order.items.reduce((sum, item) => sum + item.qty, 0), status, payment, channel: order.channel === "phone" ? "kiosk" : order.channel, placedAt: order.placedAt };
}
