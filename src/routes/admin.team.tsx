import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, StatCard, StatusBadge, ToolbarButton, SectionCard } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Field, FormGrid, SelectInput, TextInput } from "@/components/admin/form";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { teamMembers, roles, type TeamMember } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/team")({
  head: () => ({
    meta: [
      { title: "Team & Access — Freshly Admin" },
      { name: "description", content: "Invite admin users, assign roles, enforce MFA and manage account status." },
      { property: "og:title", content: "Team & Access — Freshly Admin" },
      { property: "og:description", content: "Invite admin users, assign roles, enforce MFA and manage account status." },
    ],
  }),
  component: TeamPage,
});

const statusTone = { active: "success", invited: "info", suspended: "danger" } as const;

function TeamPage() {
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Support");
  const [invited, setInvited] = useState<string[]>([]);

  const columns: Column<TeamMember>[] = [
    {
      key: "name", header: "Member", sortable: true, sortAccessor: (m) => m.name,
      render: (m) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-[11px] font-semibold flex items-center justify-center">
            {m.name.split(" ").map((p) => p[0]).join("")}
          </div>
          <div>
            <div className="font-medium">{m.name}</div>
            <div className="text-[11px] text-muted-foreground">{m.email}</div>
          </div>
        </div>
      ),
    },
    { key: "role", header: "Role", sortable: true, sortAccessor: (m) => m.role, render: (m) => <span className="text-muted-foreground">{m.role}</span> },
    { key: "status", header: "Status", render: (m) => <StatusBadge tone={statusTone[m.status]}>{m.status}</StatusBadge> },
    { key: "mfa", header: "MFA", render: (m) => <StatusBadge tone={m.mfa ? "success" : "warning"}>{m.mfa ? "enabled" : "off"}</StatusBadge> },
    {
      key: "lastActive", header: "Last active", align: "right", sortable: true, sortAccessor: (m) => m.lastActive,
      render: (m) => <span className="text-muted-foreground tabular-nums">{new Date(m.lastActive).toLocaleDateString()}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Team & access"
        description="Who can sign in to the console, what they can do, and how their access is protected."
        actions={<ToolbarButton variant="primary" onClick={() => setInviting((v) => !v)}><UserPlus className="size-3.5" /> Invite member</ToolbarButton>}
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Members" value={String(teamMembers.length + invited.length)} icon={<Users className="size-4" />} />
          <StatCard label="MFA coverage" value={`${Math.round((teamMembers.filter((m) => m.mfa).length / teamMembers.length) * 100)}%`} delta="+14pp" deltaDir="up" />
          <StatCard label="Pending invites" value={String(teamMembers.filter((m) => m.status === "invited").length + invited.length)} />
          <StatCard label="Roles defined" value={String(roles.length)} icon={<ShieldCheck className="size-4" />} />
        </div>

        {inviting && (
          <SectionCard title="Invite a new member">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!email) return;
                setInvited((v) => [...v, email]);
                setEmail("");
                setInviting(false);
              }}
              className="space-y-4"
            >
              <FormGrid>
                <Field label="Work email" required hint="They receive a signed invite link valid for 72 hours.">
                  <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@freshly.io" required />
                </Field>
                <Field label="Role">
                  <SelectInput value={role} onChange={(e) => setRole(e.target.value)} options={roles.map((r) => ({ value: r.name, label: r.name }))} />
                </Field>
              </FormGrid>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" onClick={() => setInviting(false)}>Cancel</ToolbarButton>
                <ToolbarButton type="submit" variant="primary">Send invite</ToolbarButton>
              </div>
            </form>
          </SectionCard>
        )}

        {invited.length > 0 && (
          <SectionCard title="Just invited">
            <ul className="text-[13px] text-muted-foreground space-y-1">
              {invited.map((e) => <li key={e}>{e} · invite sent as {role}</li>)}
            </ul>
          </SectionCard>
        )}

        <DataTable<TeamMember>
          data={teamMembers}
          columns={columns}
          rowKey={(m) => m.id}
          searchAccessor={(m) => `${m.name} ${m.email} ${m.role}`}
          searchPlaceholder="Search members…"
          exportFilename="team-members.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary">Change role ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary">Require MFA</ToolbarButton>
              <ToolbarButton variant="secondary">Suspend</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
