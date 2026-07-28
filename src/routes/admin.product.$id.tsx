import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api, type Product } from "@/lib/api-client";
import { PageBody, PageHeader, SectionCard, ToolbarButton } from "@/components/admin/primitives";
import { Field, FormGrid, SelectInput, TextArea, TextInput } from "@/components/admin/form";

export const Route = createFileRoute("/admin/product/$id")({ component: ProductDetail });

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.products.get(id).then(({ data }) => { setProduct(data); setForm(data); }).catch((error) => toast.error("Product could not be loaded", { description: error instanceof Error ? error.message : "Please return to the catalog." }));
  }, [id]);

  async function save() {
    if (!product || !form.name?.trim() || !form.price || Number(form.price) < 0) return toast.error("Enter a valid product name and price");
    setSaving(true);
    try {
      const { data } = await api.products.update(product._id, { ...form, price: Number(form.price) });
      setProduct(data); setForm(data); toast.success("Product updated");
    } catch (error) { toast.error("Could not save product", { description: error instanceof Error ? error.message : "Please try again." }); }
    finally { setSaving(false); }
  }

  if (!product) return <main className="grid min-h-[50vh] place-items-center text-sm text-muted-foreground">Loading product…</main>;
  const set = <K extends keyof Product>(key: K, value: Product[K]) => setForm((current) => ({ ...current, [key]: value }));

  return <>
    <PageHeader title={product.name} description={`Product ID: ${product._id}`} actions={<><ToolbarButton variant="secondary" onClick={() => navigate({ to: "/admin/products" })}>Back to catalog</ToolbarButton><ToolbarButton variant="primary" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save changes"}</ToolbarButton></>} />
    <PageBody className="max-w-5xl">
      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <SectionCard title="Product details"><FormGrid><Field label="Name" required><TextInput value={form.name || ""} onChange={(e) => set("name", e.target.value)} /></Field><Field label="Brand"><TextInput value={form.brand || ""} onChange={(e) => set("brand", e.target.value)} /></Field><Field label="Category"><TextInput value={form.category || ""} onChange={(e) => set("category", e.target.value)} /></Field><Field label="Unit"><TextInput value={form.unit || ""} onChange={(e) => set("unit", e.target.value)} /></Field></FormGrid><div className="mt-4"><Field label="Description"><TextArea value={form.description || ""} onChange={(e) => set("description", e.target.value)} /></Field></div></SectionCard>
          <SectionCard title="Pricing"><FormGrid cols={3}><Field label="Price" required><TextInput type="number" step="0.01" value={form.price ?? ""} onChange={(e) => set("price", Number(e.target.value))} /></Field><Field label="Compare-at price"><TextInput type="number" step="0.01" value={form.compareAt ?? ""} onChange={(e) => set("compareAt", e.target.value ? Number(e.target.value) : undefined)} /></Field><Field label="Rating"><TextInput type="number" step="0.1" value={form.rating ?? 0} onChange={(e) => set("rating", Number(e.target.value))} /></Field></FormGrid></SectionCard>
        </div>
        <div className="space-y-5"><SectionCard title="Publishing"><Field label="Status"><SelectInput value={form.status} onChange={(e) => set("status", e.target.value as Product["status"])} options={[{ value: "active", label: "Active" }, { value: "draft", label: "Draft" }, { value: "archived", label: "Archived" }]} /></Field><div className="mt-4"><Field label="AI tag"><TextInput value={form.aiTag || ""} onChange={(e) => set("aiTag", e.target.value)} /></Field></div></SectionCard><SectionCard title="Storefront preview"><div className="rounded-xl bg-secondary p-5 text-center"><div className="text-5xl">{form.emoji || "🛒"}</div><div className="mt-3 font-semibold">{form.name}</div><div className="mt-1 text-sm text-muted-foreground">{form.brand}</div><div className="mt-3 text-lg font-bold">${Number(form.price || 0).toFixed(2)}</div></div></SectionCard></div>
      </div>
    </PageBody>
  </>;
}
