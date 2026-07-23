import { createFileRoute } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Sparkles, Copy, Trash2, TrendingUp } from "lucide-react";
import { productById } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Edit product — Freshly Admin` },
      { name: "description", content: `Edit product ${params.id}: pricing, inventory, AI tags and merchandising.` },
    ],
  }),
  component: ProductEdit,
});

function ProductEdit() {
  const { id } = Route.useParams();
  const p = productById(id);
  return (
    <AdminMobileShell hideTabs>
      <AdminTopBar
        title="Edit product"
        subtitle={p.id.toUpperCase()}
        back="/admin/products"
        right={<button className="h-10 px-4 rounded-full bg-primary text-primary-foreground text-[12px] font-semibold shadow-emerald">Save</button>}
      />

      <div className="px-5 mt-4">
        <div className={`aspect-[16/10] rounded-3xl bg-gradient-to-br ${p.gradient} flex items-center justify-center text-8xl relative`}>
          {p.emoji}
          <button className="absolute bottom-3 right-3 h-9 px-3 rounded-full bg-white/90 backdrop-blur text-[11px] font-semibold">Replace image</button>
        </div>
      </div>

      <SectionTitle>Basics</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 space-y-4">
        <Field label="Name" value={p.name} />
        <Field label="Brand" value={p.brand} />
        <Field label="Category" value={p.category} />
        <Field label="Unit" value={p.unit} />
      </div>

      <SectionTitle>Pricing & stock</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price" value={`$${p.price.toFixed(2)}`} />
          <Field label="Compare at" value={p.compareAt ? `$${p.compareAt.toFixed(2)}` : "—"} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stock" value={String(p.stock)} />
          <Field label="Reorder point" value="15" />
        </div>
      </div>

      <SectionTitle>AI merchandising</SectionTitle>
      <div className="mx-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 shadow-emerald">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-emerald-100 font-semibold"><Sparkles className="size-3.5" />AI copilot</div>
        <div className="mt-2 text-[14px] font-semibold leading-snug">Generate a fresh product description tuned for your Gold tier shoppers.</div>
        <div className="mt-4 flex gap-2">
          <button className="flex-1 h-10 rounded-xl bg-white text-emerald-700 text-[12px] font-semibold">Generate copy</button>
          <button className="h-10 px-3 rounded-xl bg-white/15 text-white text-[12px] font-semibold">Tags</button>
        </div>
      </div>

      <SectionTitle>Badges</SectionTitle>
      <div className="px-5 flex flex-wrap gap-2">
        {["Organic", "In season", "Frequent buy", "Healthier pick", "New", "Local"].map((b, i) => (
          <button key={b} className={`text-[11px] font-semibold rounded-full px-3 py-1.5 border ${i < 2 ? "bg-primary text-primary-foreground border-primary" : "bg-card text-foreground border-border"}`}>{b}</button>
        ))}
      </div>

      <SectionTitle>Performance · 30d</SectionTitle>
      <div className="mx-5 rounded-3xl bg-card border border-border p-5 grid grid-cols-3 gap-3">
        {[
          { l: "Units", v: "1,204" },
          { l: "Revenue", v: "$1.8k" },
          { l: "Return", v: "0.4%" },
        ].map((k) => (
          <div key={k.l}>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.l}</div>
            <div className="text-lg font-bold font-display tabular-nums mt-0.5">{k.v}</div>
            <div className="text-[10px] text-emerald-600 font-semibold inline-flex items-center gap-0.5"><TrendingUp className="size-3" />+8%</div>
          </div>
        ))}
      </div>

      <div className="px-5 mt-5 flex gap-2">
        <button className="flex-1 h-11 rounded-2xl bg-secondary text-[12px] font-semibold inline-flex items-center justify-center gap-1.5"><Copy className="size-4" />Duplicate</button>
        <button className="flex-1 h-11 rounded-2xl bg-rose-50 text-rose-700 text-[12px] font-semibold inline-flex items-center justify-center gap-1.5"><Trash2 className="size-4" />Archive</button>
      </div>
    </AdminMobileShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{label}</div>
      <input defaultValue={value} className="w-full h-10 px-3 rounded-xl bg-secondary text-[13px] font-medium outline-none" />
    </label>
  );
}
