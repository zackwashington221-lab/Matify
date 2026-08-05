import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError, api, getCachedAdminUser } from "@/lib/api-client";
import { PageBody, PageHeader, SectionCard, ToolbarButton } from "@/components/admin/primitives";

export const Route = createFileRoute("/admin/profile")({ component: AdminProfile });

function AdminProfile() {
  const navigate = useNavigate();
  const user = getCachedAdminUser();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      await api.auth.updateProfile({ name: name.trim() });
      toast.success("Profile updated");
    } catch (error) {
      toast.error("Could not update profile", { description: error instanceof ApiError ? error.message : "Please try again." });
    } finally {
      setSaving(false);
    }
  }

  function signOut() {
    api.auth.logout();
    navigate({ to: "/admin-login" });
  }

  return (
    <>
      <PageHeader title="Your profile" description="Manage the account currently signed in to the Freshly admin console." />
      <PageBody className="max-w-3xl">
        <SectionCard title="Account details">
          <div className="flex items-center gap-4 border-b border-border pb-5">
            <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent text-lg font-bold text-primary-foreground">
              {name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A"}
            </div>
            <div>
              <div className="font-semibold">{user?.email || "Admin account"}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="size-3.5 text-primary" /> {user?.role || "Administrator"}</div>
            </div>
          </div>
          <label className="mt-5 block">
            <span className="mb-1.5 block text-sm font-medium">Display name</span>
            <input value={name} onChange={(event) => setName(event.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
          </label>
          <div className="mt-5 flex flex-wrap gap-2">
            <ToolbarButton variant="primary" onClick={save} disabled={saving}><Save className="size-3.5" />{saving ? "Saving…" : "Save changes"}</ToolbarButton>
            <ToolbarButton variant="secondary" onClick={signOut}><LogOut className="size-3.5" />Sign out</ToolbarButton>
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
