import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Field, FormGrid, SelectInput, TextInput } from "@/components/admin/form";
import { Copy, KeyRound, Plus } from "lucide-react";
import { apiKeys, type ApiKey } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/api-keys")({
  head: () => ({
    meta: [
      { title: "API Keys — Freshly Admin" },
      { name: "description", content: "Issue, scope and revoke API keys used by the Expo apps, warehouse tools and data jobs." },
      { property: "og:title", content: "API Keys — Freshly Admin" },
      { property: "og:description", content: "Issue, scope and revoke API keys used by the Expo apps, warehouse tools and data jobs." },
    ],
  }),
  component: ApiKeysPage,
});

const scopeTone = { read: "info", write: "warning", admin: "danger" } as const;

function ApiKeysPage() {
  const [creating, setCreating] = useState(false);
  const [issued, setIssued] = useState<string | null>(null);

  const columns: Column<ApiKey>[] = [
    {
      key: "label", header: "Key", sortable: true, sortAccessor: (k) => k.label,
      render: (k) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-secondary flex items-center justify-center"><KeyRound className="size-4 text-muted-foreground" /></div>
          <div>
            <div className="font-medium">{k.label}</div>
            <code className="text-[11px] text-muted-foreground">{k.prefix}••••••••</code>
          </div>
        </div>
      ),
    },
    { key: "environment", header: "Environment", render: (k) => <StatusBadge tone={k.environment === "production" ? "success" : "muted"}>{k.environment}</StatusBadge> },
    { key: "scope", header: "Scope", render: (k) => <StatusBadge tone={scopeTone[k.scope]}>{k.scope}</StatusBadge> },
    { key: "lastUsed", header: "Last used", sortable: true, sortAccessor: (k) => k.lastUsed, render: (k) => <span className="text-muted-foreground">{new Date(k.lastUsed).toLocaleDateString()}</span> },
    { key: "status", header: "Status", align: "right", render: (k) => <StatusBadge tone={k.status === "active" ? "success" : "muted"}>{k.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeader
        title="API keys"
        description="Credentials your React Native apps and backend jobs use to call the Freshly API. Keys are shown once at creation."
        actions={<ToolbarButton variant="primary" onClick={() => setCreating((v) => !v)}><Plus className="size-3.5" /> Create key</ToolbarButton>}
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active keys" value={String(apiKeys.filter((k) => k.status === "active").length)} />
          <StatCard label="Requests · 24h" value="1.42M" delta="+11%" deltaDir="up" />
          <StatCard label="Error rate" value="0.21%" delta="-0.05pp" deltaDir="down" />
          <StatCard label="Revoked" value={String(apiKeys.filter((k) => k.status === "revoked").length)} />
        </div>

        {creating && (
          <SectionCard title="Create API key">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const rand = Math.random().toString(36).slice(2, 10);
                setIssued(`sk_live_${rand}${Math.random().toString(36).slice(2, 18)}`);
                setCreating(false);
              }}
            >
              <FormGrid cols={3}>
                <Field label="Label" required><TextInput placeholder="Expo mobile app" required /></Field>
                <Field label="Environment"><SelectInput options={[{ value: "production", label: "Production" }, { value: "staging", label: "Staging" }]} /></Field>
                <Field label="Scope" hint="Least privilege recommended.">
                  <SelectInput options={[{ value: "read", label: "Read" }, { value: "write", label: "Read + write" }, { value: "admin", label: "Admin" }]} />
                </Field>
              </FormGrid>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" onClick={() => setCreating(false)}>Cancel</ToolbarButton>
                <ToolbarButton type="submit" variant="primary">Generate key</ToolbarButton>
              </div>
            </form>
          </SectionCard>
        )}

        {issued && (
          <SectionCard title="Copy your key now — it won't be shown again">
            <div className="flex items-center gap-3 flex-wrap">
              <code className="flex-1 min-w-64 text-[13px] bg-secondary rounded-xl px-3 py-2.5 break-all">{issued}</code>
              <ToolbarButton variant="secondary" onClick={() => navigator.clipboard?.writeText(issued)}><Copy className="size-3.5" /> Copy</ToolbarButton>
              <ToolbarButton variant="ghost" onClick={() => setIssued(null)}>Dismiss</ToolbarButton>
            </div>
          </SectionCard>
        )}

        <DataTable<ApiKey>
          data={apiKeys}
          columns={columns}
          rowKey={(k) => k.id}
          searchAccessor={(k) => `${k.label} ${k.environment} ${k.scope}`}
          searchPlaceholder="Search keys…"
          exportFilename="api-keys.csv"
          bulkActions={(sel) => <ToolbarButton variant="secondary">Revoke ({sel.length})</ToolbarButton>}
        />
      </PageBody>
    </>
  );
}
