import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { Field, FormGrid, SelectInput, TextArea, TextInput, Toggle } from "@/components/admin/form";
import { ImagePlus, Sparkles, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/product/new")({
  head: () => ({
    meta: [
      { title: "New Product — Freshly Admin" },
      { name: "description", content: "Create a product with pricing, variants, inventory, media and AI-generated copy." },
      { property: "og:title", content: "New Product — Freshly Admin" },
      { property: "og:description", content: "Create a product with pricing, variants, inventory, media and AI-generated copy." },
    ],
  }),
  component: NewProduct,
});

type Variant = { id: number; name: string; sku: string; price: string; stock: string };

function NewProduct() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [published, setPublished] = useState(true);
  const [trackStock, setTrackStock] = useState(true);
  const [subscribable, setSubscribable] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([{ id: 1, name: "Default", sku: "SKU-0001", price: "", stock: "0" }]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const aiCopy = () =>
    setDescription(
      `${name || "This product"} is hand-picked at peak freshness and delivered within hours. Naturally grown, rich in flavour, and packed to keep its texture from our chill-chain to your kitchen.`
    );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Product name is required.";
    if (!price || Number(price) <= 0) next.price = "Enter a price greater than 0.";
    setErrors(next);
    if (Object.keys(next).length === 0) navigate({ to: "/admin/products" });
  };

  return (
    <>
      <PageHeader
        title="New product"
        description="Everything the storefront and the Expo app need to render, price and fulfil this item."
        actions={
          <>
            <ToolbarButton variant="secondary" onClick={() => navigate({ to: "/admin/products" })}>Cancel</ToolbarButton>
            <ToolbarButton variant="secondary">Save draft</ToolbarButton>
            <ToolbarButton variant="primary" onClick={submit}>Publish product</ToolbarButton>
          </>
        }
      />
      <PageBody>
        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          <div className="space-y-5">
            <SectionCard title="Basics">
              <div className="space-y-4">
                <FormGrid>
                  <Field label="Product name" required error={errors.name}>
                    <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Organic Hass Avocado" />
                  </Field>
                  <Field label="Brand"><TextInput placeholder="Freshly Farms" /></Field>
                </FormGrid>
                <Field
                  label="Description"
                  hint="Shown on the product page and used for search relevance."
                >
                  <TextArea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe taste, origin, storage…" />
                </Field>
                <ToolbarButton type="button" variant="secondary" onClick={aiCopy}><Sparkles className="size-3.5" /> Generate with AI</ToolbarButton>
              </div>
            </SectionCard>

            <SectionCard title="Pricing">
              <FormGrid cols={3}>
                <Field label="Price" required error={errors.price}>
                  <TextInput type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="4.99" />
                </Field>
                <Field label="Compare-at price" hint="Shows a strikethrough."><TextInput type="number" step="0.01" placeholder="6.49" /></Field>
                <Field label="Cost per unit" hint="Used for margin reporting."><TextInput type="number" step="0.01" placeholder="2.10" /></Field>
                <Field label="Tax class">
                  <SelectInput options={[{ value: "food", label: "Food (0%)" }, { value: "standard", label: "Standard" }, { value: "reduced", label: "Reduced" }]} />
                </Field>
                <Field label="Unit">
                  <SelectInput options={[{ value: "each", label: "Each" }, { value: "kg", label: "Per kg" }, { value: "pack", label: "Pack" }]} />
                </Field>
                <Field label="Min order qty"><TextInput type="number" defaultValue={1} /></Field>
              </FormGrid>
            </SectionCard>

            <SectionCard
              title="Variants"
              action={
                <ToolbarButton
                  type="button"
                  variant="secondary"
                  onClick={() => setVariants((v) => [...v, { id: Date.now(), name: "", sku: `SKU-${1000 + v.length}`, price: "", stock: "0" }])}
                >
                  Add variant
                </ToolbarButton>
              }
            >
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={v.id} className="grid sm:grid-cols-[1fr_1fr_120px_100px_40px] gap-3 items-end">
                    <Field label={i === 0 ? "Variant" : ""}>
                      <TextInput value={v.name} placeholder="500g" onChange={(e) => setVariants((all) => all.map((x) => x.id === v.id ? { ...x, name: e.target.value } : x))} />
                    </Field>
                    <Field label={i === 0 ? "SKU" : ""}>
                      <TextInput value={v.sku} onChange={(e) => setVariants((all) => all.map((x) => x.id === v.id ? { ...x, sku: e.target.value } : x))} />
                    </Field>
                    <Field label={i === 0 ? "Price" : ""}>
                      <TextInput type="number" step="0.01" value={v.price} onChange={(e) => setVariants((all) => all.map((x) => x.id === v.id ? { ...x, price: e.target.value } : x))} />
                    </Field>
                    <Field label={i === 0 ? "Stock" : ""}>
                      <TextInput type="number" value={v.stock} onChange={(e) => setVariants((all) => all.map((x) => x.id === v.id ? { ...x, stock: e.target.value } : x))} />
                    </Field>
                    <button
                      type="button"
                      aria-label="Remove variant"
                      onClick={() => setVariants((all) => all.filter((x) => x.id !== v.id))}
                      className="h-10 w-10 rounded-xl border border-border hover:bg-secondary flex items-center justify-center text-muted-foreground"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Media">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <button key={i} type="button" className="aspect-square rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-secondary/50 transition-colors flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                    <ImagePlus className="size-5" />
                    <span className="text-[11px] font-medium">{i === 0 ? "Cover image" : "Add image"}</span>
                  </button>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5">
            <SectionCard title="Status">
              <div className="divide-y divide-border">
                <Toggle checked={published} onChange={setPublished} label="Published" description="Visible in the app and web store." />
                <Toggle checked={trackStock} onChange={setTrackStock} label="Track inventory" description="Deduct stock on each order." />
                <Toggle checked={subscribable} onChange={setSubscribable} label="Subscription eligible" description="Allow weekly auto-delivery." />
              </div>
              <div className="pt-3">
                <StatusBadge tone={published ? "success" : "muted"}>{published ? "will go live" : "draft"}</StatusBadge>
              </div>
            </SectionCard>

            <SectionCard title="Organisation">
              <div className="space-y-4">
                <Field label="Category">
                  <SelectInput options={[
                    { value: "produce", label: "Fresh produce" },
                    { value: "dairy", label: "Dairy & eggs" },
                    { value: "bakery", label: "Bakery" },
                    { value: "meat", label: "Meat & seafood" },
                    { value: "pantry", label: "Pantry" },
                  ]} />
                </Field>
                <Field label="Tags" hint="Comma separated"><TextInput placeholder="organic, vegan, local" /></Field>
                <Field label="Supplier"><TextInput placeholder="Green Valley Co-op" /></Field>
                <Field label="Shelf life (days)"><TextInput type="number" placeholder="7" /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Fulfilment">
              <FormGrid cols={1}>
                <Field label="Storage zone">
                  <SelectInput options={[{ value: "ambient", label: "Ambient" }, { value: "chilled", label: "Chilled 2–6°C" }, { value: "frozen", label: "Frozen" }]} />
                </Field>
                <Field label="Weight (g)"><TextInput type="number" placeholder="250" /></Field>
              </FormGrid>
            </SectionCard>
          </div>
        </form>
      </PageBody>
    </>
  );
}
