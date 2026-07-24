import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, StatCard, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Bot, Cpu, Play, Plus, Sparkles, Zap } from "lucide-react";
import { aiAgents, type AiAgent } from "@/lib/admin-mock";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { revenueSeries } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/ai")({
  head: () => ({
    meta: [
      { title: "AI Config — Freshly Admin" },
      { name: "description", content: "AI control center: agents, prompt library, models, usage, cost and execution logs." },
    ],
  }),
  component: AIConfig,
});

const statusTone = { on: "success", off: "muted", learning: "info" } as const;

function AIConfig() {
  const columns: Column<AiAgent>[] = [
    {
      key: "name", header: "Agent", sortable: true, sortAccessor: (a) => a.name,
      render: (a) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-primary-soft flex items-center justify-center"><Bot className="size-4 text-accent-foreground" /></div>
          <div>
            <div className="font-medium">{a.name}</div>
            <div className="text-[11px] text-muted-foreground">{a.role}</div>
          </div>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (a) => <StatusBadge tone={statusTone[a.status]}>{a.status}</StatusBadge> },
    { key: "model", header: "Model", render: (a) => <code className="text-[11px] bg-secondary rounded px-1.5 py-0.5">{a.model}</code> },
    { key: "tokens", header: "Tokens · 7d", sortable: true, sortAccessor: (a) => a.tokens, align: "right", render: (a) => <span className="tabular-nums">{a.tokens.toLocaleString()}</span> },
    { key: "cost", header: "Cost", sortable: true, sortAccessor: (a) => a.cost, align: "right", render: (a) => <span className="tabular-nums font-semibold">${a.cost.toFixed(2)}</span> },
    { key: "successRate", header: "Success", align: "right", render: (a) => <span className="tabular-nums">{a.successRate}</span> },
    {
      key: "actions", header: "", align: "right",
      render: (a) => (
        <button className="text-[12px] font-semibold text-primary inline-flex items-center gap-1">
          <Play className="size-3" /> {a.status === "on" ? "Configure" : "Enable"}
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="AI Control Center"
        description="Manage agents, prompts, models, guardrails and usage across the platform."
        actions={
          <>
            <ToolbarButton variant="secondary"><Sparkles className="size-3.5" /> Prompt sandbox</ToolbarButton>
            <ToolbarButton variant="primary"><Plus className="size-3.5" /> New agent</ToolbarButton>
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active agents" value="5" icon={<Bot className="size-4" />} />
          <StatCard label="Tokens · 7d" value="928k" delta="+22%" deltaDir="up" icon={<Cpu className="size-4" />} />
          <StatCard label="Cost · 7d" value="$21.98" delta="+$3.20" deltaDir="down" icon={<Zap className="size-4" />} />
          <StatCard label="Avg success" value="91%" delta="+2pp" deltaDir="up" />
        </div>

        <SectionCard title="Token usage · 30 days">
          <div className="h-56">
            <ResponsiveContainer>
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="tok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} fill="url(#tok)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <DataTable<AiAgent>
          data={aiAgents}
          columns={columns}
          rowKey={(a) => a.id}
          searchAccessor={(a) => `${a.name} ${a.role}`}
          searchPlaceholder="Search agents…"
          exportFilename="ai-agents.csv"
        />
      </PageBody>
    </>
  );
}
