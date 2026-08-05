import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageBody, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { Field, FormGrid, SelectInput, TextArea, TextInput, Toggle } from "@/components/admin/form";
import { Sparkles } from "lucide-react";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/admin/promotion/new")({
  head: () => ({
    meta: [
      { title: "New Promotion — Martify Admin" },
      { name: "description", content: "Build coupons, flash sales, bundles and cashback offers with targeting and budget caps." },
      { property: "og:title", content: "New Promotion — Martify Admin" },
      { property: "og:description", content: "Build coupons, flash sales, bundles and cashback offers with targeting and budget caps." },
    ],
  }),
  component: NewPromotion,
});

function NewPromotion() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("coupon");
  const [value, setValue] = useState("");
  const [stackable, setStackable] = useState(false);
  const [firstOrder, setFirstOrder] = useState(false);
  const [autoApply, setAutoApply] = useState(true);
  const [discountType, setDiscountType] = useState("percent");
  const [minSpend, setMinSpend] = useState("");
  const [usageLimit, setUsageLimit] = useState("1");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = "Give the campaign a name.";
    if (type === "coupon" && !code.trim()) next.code = "Coupon code is required.";
    if (!value) next.value = "Set a discount value.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setSaving(true);
    try {
      await api.promotions.create({ name: name.trim(), code: (code.trim() || name.replace(/\W+/g, "").slice(0, 16)).toUpperCase(), type: discountType === "shipping" ? "free_delivery" : discountType, value: Number(value), minSpend: Number(minSpend || 0), usageLimit: Number(usageLimit || 0) || undefined, status: startsAt ? "scheduled" : "active", startsAt: startsAt || undefined, endsAt: endsAt || undefined });
      toast.success(startsAt ? "Campaign scheduled" : "Campaign launched");
      navigate({ to: "/admin/promotions" });
    } catch (error) { toast.error("Could not create campaign", { description: error instanceof Error ? error.message : "Please try again." }); }
    finally { setSaving(false); }
  };

  return (
    <>
      <PageHeader
        title="New promotion"
        description="Discount mechanics, eligibility rules, schedule and spend guardrails."
        actions={
          <>
            <ToolbarButton variant="secondary" onClick={() => navigate({ to: "/admin/promotions" })}>Cancel</ToolbarButton>
            <ToolbarButton variant="primary" disabled={saving} onClick={() => void submit({ preventDefault() {} } as React.FormEvent)}>{saving ? "Launching…" : "Launch campaign"}</ToolbarButton>
          </>
        }
      />
      <PageBody>
        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          <div className="space-y-5">
            <SectionCard title="Campaign">
              <div className="space-y-4">
                <FormGrid>
                  <Field label="Campaign name" required error={errors.name}>
                    <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Weekend Fresh Fridays" />
                  </Field>
                  <Field label="Type">
                    <SelectInput value={type} onChange={(e) => setType(e.target.value)} options={[
                      { value: "coupon", label: "Coupon code" },
                      { value: "flash", label: "Flash sale" },
                      { value: "bundle", label: "Bundle" },
                      { value: "referral", label: "Referral" },
                      { value: "cashback", label: "Cashback" },
                    ]} />
                  </Field>
                </FormGrid>
                <Field label="Internal notes"><TextArea placeholder="Why we're running this, expected impact…" /></Field>
              </div>
            </SectionCard>

            <SectionCard title="Discount">
              <FormGrid cols={3}>
                {type === "coupon" && (
                  <Field label="Coupon code" required error={errors.code}>
                    <TextInput value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="FRESH20" />
                  </Field>
                )}
                <Field label="Discount type">
                  <SelectInput value={discountType} onChange={(e) => setDiscountType(e.target.value)} options={[{ value: "percent", label: "Percentage" }, { value: "fixed", label: "Fixed amount" }, { value: "shipping", label: "Free delivery" }]} />
                </Field>
                <Field label="Value" required error={errors.value}>
                  <TextInput type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="20" />
                </Field>
                <Field label="Min basket"><TextInput type="number" value={minSpend} onChange={(e) => setMinSpend(e.target.value)} placeholder="40" /></Field>
                <Field label="Max discount"><TextInput type="number" placeholder="25" /></Field>
                <Field label="Usage limit per customer"><TextInput type="number" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} /></Field>
              </FormGrid>
            </SectionCard>

            <SectionCard title="Eligibility">
              <div className="space-y-4">
                <FormGrid>
                  <Field label="Applies to">
                    <SelectInput options={[
                      { value: "all", label: "Entire catalog" },
                      { value: "category", label: "Specific categories" },
                      { value: "products", label: "Specific products" },
                    ]} />
                  </Field>
                  <Field label="Customer segment">
                    <SelectInput options={[
                      { value: "all", label: "All customers" },
                      { value: "new", label: "New customers" },
                      { value: "gold", label: "Gold + Platinum" },
                      { value: "churn", label: "At-risk / churning" },
                    ]} />
                  </Field>
                </FormGrid>
                <div className="divide-y divide-border">
                  <Toggle checked={firstOrder} onChange={setFirstOrder} label="First order only" description="Restrict to customers with zero completed orders." />
                  <Toggle checked={stackable} onChange={setStackable} label="Stackable" description="Can combine with other active promotions." />
                  <Toggle checked={autoApply} onChange={setAutoApply} label="Auto-apply at checkout" description="No code entry required when eligible." />
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5">
            <SectionCard title="Schedule">
              <FormGrid cols={1}>
                <Field label="Starts"><TextInput type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} /></Field>
                <Field label="Ends" hint="Leave blank to run indefinitely."><TextInput type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} /></Field>
                <Field label="Timezone">
                  <SelectInput options={[{ value: "local", label: "Store local time" }, { value: "utc", label: "UTC" }]} />
                </Field>
              </FormGrid>
            </SectionCard>

            <SectionCard title="Budget guardrails">
              <FormGrid cols={1}>
                <Field label="Total budget" hint="Campaign pauses automatically when reached."><TextInput type="number" placeholder="10000" /></Field>
                <Field label="Max redemptions"><TextInput type="number" placeholder="5000" /></Field>
              </FormGrid>
            </SectionCard>

            <SectionCard title="AI forecast">
              <div className="flex items-start gap-3">
                <Sparkles className="size-4 text-primary mt-0.5" />
                <div className="text-[12px] text-muted-foreground leading-relaxed">
                  Based on similar campaigns, expect <strong className="text-foreground">~1,240 redemptions</strong> and
                  <strong className="text-foreground"> $18.4k incremental revenue</strong> with a 12% margin impact.
                </div>
              </div>
              <div className="mt-3"><StatusBadge tone="info">confidence 72%</StatusBadge></div>
            </SectionCard>
          </div>
        </form>
      </PageBody>
    </>
  );
}
