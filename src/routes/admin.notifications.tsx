import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, PageBody, StatCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Bell, Mail, MessageSquare, Plus, Smartphone } from "lucide-react";
import { api, type NotificationRecord } from "@/lib/api-client";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Freshly Admin" }, { name: "description", content: "Create, target and deliver customer notifications." }] }),
  component: NotificationsAdmin,
});

const channelIcon = { push: Bell, email: Mail, sms: MessageSquare, inapp: Smartphone } as const;
const statusTone: Record<string, "success" | "warning" | "muted" | "info"> = { sent: "success", scheduled: "info", draft: "muted", failed: "warning" };

function NotificationsAdmin() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setRecords((await api.notifications.list({ limit: 200 })).data); }
    catch (error) { toast.error("Notifications could not be loaded", { description: error instanceof Error ? error.message : "Please check the backend connection." }); }
    finally { setLoading(false); }
  };
  useEffect(() => { void load(); }, []);

  const updateSelected = async (selected: NotificationRecord[], status: "draft" | "sent") => {
    if (!selected.length) return;
    try {
      await Promise.all(selected.map((record) => api.notifications.update(record._id, { status })));
      await load();
      toast.success(status === "draft" ? `${selected.length} notification${selected.length === 1 ? "" : "s"} paused` : "Notifications sent");
    } catch (error) { toast.error("Notification update failed", { description: error instanceof Error ? error.message : "Please try again." }); }
  };
  const duplicate = async (selected: NotificationRecord[]) => {
    if (!selected.length) return;
    try {
      await Promise.all(selected.map(({ title, body, channel, category, audience }) => api.notifications.create({ title: `${title} (copy)`, body, channel, category, audience, status: "draft" })));
      await load(); toast.success(`${selected.length} draft${selected.length === 1 ? "" : "s"} created`);
    } catch (error) { toast.error("Could not duplicate notifications", { description: error instanceof Error ? error.message : "Please try again." }); }
  };

  const stats = useMemo(() => {
    const sent = records.filter((record) => record.status === "sent");
    const delivered = sent.reduce((sum, record) => sum + (record.stats?.delivered || 0), 0);
    const opened = sent.reduce((sum, record) => sum + (record.stats?.opened || 0), 0);
    const clicked = sent.reduce((sum, record) => sum + (record.stats?.clicked || 0), 0);
    return { delivered, openRate: delivered ? `${Math.round((opened / delivered) * 100)}%` : "—", ctr: delivered ? `${Math.round((clicked / delivered) * 100)}%` : "—", active: records.filter((record) => record.status === "scheduled").length };
  }, [records]);

  const columns: Column<NotificationRecord>[] = [
    { key: "title", header: "Campaign", sortable: true, sortAccessor: (n) => n.title, render: (n) => { const Icon = channelIcon[n.channel as keyof typeof channelIcon] || Bell; return <div className="flex items-center gap-3"><div className="size-9 rounded-xl bg-secondary flex items-center justify-center"><Icon className="size-4 text-muted-foreground" /></div><div><div className="font-medium">{n.title}</div><div className="text-[11px] text-muted-foreground capitalize">{n.channel === "inapp" ? "In-app" : n.channel} · {n.audience || "all"}</div></div></div>; } },
    { key: "status", header: "Status", render: (n) => <StatusBadge tone={statusTone[n.status] || "muted"}>{n.status}</StatusBadge> },
    { key: "sent", header: "Delivered", sortable: true, sortAccessor: (n) => n.stats?.delivered || 0, align: "right", render: (n) => <span className="tabular-nums">{(n.stats?.delivered || 0).toLocaleString()}</span> },
    { key: "openRate", header: "Open rate", align: "right", render: (n) => { const d = n.stats?.delivered || 0; return <span className="tabular-nums">{d ? `${Math.round(((n.stats?.opened || 0) / d) * 100)}%` : "—"}</span>; } },
    { key: "ctr", header: "CTR", align: "right", render: (n) => { const d = n.stats?.delivered || 0; return <span className="tabular-nums">{d ? `${Math.round(((n.stats?.clicked || 0) / d) * 100)}%` : "—"}</span>; } },
  ];

  return <>
    <PageHeader title="Notifications" description="Create, target and deliver push, email, SMS and in-app campaigns." actions={<ToolbarButton variant="primary" onClick={() => navigate({ to: "/admin/notification/new" })}><Plus className="size-3.5" /> New notification</ToolbarButton>} />
    <PageBody>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Delivered" value={stats.delivered.toLocaleString()} hint="All campaigns" />
        <StatCard label="Avg open rate" value={stats.openRate} />
        <StatCard label="Avg CTR" value={stats.ctr} />
        <StatCard label="Scheduled" value={String(stats.active)} hint="Ready to send" />
      </div>
      <DataTable data={records} columns={columns} rowKey={(n) => n._id} searchAccessor={(n) => `${n.title} ${n.body || ""} ${n.audience || ""} ${n.channel}`} searchPlaceholder="Search notifications…" exportFilename="notifications.csv" emptyTitle={loading ? "Loading notifications…" : "No notifications yet"} emptyDescription={loading ? "" : "Create your first customer notification campaign."} bulkActions={(selected) => <><ToolbarButton variant="secondary" onClick={() => void updateSelected(selected, "draft")}>Pause ({selected.length})</ToolbarButton><ToolbarButton variant="secondary" onClick={() => void duplicate(selected)}>Duplicate</ToolbarButton></>} />
    </PageBody>
  </>;
}
