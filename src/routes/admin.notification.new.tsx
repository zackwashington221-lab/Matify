import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { Field, FormGrid, SelectInput, TextArea, TextInput, Toggle } from "@/components/admin/form";
import { Bell, Mail, MessageSquare, Smartphone, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notification/new")({
  head: () => ({
    meta: [
      { title: "New Notification — Freshly Admin" },
      { name: "description", content: "Compose push, email, SMS or in-app messages with audience targeting and send scheduling." },
      { property: "og:title", content: "New Notification — Freshly Admin" },
      { property: "og:description", content: "Compose push, email, SMS or in-app messages with audience targeting and send scheduling." },
    ],
  }),
  component: NewNotification,
});

const channels = [
  { value: "push", label: "Push", icon: Bell },
  { value: "email", label: "Email", icon: Mail },
  { value: "sms", label: "SMS", icon: MessageSquare },
  { value: "in-app", label: "In-app", icon: Smartphone },
] as const;

function NewNotification() {
  const navigate = useNavigate();
  const [channel, setChannel] = useState<string>("push");
  const [title, setTitle] = useState("Your basket misses you 🥑");
  const [body, setBody] = useState("Finish your order in the next hour and delivery is on us.");
  const [quiet, setQuiet] = useState(true);
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return setError("Title and message are both required.");
    navigate({ to: "/admin/notifications" });
  };

  return (
    <>
      <PageHeader
        title="New notification"
        description="One template, four channels. Preview the exact device rendering before you schedule the send."
        actions={
          <>
            <ToolbarButton variant="secondary" onClick={() => navigate({ to: "/admin/notifications" })}>Cancel</ToolbarButton>
            <ToolbarButton variant="secondary">Send test</ToolbarButton>
            <ToolbarButton variant="primary" onClick={submit}>Schedule send</ToolbarButton>
          </>
        }
      />
      <PageBody>
        <form onSubmit={submit} className="grid lg:grid-cols-[1fr_340px] gap-5 items-start">
          <div className="space-y-5">
            <SectionCard title="Channel">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {channels.map((c) => {
                  const Icon = c.icon;
                  const on = channel === c.value;
                  return (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setChannel(c.value)}
                      className={cn(
                        "rounded-2xl border p-4 text-left transition-colors",
                        on ? "border-primary/40 bg-primary-soft" : "border-border hover:bg-secondary"
                      )}
                    >
                      <Icon className={cn("size-4 mb-2", on ? "text-primary" : "text-muted-foreground")} />
                      <div className="text-[13px] font-semibold">{c.label}</div>
                    </button>
                  );
                })}
              </div>
            </SectionCard>

            <SectionCard title="Message">
              <div className="space-y-4">
                <Field label={channel === "email" ? "Subject line" : "Title"} required error={error}>
                  <TextInput value={title} onChange={(e) => setTitle(e.target.value)} maxLength={64} />
                </Field>
                <Field label="Body" hint="Supports {{first_name}}, {{cart_total}}, {{order_id}} merge tags.">
                  <TextArea value={body} onChange={(e) => setBody(e.target.value)} maxLength={280} />
                </Field>
                <ToolbarButton
                  type="button"
                  variant="secondary"
                  onClick={() => setBody("Hi {{first_name}}, your favourites are back in stock and delivery is free until midnight.")}
                >
                  <Sparkles className="size-3.5" /> Rewrite with AI
                </ToolbarButton>
                <FormGrid>
                  <Field label="Deep link"><TextInput placeholder="freshly://cart" /></Field>
                  <Field label="Image URL"><TextInput placeholder="https://…" /></Field>
                </FormGrid>
              </div>
            </SectionCard>

            <SectionCard title="Audience & timing">
              <div className="space-y-4">
                <FormGrid>
                  <Field label="Segment">
                    <SelectInput options={[
                      { value: "abandoned", label: "Abandoned cart (2h)" },
                      { value: "all", label: "All subscribers" },
                      { value: "lapsed", label: "Lapsed 30 days" },
                      { value: "gold", label: "Gold + Platinum" },
                    ]} />
                  </Field>
                  <Field label="Estimated reach"><TextInput readOnly value="18,420 recipients" /></Field>
                  <Field label="Send at"><TextInput type="datetime-local" /></Field>
                  <Field label="Frequency cap">
                    <SelectInput options={[{ value: "1d", label: "Max 1 per day" }, { value: "3d", label: "Max 1 per 3 days" }, { value: "none", label: "No cap" }]} />
                  </Field>
                </FormGrid>
                <div className="divide-y divide-border">
                  <Toggle checked={quiet} onChange={setQuiet} label="Respect quiet hours" description="Hold delivery between 21:00 and 08:00 local time." />
                </div>
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Preview">
            <div className="rounded-3xl bg-secondary/60 p-4">
              <div className="rounded-2xl bg-card border border-border shadow-card p-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="size-5 rounded-md bg-gradient-to-br from-primary to-accent" />
                  <span className="text-[11px] font-semibold text-muted-foreground">FRESHLY · now</span>
                </div>
                <div className="text-[13px] font-semibold leading-snug">{title || "Title"}</div>
                <div className="text-[12px] text-muted-foreground mt-0.5 leading-snug">{body || "Message body"}</div>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-[12px] text-muted-foreground">
              <div className="flex justify-between"><span>Channel</span><StatusBadge tone="info">{channel}</StatusBadge></div>
              <div className="flex justify-between"><span>Characters</span><span className="tabular-nums">{body.length}/280</span></div>
              <div className="flex justify-between"><span>Predicted open rate</span><span className="font-semibold text-foreground">46%</span></div>
            </div>
          </SectionCard>
        </form>
      </PageBody>
    </>
  );
}
