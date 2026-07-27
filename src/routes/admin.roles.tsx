import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { Check, Plus, ShieldCheck } from "lucide-react";
import { permissionGroups, roles } from "@/lib/admin-platform-mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/roles")({
  head: () => ({
    meta: [
      { title: "Roles & Permissions — Freshly Admin" },
      { name: "description", content: "Granular permission matrix for every admin role across orders, catalog, inventory and platform." },
      { property: "og:title", content: "Roles & Permissions — Freshly Admin" },
      { property: "og:description", content: "Granular permission matrix for every admin role across orders, catalog, inventory and platform." },
    ],
  }),
  component: RolesPage,
});

function RolesPage() {
  const [active, setActive] = useState(roles[1].name);
  const [matrix, setMatrix] = useState<Record<string, Record<string, string[]>>>(
    () => Object.fromEntries(roles.map((r) => [r.name, r.matrix]))
  );
  const [dirty, setDirty] = useState(false);

  const current = matrix[active];
  const locked = active === "Owner";

  const toggle = (group: string, action: string) => {
    if (locked) return;
    setDirty(true);
    setMatrix((prev) => {
      const have = prev[active][group] ?? [];
      const next = have.includes(action) ? have.filter((a) => a !== action) : [...have, action];
      return { ...prev, [active]: { ...prev[active], [group]: next } };
    });
  };

  return (
    <>
      <PageHeader
        title="Roles & permissions"
        description="Define exactly what each role can see and change. Changes apply to every member holding the role."
        actions={
          <>
            <ToolbarButton variant="secondary"><Plus className="size-3.5" /> New role</ToolbarButton>
            <ToolbarButton variant="primary" disabled={!dirty} onClick={() => setDirty(false)} className={cn(!dirty && "opacity-50")}>
              Save changes
            </ToolbarButton>
          </>
        }
      />
      <PageBody>
        <div className="grid lg:grid-cols-[260px_1fr] gap-5 items-start">
          <SectionCard title="Roles" padded={false}>
            <div className="p-2 space-y-1">
              {roles.map((r) => (
                <button
                  key={r.name}
                  onClick={() => setActive(r.name)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 rounded-xl transition-colors",
                    active === r.name ? "bg-primary-soft text-accent-foreground" : "hover:bg-secondary"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold">{r.name}</span>
                    <span className="text-[10px] tabular-nums text-muted-foreground">{r.members}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{r.description}</div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title={
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" />
                <h2 className="text-sm font-semibold">{active} permissions</h2>
                {locked && <StatusBadge tone="muted">locked</StatusBadge>}
                {dirty && <StatusBadge tone="warning">unsaved</StatusBadge>}
              </div>
            }
          >
            <div className="space-y-5">
              {permissionGroups.map((g) => (
                <div key={g.key}>
                  <div className="text-[12px] font-semibold mb-2">{g.label}</div>
                  <div className="flex flex-wrap gap-2">
                    {g.actions.map((a) => {
                      const on = (current[g.key] ?? []).includes(a);
                      return (
                        <button
                          key={a}
                          onClick={() => toggle(g.key, a)}
                          disabled={locked}
                          className={cn(
                            "h-8 px-3 rounded-lg text-[12px] font-semibold inline-flex items-center gap-1.5 border transition-colors",
                            on ? "bg-primary-soft border-primary/30 text-accent-foreground" : "bg-card border-border text-muted-foreground hover:bg-secondary",
                            locked && "opacity-60 cursor-not-allowed"
                          )}
                        >
                          {on && <Check className="size-3" />} {a}
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
