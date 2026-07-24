import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, StatCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Bell, Mail, MessageSquare, Plus, Smartphone, Sparkles } from "lucide-react";
import { notificationTemplates, type NotificationTemplate } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Freshly Admin" },
      { name: "description", content: "Push, email, SMS and in-app templates with audience targeting and analytics." },
    ],
  }),
  component: NotificationsAdmin,
});

const channelIcon = { push: Bell, email: Mail, sms: MessageSquare, "in-app": Smartphone } as const;
const statusTone = { active: "success", paused: "warning", draft: "muted" } as const;

function NotificationsAdmin() {
  const columns: Column<NotificationTemplate>[] = [
    {
      key: "name", header: "Template", sortable: true, sortAccessor: (n) => n.name,
      render: (n) => {
        const Icon = channelIcon[n.channel];
        return (
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-secondary flex items-center justify-center"><Icon className="size-4 text-muted-foreground" /></div>
            <div>
              <div className="font-medium">{n.name}</div>
              <div className="text-[11px] text-muted-foreground capitalize">{n.channel}</div>
            </div>
          </div>
        );
      },
    },
    { key: "audience", header: "Audience", render: (n) => <span className="text-muted-foreground">{n.audience}</span> },
    { key: "status", header: "Status", render: (n) => <StatusBadge tone={statusTone[n.status]}>{n.status}</StatusBadge> },
    { key: "sent", header: "Sent", sortable: true, sortAccessor: (n) => n.sent, align: "right", render: (n) => <span className="tabular-nums">{n.sent.toLocaleString()}</span> },
    { key: "openRate", header: "Open rate", align: "right", render: (n) => <span className="tabular-nums">{n.openRate}</span> },
    { key: "ctr", header: "CTR", align: "right", render: (n) => <span className="tabular-nums">{n.ctr}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Push, email, SMS and in-app templates with AI-generated copy and audience targeting."
        actions={
          <>
            <ToolbarButton variant="secondary"><Sparkles className="size-3.5" /> AI compose</ToolbarButton>
            <ToolbarButton variant="primary"><Plus className="size-3.5" /> New template</ToolbarButton>
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Delivered · 7d" value="124,820" delta="+8%" deltaDir="up" />
          <StatCard label="Avg open rate" value="48%" delta="+3pp" deltaDir="up" />
          <StatCard label="Avg CTR" value="14%" delta="+1pp" deltaDir="up" />
          <StatCard label="Active templates" value="18" hint="3 paused" />
        </div>

        <DataTable<NotificationTemplate>
          data={notificationTemplates}
          columns={columns}
          rowKey={(n) => n.id}
          searchAccessor={(n) => `${n.name} ${n.audience} ${n.channel}`}
          searchPlaceholder="Search templates…"
          exportFilename="notification-templates.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary">Pause ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary">Duplicate</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
