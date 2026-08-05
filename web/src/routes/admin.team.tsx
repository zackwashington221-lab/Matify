import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  PageHeader,
  PageBody,
  StatCard,
  StatusBadge,
  ToolbarButton,
  SectionCard,
} from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Field, FormGrid, SelectInput, TextInput } from "@/components/admin/form";
import { ShieldCheck, UserPlus, Users } from "lucide-react";
import { api, type AdminUser, type RoleRecord } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
export const Route = createFileRoute("/admin/team")({
  head: () => ({ meta: [{ title: "Team & Access — Martify Admin" }] }),
  component: TeamPage,
});
const tone: Record<string, "success" | "info" | "danger"> = {
  active: "success",
  invited: "info",
  suspended: "danger",
};
function TeamPage() {
  const [inviting, setInviting] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Support");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [saving, setSaving] = useState(false);
  const [roleDialog, setRoleDialog] = useState<AdminUser[] | null>(null);
  const [selectedRole, setSelectedRole] = useState("Support");
  const load = async () => {
    try {
      const [members, roleList] = await Promise.all([
        api.team.list({ limit: 200 }),
        api.roles.list({ limit: 100 }),
      ]);
      setUsers(members.data.filter((member) => member.role !== "Customer"));
      setRoles(roleList.data);
    } catch (error) {
      toast.error("Team could not be loaded", {
        description:
          error instanceof Error ? error.message : "Please check the backend connection.",
      });
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const invite = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const result = await api.team.invite(email, role);
      setEmail("");
      setInviting(false);
      await load();
      toast.success("Member invited", {
        description: "Their access is pending until they complete the invite flow.",
      });
    } catch {
      toast.error("Could not invite member", {
        description: "We couldn't send the invitation. Please verify the email address and try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  const update = async (selected: AdminUser[], payload: Partial<AdminUser>) => {
    setSaving(true);
    try {
      await Promise.all(
        selected.map((member) => api.team.update(member._id || member.id!, payload)),
      );
      await load();
      toast.success("Team access updated");
    } catch (error) {
      toast.error("Could not update team access", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  const stats = useMemo(
    () => ({
      active: users.filter((user) => user.status === "active").length,
      invited: users.filter((user) => user.status === "invited").length,
      mfa: users.length
        ? Math.round((users.filter((user) => user.mfaEnabled).length / users.length) * 100)
        : 0,
    }),
    [users],
  );
  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Member",
      sortable: true,
      sortAccessor: (member) => member.name,
      exportValue: (member) => `${member.name} <${member.email}>`,
      render: (member) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground text-[11px] font-semibold grid place-items-center">
            {member.name
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <div className="font-medium">{member.name}</div>
            <div className="text-[11px] text-muted-foreground">{member.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      sortable: true,
      sortAccessor: (member) => member.role,
      render: (member) => <span className="text-muted-foreground">{member.role}</span>,
    },
    {
      key: "status",
      header: "Status",
      exportValue: (member) => member.status || "active",
      render: (member) => (
        <StatusBadge tone={tone[member.status || "active"] || "info"}>
          {member.status || "active"}
        </StatusBadge>
      ),
    },
    {
      key: "mfa",
      header: "MFA",
      exportValue: (member) => (member.mfaEnabled ? "enabled" : "off"),
      render: (member) => (
        <StatusBadge tone={member.mfaEnabled ? "success" : "warning"}>
          {member.mfaEnabled ? "enabled" : "off"}
        </StatusBadge>
      ),
    },
    {
      key: "lastActive",
      header: "Last active",
      align: "right",
      exportValue: (member) => member.lastActiveAt || "",
      render: (member) => (
        <span className="text-muted-foreground">
          {member.lastActiveAt ? new Date(member.lastActiveAt).toLocaleDateString() : "—"}
        </span>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        title="Team & access"
        description="Invite console members, assign roles, enforce MFA, and suspend access when needed."
        actions={
          <ToolbarButton variant="primary" onClick={() => setInviting((value) => !value)}>
            <UserPlus className="size-3.5" /> Invite member
          </ToolbarButton>
        }
      />
      <PageBody>
        <Dialog open={Boolean(roleDialog)} onOpenChange={(open) => !open && setRoleDialog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Change member role</DialogTitle>
              <DialogDescription>
                Choose the access role for {roleDialog?.length || 0} selected member
                {roleDialog?.length === 1 ? "" : "s"}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Field label="Role">
                <SelectInput
                  value={selectedRole}
                  onChange={(event) => setSelectedRole(event.target.value)}
                  options={(roles.length ? roles : [{ name: "Support" } as RoleRecord]).map(
                    (item) => ({ value: item.name, label: item.name }),
                  )}
                />
              </Field>
              <div className="flex justify-end gap-2">
                <ToolbarButton variant="secondary" onClick={() => setRoleDialog(null)}>
                  Cancel
                </ToolbarButton>
                <ToolbarButton
                  variant="primary"
                  disabled={saving}
                  onClick={() => {
                    if (roleDialog) {
                      void update(roleDialog, { role: selectedRole });
                      setRoleDialog(null);
                    }
                  }}
                >
                  {saving ? "Updating…" : "Apply role"}
                </ToolbarButton>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Active members"
            value={String(stats.active)}
            icon={<Users className="size-4" />}
          />
          <StatCard label="MFA coverage" value={`${stats.mfa}%`} />
          <StatCard label="Pending invites" value={String(stats.invited)} />
          <StatCard
            label="Roles defined"
            value={String(roles.length)}
            icon={<ShieldCheck className="size-4" />}
          />
        </div>
        {inviting && (
          <SectionCard title="Invite a new member">
            <form onSubmit={invite} className="space-y-4">
              <FormGrid>
                <Field label="Work email" required>
                  <TextInput
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@martify.io"
                    required
                  />
                </Field>
                <Field label="Role">
                  <SelectInput
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    options={(roles.length ? roles : [{ name: "Support" } as RoleRecord]).map(
                      (item) => ({ value: item.name, label: item.name }),
                    )}
                  />
                </Field>
              </FormGrid>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" onClick={() => setInviting(false)}>
                  Cancel
                </ToolbarButton>
                <ToolbarButton type="submit" variant="primary" disabled={saving}>
                  {saving ? "Sending…" : "Send invite"}
                </ToolbarButton>
              </div>
            </form>
          </SectionCard>
        )}
        <DataTable
          data={users}
          columns={columns}
          rowKey={(member) => member._id || member.id || member.email}
          searchAccessor={(member) => `${member.name} ${member.email} ${member.role}`}
          searchPlaceholder="Search members…"
          exportFilename="team-members.csv"
          emptyTitle="No team members"
          emptyDescription="Invite the first member to the console."
          bulkActions={(selected) => (
            <>
              <ToolbarButton
                variant="secondary"
                onClick={() => {
                  setSelectedRole(selected[0]?.role || role);
                  setRoleDialog(selected);
                }}
              >
                Change role ({selected.length})
              </ToolbarButton>
              <ToolbarButton
                variant="secondary"
                onClick={() => void update(selected, { mfaEnabled: true })}
              >
                Require MFA
              </ToolbarButton>
              <ToolbarButton
                variant="secondary"
                onClick={() => void update(selected, { status: "suspended" })}
              >
                Suspend
              </ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
