import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, StatCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { ScrollText, ShieldAlert } from "lucide-react";
import { auditLog, type AuditEntry } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({
    meta: [
      { title: "Audit Log — Freshly Admin" },
      { name: "description", content: "Immutable trail of every privileged action across the Freshly admin console." },
      { property: "og:title", content: "Audit Log — Freshly Admin" },
      { property: "og:description", content: "Immutable trail of every privileged action across the Freshly admin console." },
    ],
  }),
  component: AuditPage,
});

const tone = { info: "muted", warning: "warning", critical: "danger" } as const;

function AuditPage() {
  const columns: Column<AuditEntry>[] = [
    {
      key: "at", header: "When", sortable: true, sortAccessor: (a) => a.at,
      render: (a) => (
        <div>
          <div className="font-medium tabular-nums">{new Date(a.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
          <div className="text-[11px] text-muted-foreground">{new Date(a.at).toLocaleDateString()}</div>
        </div>
      ),
    },
    { key: "actor", header: "Actor", sortable: true, sortAccessor: (a) => a.actor, render: (a) => <span className="font-medium">{a.actor}</span> },
    { key: "action", header: "Action", render: (a) => <code className="text-[12px] bg-secondary rounded px-1.5 py-0.5">{a.action}</code> },
    { key: "target", header: "Target", render: (a) => <span className="text-muted-foreground">{a.target}</span> },
    { key: "severity", header: "Severity", render: (a) => <StatusBadge tone={tone[a.severity]}>{a.severity}</StatusBadge> },
    { key: "ip", header: "IP", align: "right", render: (a) => <span className="text-muted-foreground tabular-nums">{a.ip}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Audit log"
        description="Every privileged action is recorded with actor, target, severity and source IP. Entries are append-only."
        actions={<ToolbarButton variant="secondary"><ScrollText className="size-3.5" /> Retention: 400 days</ToolbarButton>}
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Events · 7d" value="1,284" delta="+6%" deltaDir="up" />
          <StatCard label="Critical" value={String(auditLog.filter((a) => a.severity === "critical").length)} icon={<ShieldAlert className="size-4" />} />
          <StatCard label="Failed logins" value="5" delta="-40%" deltaDir="down" />
          <StatCard label="Unique actors" value={String(new Set(auditLog.map((a) => a.actor)).size)} />
        </div>

        <DataTable<AuditEntry>
          data={auditLog}
          columns={columns}
          rowKey={(a) => a.id}
          searchAccessor={(a) => `${a.actor} ${a.action} ${a.target} ${a.severity}`}
          searchPlaceholder="Search actor, action or target…"
          exportFilename="audit-log.csv"
        />
      </PageBody>
    </>
  );
}
