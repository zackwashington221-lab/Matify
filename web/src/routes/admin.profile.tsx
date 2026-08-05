import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Save, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ApiError, api, getCachedAdminUser } from "@/lib/api-client";
import { PageBody, PageHeader, SectionCard, ToolbarButton } from "@/components/admin/primitives";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/profile")({ component: AdminProfile });

function AdminProfile() {
  const navigate = useNavigate();
  const user = getCachedAdminUser();
  const canCreateAdmins = user?.role === "Owner" || user?.role === "Admin";
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [createAdminOpen, setCreateAdminOpen] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [creatingAdmin, setCreatingAdmin] = useState(false);

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

  async function createAdmin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      toast.error("Email and password are required");
      return;
    }
    if (adminPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setCreatingAdmin(true);
    try {
      await api.team.createAdmin(adminEmail.trim(), adminPassword);
      toast.success("Admin account created", { description: `${adminEmail.trim()} can now sign in.` });
      setAdminEmail("");
      setAdminPassword("");
      setCreateAdminOpen(false);
    } catch (error) {
      toast.error("Could not create admin", { description: error instanceof ApiError ? error.message : "Please try again." });
    } finally {
      setCreatingAdmin(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Your profile"
        description="Manage the account currently signed in to the Martify admin console."
        actions={canCreateAdmins ? <ToolbarButton variant="primary" onClick={() => setCreateAdminOpen(true)}><UserPlus className="size-3.5" />Create admin</ToolbarButton> : undefined}
      />
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
      <Dialog open={createAdminOpen} onOpenChange={setCreateAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create admin account</DialogTitle>
            <DialogDescription>The new administrator can sign in immediately with the email and password you provide.</DialogDescription>
          </DialogHeader>
          <form onSubmit={createAdmin} className="space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Email address</span>
              <input type="email" value={adminEmail} onChange={(event) => setAdminEmail(event.target.value)} autoComplete="email" required className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Temporary password</span>
              <input type="password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} autoComplete="new-password" minLength={8} required className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </label>
            <DialogFooter>
              <ToolbarButton type="button" variant="secondary" onClick={() => setCreateAdminOpen(false)} disabled={creatingAdmin}>Cancel</ToolbarButton>
              <ToolbarButton type="submit" variant="primary" disabled={creatingAdmin}>{creatingAdmin ? "Creating…" : "Create admin"}</ToolbarButton>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
