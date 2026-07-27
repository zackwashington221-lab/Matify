import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatusBadge, ToolbarButton, Tabs } from "@/components/admin/primitives";
import { Plug, RefreshCw } from "lucide-react";
import { integrations } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/integrations")({
  head: () => ({
    meta: [
      { title: "Integrations — Freshly Admin" },
      { name: "description", content: "Connect payments, logistics, messaging, data and AI providers to the Freshly platform." },
      { property: "og:title", content: "Integrations — Freshly Admin" },
      { property: "og:description", content: "Connect payments, logistics, messaging, data and AI providers to the Freshly platform." },
    ],
  }),
  component: IntegrationsPage,
});

const tone = { connected: "success", available: "muted", error: "danger" } as const;

function IntegrationsPage() {
  const [filter, setFilter] = useState("all");
  const categories = ["all", ...Array.from(new Set(integrations.map((i) => i.category)))];
  const rows = filter === "all" ? integrations : integrations.filter((i) => i.category === filter);

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Third-party services wired into orders, delivery, messaging and AI. Credentials live in the platform vault."
        actions={<ToolbarButton variant="secondary"><RefreshCw className="size-3.5" /> Re-check health</ToolbarButton>}
        tabs={<Tabs items={categories.map((c) => ({ value: c, label: c === "all" ? "All" : c }))} value={filter} onChange={setFilter} />}
      />
      <PageBody>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {rows.map((i) => (
            <SectionCard key={i.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-secondary flex items-center justify-center"><Plug className="size-4 text-muted-foreground" /></div>
                  <div>
                    <div className="font-semibold text-sm">{i.name}</div>
                    <div className="text-[11px] text-muted-foreground">{i.category}</div>
                  </div>
                </div>
                <StatusBadge tone={tone[i.status]}>{i.status}</StatusBadge>
              </div>
              <p className="text-[12px] text-muted-foreground mt-3 leading-relaxed">{i.description}</p>
              {i.detail && <div className="text-[11px] text-muted-foreground mt-2 font-medium">{i.detail}</div>}
              <div className="mt-4 flex gap-2">
                {i.status === "available" ? (
                  <ToolbarButton variant="primary">Connect</ToolbarButton>
                ) : (
                  <>
                    <ToolbarButton variant="secondary">Configure</ToolbarButton>
                    <ToolbarButton variant="ghost">{i.status === "error" ? "Reconnect" : "Disconnect"}</ToolbarButton>
                  </>
                )}
              </div>
            </SectionCard>
          ))}
        </div>
      </PageBody>
    </>
  );
}
