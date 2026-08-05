import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Check, Plus, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PageHeader,
  PageBody,
  SectionCard,
  StatusBadge,
  ToolbarButton,
} from "@/components/admin/primitives";
import { Field, TextArea, TextInput } from "@/components/admin/form";
import { permissionGroups } from "@/lib/admin-platform-mock";
import { api, type AdminUser, type RoleRecord } from "@/lib/api-client";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/admin/roles")({
  head: () => ({ meta: [{ title: "Roles & Permissions — Freshly Admin" }] }),
  component: RolesPage,
});
function RolesPage() {
  const [roles, setRoles] = useState<RoleRecord[]>([]);
  const [members, setMembers] = useState<AdminUser[]>([]);
  const [active, setActive] = useState("");
  const [matrix, setMatrix] = useState<Record<string, string[]>>({});
  const [dirty, setDirty] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const current = roles.find((role) => role._id === active);
  const locked = current?.name === "Owner";
  const load = async () => {
    try {
      const [roleList, team] = await Promise.all([
        api.roles.list({ limit: 100 }),
        api.team.list({ limit: 200 }),
      ]);
      setRoles(roleList.data);
      setMembers(team.data);
      if (!active && roleList.data[0]) {
        setActive(roleList.data[0]._id);
        setMatrix(roleList.data[0].matrix || {});
      }
    } catch (error) {
      toast.error("Roles could not be loaded", {
        description:
          error instanceof Error ? error.message : "Please check the backend connection.",
      });
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const select = (item: RoleRecord) => {
    setActive(item._id);
    setMatrix(item.matrix || {});
    setDirty(false);
  };
  const toggle = (group: string, action: string) => {
    if (locked) return;
    setDirty(true);
    setMatrix((previous) => {
      const currentActions = previous[group] || [];
      return {
        ...previous,
        [group]: currentActions.includes(action)
          ? currentActions.filter((item) => item !== action)
          : [...currentActions, action],
      };
    });
  };
  const save = async () => {
    if (!current) return;
    setSaving(true);
    try {
      await api.roles.update(current._id, { matrix });
      await load();
      setDirty(false);
      toast.success("Permissions saved");
    } catch (error) {
      toast.error("Could not save permissions", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const { data } = await api.roles.create({
        name: name.trim(),
        description: description.trim(),
        matrix: {},
      });
      await load();
      setActive(data._id);
      setMatrix({});
      setCreating(false);
      setName("");
      setDescription("");
      toast.success("Role created");
    } catch (error) {
      toast.error("Could not create role", {
        description: error instanceof Error ? error.message : "Role names must be unique.",
      });
    } finally {
      setSaving(false);
    }
  };
  const counts = useMemo(
    () =>
      Object.fromEntries(
        roles.map((role) => [
          role.name,
          members.filter((member) => member.role === role.name).length,
        ]),
      ),
    [roles, members],
  );
  return (
    <>
      <PageHeader
        title="Roles & permissions"
        description="Define exactly what each role can see and change. Saving updates the backend permission matrix."
        actions={
          <>
            <ToolbarButton variant="secondary" onClick={() => setCreating(true)}>
              <Plus className="size-3.5" /> New role
            </ToolbarButton>
            <ToolbarButton
              variant="primary"
              disabled={!dirty || saving || locked}
              onClick={() => void save()}
              className={cn((!dirty || locked) && "opacity-50")}
            >
              {saving ? "Saving…" : "Save changes"}
            </ToolbarButton>
          </>
        }
      />
      <PageBody>
        <Dialog open={creating} onOpenChange={setCreating}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create role</DialogTitle>
              <DialogDescription>
                New roles begin with no permissions. Select permissions after creating it.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={create} className="space-y-4">
              <Field label="Role name" required>
                <TextInput
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Merchandising"
                  required
                />
              </Field>
              <Field label="Description">
                <TextArea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="What this role is allowed to do"
                />
              </Field>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" onClick={() => setCreating(false)}>
                  Cancel
                </ToolbarButton>
                <ToolbarButton type="submit" variant="primary" disabled={saving}>
                  {saving ? "Creating…" : "Create role"}
                </ToolbarButton>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <div className="grid lg:grid-cols-[260px_1fr] gap-5 items-start">
          <SectionCard title="Roles" padded={false}>
            <div className="p-2 space-y-1">
              {roles.map((item) => (
                <button
                  key={item._id}
                  onClick={() => select(item)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl transition-colors",
                    active === item._id
                      ? "bg-primary-soft text-accent-foreground"
                      : "hover:bg-secondary",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold">{item.name}</span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">
                      {counts[item.name] || 0}
                    </span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                    {item.description || "No description"}
                  </div>
                </button>
              ))}
              {!roles.length && (
                <div className="p-5 text-sm text-muted-foreground">No roles found.</div>
              )}
            </div>
          </SectionCard>
          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <h2 className="text-sm font-semibold">{current?.name || "Role"} permissions</h2>
                {locked && <StatusBadge tone="muted">locked</StatusBadge>}
                {dirty && <StatusBadge tone="warning">unsaved</StatusBadge>}
              </div>
            }
          >
            <div className="space-y-5">
              {permissionGroups.map((group) => (
                <div key={group.key}>
                  <div className="text-[12px] font-semibold mb-2">{group.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.actions.map((action) => {
                      const on = (matrix[group.key] || []).includes(action);
                      return (
                        <button
                          key={action}
                          onClick={() => toggle(group.key, action)}
                          disabled={locked || !current}
                          className={cn(
                            "h-8 px-3 rounded-lg text-[12px] font-semibold inline-flex items-center gap-1.5 border transition-colors",
                            on
                              ? "bg-primary-soft border-primary/30 text-accent-foreground"
                              : "bg-card border-border text-muted-foreground hover:bg-secondary",
                            (locked || !current) && "opacity-60 cursor-not-allowed",
                          )}
                        >
                          {on && <Check className="size-3" />}
                          {action}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </PageBody>
    </>
  );
}
