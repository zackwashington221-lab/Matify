import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { MapPin, Phone, MessageCircle, Package, Truck, CheckCircle2, Clock, Printer, MoreHorizontal } from "lucide-react";

export const Route = createFileRoute("/admin/orders/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order #${params.id} — Martify Admin` },
      { name: "description", content: `Manage order #${params.id}: items, delivery status, refunds and customer notes.` },
    ],
  }),
  component: OrderDetail,
});

function OrderDetail() {
  const { id } = Route.useParams();
  return (
    <AdminMobileShell hideTabs>
      <AdminTopBar
        title={`#${id}`}
        subtitle="Placed today · 14:32"
        back="/admin/orders"
        right={<button className="size-10 rounded-full bg-secondary flex items-center justify-center"><MoreHorizontal className="size-4" /></button>}
      />

      <div className="px-5 mt-4">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 shadow-emerald">
          <div className="text-[10px] uppercase tracking-wider text-emerald-100 font-semibold">Status</div>
          <div className="font-display text-xl font-semibold mt-1">On the way</div>
          <div className="text-[12px] text-emerald-100 mt-1">ETA 14 min · Marcus J. driving</div>
          <div className="mt-4 flex items-center gap-2">
            <button className="flex-1 h-10 rounded-xl bg-white text-emerald-700 text-[12px] font-semibold inline-flex items-center justify-center gap-1.5"><Phone className="size-4" />Call driver</button>
            <button className="flex-1 h-10 rounded-xl bg-white/15 text-white text-[12px] font-semibold inline-flex items-center justify-center gap-1.5"><MessageCircle className="size-4" />Message</button>
          </div>
        </div>
      </div>

      <SectionTitle>Timeline</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 space-y-4">
        {[
          { icon: CheckCircle2, label: "Order placed", time: "14:32", done: true },
          { icon: Package, label: "Packed & QC checked", time: "14:41", done: true },
          { icon: Truck, label: "Out for delivery", time: "14:58", done: true, active: true },
          { icon: Clock, label: "Delivered", time: "ETA 15:12", done: false },
        ].map((t, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ${t.active ? "bg-primary text-primary-foreground" : t.done ? "bg-primary-soft text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>
              <t.icon className="size-4" />
            </div>
            <div className="flex-1">
              <div className={`text-[13px] font-semibold ${t.done ? "" : "text-muted-foreground"}`}>{t.label}</div>
              <div className="text-[11px] text-muted-foreground">{t.time}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Customer</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-gradient-to-br from-amber-300 to-rose-400 text-white font-semibold flex items-center justify-center">AM</div>
          <div className="flex-1">
            <div className="font-semibold text-[14px]">Alex Morgan</div>
            <div className="text-[11px] text-muted-foreground">Gold tier · 34 orders</div>
          </div>
          <button className="text-[11px] font-semibold text-primary">View</button>
        </div>
        <div className="mt-4 flex items-start gap-2 text-[12px] text-muted-foreground">
          <MapPin className="size-4 shrink-0 mt-0.5" />
          <span>218 Bleecker St, Apt 3B · New York, NY 10012</span>
        </div>
      </div>

      <SectionTitle action={<button className="text-[12px] font-semibold text-primary inline-flex items-center gap-1"><Printer className="size-3.5" />Invoice</button>}>Items · 6</SectionTitle>
      <div className="px-5 space-y-2">
        {[
          { e: "🥑", n: "Hass Avocados", q: 4, p: "$5.96" },
          { e: "🍓", n: "Organic Strawberries", q: 1, p: "$4.99" },
          { e: "🥖", n: "Artisan Sourdough", q: 1, p: "$6.50" },
          { e: "🥛", n: "Oat Milk Barista", q: 2, p: "$9.98" },
          { e: "🥚", n: "Free-Range Eggs", q: 1, p: "$5.49" },
          { e: "☕", n: "Blue Bottle Coffee", q: 1, p: "$18.00" },
        ].map((i) => (
          <div key={i.n} className="flex items-center gap-3 rounded-2xl bg-card border border-border p-3">
            <div className="size-10 rounded-xl bg-secondary flex items-center justify-center text-lg">{i.e}</div>
            <div className="flex-1"><div className="text-[13px] font-semibold">{i.n}</div><div className="text-[11px] text-muted-foreground">Qty {i.q}</div></div>
            <div className="text-[13px] font-semibold tabular-nums">{i.p}</div>
          </div>
        ))}
      </div>

      <div className="mx-5 mt-4 rounded-3xl bg-card border border-border p-5 space-y-2 text-[13px]">
        {[
          ["Subtotal", "$50.92"],
          ["Delivery", "$2.99"],
          ["Tax", "$4.20"],
          ["AI savings", "-$3.79"],
        ].map(([l, v]) => (
          <div key={l} className="flex justify-between"><span className="text-muted-foreground">{l}</span><span className="tabular-nums">{v}</span></div>
        ))}
        <div className="pt-2 border-t border-border flex justify-between font-semibold"><span>Total</span><span className="tabular-nums">$54.32</span></div>
      </div>

      <div className="px-5 mt-5 flex gap-2">
        <button className="flex-1 h-12 rounded-2xl bg-secondary text-[13px] font-semibold">Refund</button>
        <button className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground text-[13px] font-semibold shadow-emerald">Mark delivered</button>
      </div>
    </AdminMobileShell>
  );
}
