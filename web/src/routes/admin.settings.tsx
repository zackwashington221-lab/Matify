import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shield, Users, Save, Wrench } from "lucide-react";
import { PageHeader, PageBody, SectionCard, ToolbarButton } from "@/components/admin/primitives";
import { Field, FormGrid, SelectInput, TextInput, Toggle } from "@/components/admin/form";
import { api, type SettingRecord } from "@/lib/api-client";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Martify Admin" },
      {
        name: "description",
        content: "Store-wide delivery, checkout, notification, security and feature controls.",
      },
    ],
  }),
  component: Settings,
});
type Values = Record<string, string | number | boolean>;
const defaults: Values = {
  "store.name": "Martify",
  "support.email": "help@martify.io",
  "store.timezone": "Asia/Karachi",
  "checkout.currency": "USD",
  "delivery.radiusKm": 12,
  "delivery.fee": 2.99,
  "delivery.freeThreshold": 45,
  "delivery.hours": "08:00–22:00",
  "checkout.minOrder": 10,
  "checkout.taxRate": 0,
  "checkout.cashOnDelivery": false,
  "returns.windowDays": 7,
  "returns.refundCap": 250,
  "returns.restockEligible": false,
  "notifications.quietHours": true,
  "security.requireMfa": false,
  "security.sessionHours": 24,
  "maintenance.enabled": false,
  "maintenance.message": "We are making Martify better. Please check back shortly.",
  "feature.aiRecommendations": true,
  "feature.scheduledDelivery": true,
  "feature.referrals": false,
};
function Settings() {
  const [values, setValues] = useState<Values>(defaults);
  const [records, setRecords] = useState<Record<string, SettingRecord>>({});
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    api.settings
      .list({ limit: 200 })
      .then((response) => {
        const next: Record<string, SettingRecord> = {};
        const loaded: Values = { ...defaults };
        response.data.forEach((record) => {
          next[record.key] = record;
          if (
            record.key in defaults &&
            (typeof record.value === "string" ||
              typeof record.value === "number" ||
              typeof record.value === "boolean")
          )
            loaded[record.key] = record.value;
        });
        setRecords(next);
        setValues(loaded);
      })
      .catch((error) =>
        toast.error("Settings could not be loaded", {
          description:
            error instanceof Error
              ? error.message
              : "Using default values until the backend is available.",
        }),
      );
  }, []);
  const set = (key: string, value: Values[string]) =>
    setValues((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true);
    try {
      const nextRecords = { ...records };
      await Promise.all(
        Object.entries(values).map(async ([key, value]) => {
          const record = records[key];
          const response = record
            ? await api.settings.update(record._id, { value })
            : await api.settings.create({ key, value, group: key.split(".")[0] });
          nextRecords[key] = response.data;
        }),
      );
      setRecords(nextRecords);
      toast.success("Settings saved");
    } catch (error) {
      toast.error("Could not save settings", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <PageHeader
        title="Settings"
        description="Store-wide rules for the marketplace. Changes are saved to the backend."
        actions={
          <ToolbarButton variant="primary" disabled={saving} onClick={() => void save()}>
            <Save className="size-3.5" /> {saving ? "Saving…" : "Save settings"}
          </ToolbarButton>
        }
      />
      <PageBody>
        <SectionCard title="Administration" padded={false}>
          <div className="divide-y divide-border">
            <Link
              to="/admin/team"
              className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40"
            >
              <div className="size-10 rounded-xl bg-secondary grid place-items-center">
                <Users className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold">Admin users</div>
                <div className="text-[12px] text-muted-foreground">
                  Invite members, enforce MFA, and manage account access.
                </div>
              </div>
            </Link>
            <Link
              to="/admin/roles"
              className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40"
            >
              <div className="size-10 rounded-xl bg-secondary grid place-items-center">
                <Shield className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-semibold">Roles & permissions</div>
                <div className="text-[12px] text-muted-foreground">
                  Manage role matrices and access boundaries.
                </div>
              </div>
            </Link>
          </div>
        </SectionCard>
        <SectionCard title="Store & delivery">
          <FormGrid cols={3}>
            <Field label="Store name">
              <TextInput
                value={String(values["store.name"])}
                onChange={(e) => set("store.name", e.target.value)}
              />
            </Field>
            <Field label="Support email">
              <TextInput
                type="email"
                value={String(values["support.email"])}
                onChange={(e) => set("support.email", e.target.value)}
              />
            </Field>
            <Field label="Timezone">
              <TextInput
                value={String(values["store.timezone"])}
                onChange={(e) => set("store.timezone", e.target.value)}
              />
            </Field>
            <Field label="Delivery radius (km)">
              <TextInput
                type="number"
                value={String(values["delivery.radiusKm"])}
                onChange={(e) => set("delivery.radiusKm", Number(e.target.value))}
              />
            </Field>
            <Field label="Delivery fee">
              <TextInput
                type="number"
                step="0.01"
                value={String(values["delivery.fee"])}
                onChange={(e) => set("delivery.fee", Number(e.target.value))}
              />
            </Field>
            <Field label="Free delivery threshold">
              <TextInput
                type="number"
                value={String(values["delivery.freeThreshold"])}
                onChange={(e) => set("delivery.freeThreshold", Number(e.target.value))}
              />
            </Field>
            <Field label="Delivery hours">
              <TextInput
                value={String(values["delivery.hours"])}
                onChange={(e) => set("delivery.hours", e.target.value)}
              />
            </Field>
            <Field label="Currency">
              <SelectInput
                value={String(values["checkout.currency"])}
                onChange={(e) => set("checkout.currency", e.target.value)}
                options={[
                  { value: "USD", label: "USD ($)" },
                  { value: "PKR", label: "PKR (₨)" },
                  { value: "GBP", label: "GBP (£)" },
                ]}
              />
            </Field>
          </FormGrid>
        </SectionCard>
        <SectionCard title="Checkout & returns">
          <FormGrid cols={3}>
            <Field label="Minimum order value">
              <TextInput
                type="number"
                value={String(values["checkout.minOrder"])}
                onChange={(e) => set("checkout.minOrder", Number(e.target.value))}
              />
            </Field>
            <Field label="Tax rate (%)">
              <TextInput
                type="number"
                step="0.1"
                value={String(values["checkout.taxRate"])}
                onChange={(e) => set("checkout.taxRate", Number(e.target.value))}
              />
            </Field>
            <Field label="Return window (days)">
              <TextInput
                type="number"
                value={String(values["returns.windowDays"])}
                onChange={(e) => set("returns.windowDays", Number(e.target.value))}
              />
            </Field>
            <Field label="Refund approval cap">
              <TextInput
                type="number"
                value={String(values["returns.refundCap"])}
                onChange={(e) => set("returns.refundCap", Number(e.target.value))}
              />
            </Field>
          </FormGrid>
          <div className="divide-y divide-border mt-3">
            <Toggle
              checked={Boolean(values["checkout.cashOnDelivery"])}
              onChange={(value) => set("checkout.cashOnDelivery", value)}
              label="Allow cash on delivery"
              description="Show cash on delivery during checkout."
            />
            <Toggle
              checked={Boolean(values["returns.restockEligible"])}
              onChange={(value) => set("returns.restockEligible", value)}
              label="Allow eligible returns to be restocked"
              description="Operations can return approved non-perishable items to inventory."
            />
          </div>
        </SectionCard>
        <SectionCard title="Notifications & security">
          <div className="divide-y divide-border">
            <Toggle
              checked={Boolean(values["notifications.quietHours"])}
              onChange={(value) => set("notifications.quietHours", value)}
              label="Respect customer quiet hours"
              description="Hold non-critical customer notifications overnight."
            />
            <Toggle
              checked={Boolean(values["security.requireMfa"])}
              onChange={(value) => set("security.requireMfa", value)}
              label="Require MFA for all admins"
              description="New admin sign-ins must enrol a second factor."
            />
          </div>
          <div className="mt-3 max-w-xs">
            <Field label="Admin session duration (hours)">
              <TextInput
                type="number"
                value={String(values["security.sessionHours"])}
                onChange={(e) => set("security.sessionHours", Number(e.target.value))}
              />
            </Field>
          </div>
        </SectionCard>
        <SectionCard title="Feature controls & maintenance">
          <div className="divide-y divide-border">
            <Toggle
              checked={Boolean(values["feature.aiRecommendations"])}
              onChange={(value) => set("feature.aiRecommendations", value)}
              label="AI recommendations"
              description="Show personalized grocery suggestions in the customer app."
            />
            <Toggle
              checked={Boolean(values["feature.scheduledDelivery"])}
              onChange={(value) => set("feature.scheduledDelivery", value)}
              label="Scheduled delivery"
              description="Let customers choose a future delivery slot."
            />
            <Toggle
              checked={Boolean(values["feature.referrals"])}
              onChange={(value) => set("feature.referrals", value)}
              label="Referral program"
              description="Enable referral entry points in the customer app."
            />
            <Toggle
              checked={Boolean(values["maintenance.enabled"])}
              onChange={(value) => set("maintenance.enabled", value)}
              label="Maintenance mode"
              description="Pause customer ordering and show a maintenance message."
            />
          </div>
          {values["maintenance.enabled"] && (
            <div className="mt-3">
              <Field label="Maintenance message">
                <TextInput
                  value={String(values["maintenance.message"])}
                  onChange={(e) => set("maintenance.message", e.target.value)}
                />
              </Field>
            </div>
          )}
          <div className="mt-4 flex items-center gap-2 text-[12px] text-muted-foreground">
            <Wrench className="size-3.5" /> Changes apply after saving.
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
