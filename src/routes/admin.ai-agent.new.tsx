import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { Field, FormGrid, SelectInput, TextArea, TextInput, Toggle } from "@/components/admin/form";
import { Play, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/ai-agent/new")({
  head: () => ({
    meta: [
      { title: "New AI Agent — Freshly Admin" },
      { name: "description", content: "Configure an autonomous agent: model, system prompt, tools, guardrails and a live sandbox." },
      { property: "og:title", content: "New AI Agent — Freshly Admin" },
      { property: "og:description", content: "Configure an autonomous agent: model, system prompt, tools, guardrails and a live sandbox." },
    ],
  }),
  component: NewAgent,
});

const toolList = [
  "search_catalog", "check_inventory", "create_reorder", "apply_discount",
  "lookup_order", "issue_refund", "send_notification", "escalate_to_human",
];

function NewAgent() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("You are Freshly's inventory copilot. Keep every SKU above its safety stock while minimising waste of perishable goods.");
  const [tools, setTools] = useState<string[]>(["check_inventory", "create_reorder"]);
  const [autonomy, setAutonomy] = useState("suggest");
  const [enabled, setEnabled] = useState(true);
  const [logging, setLogging] = useState(true);
  const [sandbox, setSandbox] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setError("Agent name is required.");
    navigate({ to: "/admin/ai" });
  };

  return (
    <>
      <PageHeader
        title="New AI agent"
        description="Give the agent a job, the tools to do it, and hard limits on what it may do without a human."
        actions={
          <>
            <ToolbarButton variant="secondary" onClick={() => navigate({ to: "/admin/ai" })}>Cancel</ToolbarButton>
            <ToolbarButton variant="primary" onClick={submit}>Create agent</ToolbarButton>
          </>
        }
      />
      <PageBody>
        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
          <div className="space-y-5">
            <SectionCard title="Identity">
              <div className="space-y-4">
                <FormGrid>
                  <Field label="Agent name" required error={error}>
                    <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Inventory copilot" />
                  </Field>
                  <Field label="Model">
                    <SelectInput options={[
                      { value: "flash", label: "Fast · low cost" },
                      { value: "pro", label: "Balanced" },
                      { value: "reasoning", label: "Deep reasoning" },
                    ]} />
                  </Field>
                </FormGrid>
                <Field label="System prompt" hint="Describe scope, tone and what the agent must never do.">
                  <TextArea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="min-h-36 font-mono text-[12px]" />
                </Field>
              </div>
            </SectionCard>

            <SectionCard title="Tools">
              <div className="flex flex-wrap gap-2">
                {toolList.map((t) => {
                  const on = tools.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTools((v) => on ? v.filter((x) => x !== t) : [...v, t])}
                      className={
                        "h-8 px-3 rounded-lg text-[12px] font-mono border transition-colors " +
                        (on ? "bg-primary-soft border-primary/30 text-accent-foreground" : "bg-card border-border text-muted-foreground hover:bg-secondary")
                      }
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] text-muted-foreground mt-3">{tools.length} tool{tools.length === 1 ? "" : "s"} enabled. Tools map 1:1 to backend API endpoints.</p>
            </SectionCard>

            <SectionCard title="Sandbox" action={<StatusBadge tone="muted">not billed</StatusBadge>}>
              <div className="space-y-3">
                <TextArea value={sandbox} onChange={(e) => setSandbox(e.target.value)} placeholder="Ask the agent something, e.g. 'Which SKUs run out this week?'" className="min-h-20" />
                <ToolbarButton
                  type="button"
                  variant="secondary"
                  onClick={() => setReply(`Checked 1,284 SKUs. 3 fall below safety stock within 5 days: SKU-2214 (avocado), SKU-1188 (whole milk), SKU-3390 (sourdough). Suggested reorder value $2,410. ${autonomy === "auto" ? "Purchase orders drafted and sent." : "Awaiting your approval."}`)}
                >
                  <Play className="size-3.5" /> Run
                </ToolbarButton>
                {reply && (
                  <div className="rounded-xl bg-secondary/60 p-3.5 text-[12px] leading-relaxed flex gap-2.5">
                    <Sparkles className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{reply}</span>
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          <div className="space-y-5">
            <SectionCard title="Autonomy">
              <Field label="Action level" hint="How far the agent may go on its own.">
                <SelectInput
                  value={autonomy}
                  onChange={(e) => setAutonomy(e.target.value)}
                  options={[
                    { value: "observe", label: "Observe only" },
                    { value: "suggest", label: "Suggest, human approves" },
                    { value: "auto", label: "Act autonomously" },
                  ]}
                />
              </Field>
              <div className="divide-y divide-border mt-2">
                <Toggle checked={enabled} onChange={setEnabled} label="Enabled" description="Agent runs on its schedule and triggers." />
                <Toggle checked={logging} onChange={setLogging} label="Full trace logging" description="Store every prompt, tool call and result in the audit log." />
              </div>
            </SectionCard>

            <SectionCard title="Guardrails">
              <FormGrid cols={1}>
                <Field label="Max spend per run"><TextInput type="number" placeholder="5000" /></Field>
                <Field label="Max actions per hour"><TextInput type="number" defaultValue={20} /></Field>
                <Field label="Escalate to">
                  <SelectInput options={[{ value: "ops", label: "Ops Manager" }, { value: "admin", label: "Admin" }, { value: "owner", label: "Owner" }]} />
                </Field>
              </FormGrid>
            </SectionCard>

            <SectionCard title="Trigger">
              <FormGrid cols={1}>
                <Field label="Run">
                  <SelectInput options={[
                    { value: "cron", label: "On a schedule" },
                    { value: "event", label: "On an event" },
                    { value: "manual", label: "Manually only" },
                  ]} />
                </Field>
                <Field label="Schedule" hint="Cron expression"><TextInput defaultValue="0 6 * * *" className="font-mono" /></Field>
              </FormGrid>
            </SectionCard>
          </div>
        </form>
      </PageBody>
    </>
  );
}
