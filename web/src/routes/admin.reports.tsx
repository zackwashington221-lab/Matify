import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Plus } from "lucide-react";
import {
  PageHeader,
  PageBody,
  SectionCard,
  StatCard,
  StatusBadge,
  ToolbarButton,
} from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Field, FormGrid, SelectInput, TextInput } from "@/components/admin/form";
import { api, type ScheduledReport } from "@/lib/api-client";
export const Route = createFileRoute("/admin/reports")({
  head: () => ({ meta: [{ title: "Scheduled Reports — Martify Admin" }] }),
  component: ReportsPage,
});
const cadenceValues = [
  { value: "Daily", label: "Daily" },
  { value: "Weekly", label: "Weekly" },
  { value: "Monthly", label: "Monthly" },
];
function ReportsPage() {
  const [creating, setCreating] = useState(false);
  const [reports, setReports] = useState<ScheduledReport[]>([]);
  const [name, setName] = useState("");
  const [cadence, setCadence] = useState("Weekly");
  const [format, setFormat] = useState("CSV");
  const [recipients, setRecipients] = useState("");
  const [saving, setSaving] = useState(false);
  const load = async () => {
    try {
      setReports((await api.reports.list({ limit: 100 })).data);
    } catch (error) {
      toast.error("Reports could not be loaded", {
        description:
          error instanceof Error ? error.message : "Please check the backend connection.",
      });
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const schedule = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !recipients.trim())
      return toast.error("Enter a report name and at least one recipient.");
    setSaving(true);
    try {
      await api.reports.create({
        name: name.trim(),
        cadence,
        format,
        recipients: recipients
          .split(",")
          .map((email) => email.trim())
          .filter(Boolean),
        status: "active",
        nextRunAt: nextRun(cadence),
      });
      setCreating(false);
      setName("");
      setRecipients("");
      await load();
      toast.success("Report schedule created");
    } catch (error) {
      toast.error("Could not schedule report", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };
  const setStatus = async (selected: ScheduledReport[], status: "active" | "paused") => {
    try {
      await Promise.all(selected.map((report) => api.reports.update(report._id, { status })));
      await load();
      toast.success(
        `${selected.length} report${selected.length === 1 ? "" : "s"} ${status === "paused" ? "paused" : "resumed"}`,
      );
    } catch (error) {
      toast.error("Could not update reports", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };
  const runNow = async (selected: ScheduledReport[]) => {
    try {
      const kpis = await api.analytics.kpis();
      const rows = [
        "report,revenue_30d,orders_30d,average_order_value,customers",
        ...selected.map(
          (report) =>
            `${csv(report.name)},${kpis.data.revenue30d},${kpis.data.orders30d},${kpis.data.avgOrderValue},${kpis.data.customers}`,
        ),
      ];
      download(rows.join("\n"), "martify-report-run.csv");
      toast.success(
        `${selected.length} report${selected.length === 1 ? "" : "s"} generated and downloaded`,
      );
    } catch (error) {
      toast.error("Could not generate report", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };
  const stats = useMemo(
    () => ({
      active: reports.filter((report) => report.status === "active").length,
      paused: reports.filter((report) => report.status === "paused").length,
      recipients: reports.reduce((sum, report) => sum + report.recipients.length, 0),
    }),
    [reports],
  );
  const columns: Column<ScheduledReport>[] = [
    {
      key: "name",
      header: "Report",
      sortable: true,
      sortAccessor: (report) => report.name,
      exportValue: (report) => report.name,
      render: (report) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-secondary grid place-items-center">
            <CalendarClock className="size-4 text-muted-foreground" />
          </div>
          <div>
            <div className="font-medium">{report.name}</div>
            <div className="text-[11px] text-muted-foreground">
              {report.cadence} · {report.format}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "recipients",
      header: "Recipients",
      align: "right",
      exportValue: (report) => report.recipients.join(", "),
      render: (report) => <span className="tabular-nums">{report.recipients.length}</span>,
    },
    {
      key: "next",
      header: "Next run",
      exportValue: (report) => report.nextRunAt ? new Date(report.nextRunAt).toISOString() : "Not scheduled",
      render: (report) => (
        <span className="text-muted-foreground">
          {report.nextRunAt ? new Date(report.nextRunAt).toLocaleString() : "Not scheduled"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      align: "right",
      exportValue: (report) => report.status,
      render: (report) => (
        <StatusBadge tone={report.status === "active" ? "success" : "warning"}>
          {report.status}
        </StatusBadge>
      ),
    },
  ];
  return (
    <>
      <PageHeader
        title="Scheduled reports"
        description="Schedule KPI exports for stakeholders. Reports run on the selected cadence; Run now downloads an on-demand CSV."
        actions={
          <ToolbarButton variant="primary" onClick={() => setCreating((value) => !value)}>
            <Plus className="size-3.5" /> New report
          </ToolbarButton>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active schedules" value={String(stats.active)} />
          <StatCard label="Paused schedules" value={String(stats.paused)} />
          <StatCard label="Report recipients" value={String(stats.recipients)} />
          <StatCard label="Delivery format" value="CSV/PDF/XLSX" />
        </div>
        {creating && (
          <SectionCard title="Create scheduled report">
            <form className="space-y-4" onSubmit={schedule}>
              <FormGrid cols={3}>
                <Field label="Report name" required>
                  <TextInput
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Weekly revenue digest"
                    required
                  />
                </Field>
                <Field label="Cadence">
                  <SelectInput
                    value={cadence}
                    onChange={(event) => setCadence(event.target.value)}
                    options={cadenceValues}
                  />
                </Field>
                <Field label="Format">
                  <SelectInput
                    value={format}
                    onChange={(event) => setFormat(event.target.value)}
                    options={[
                      { value: "CSV", label: "CSV" },
                      { value: "PDF", label: "PDF" },
                      { value: "XLSX", label: "XLSX" },
                    ]}
                  />
                </Field>
                <Field label="Recipients" hint="Comma separated">
                  <TextInput
                    value={recipients}
                    onChange={(event) => setRecipients(event.target.value)}
                    placeholder="ops@martify.io, cfo@martify.io"
                  />
                </Field>
              </FormGrid>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" onClick={() => setCreating(false)}>
                  Cancel
                </ToolbarButton>
                <ToolbarButton type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving…" : "Schedule report"}
                </ToolbarButton>
              </div>
            </form>
          </SectionCard>
        )}
        <DataTable
          data={reports}
          columns={columns}
          rowKey={(report) => report._id}
          searchAccessor={(report) =>
            `${report.name} ${report.cadence} ${report.format} ${report.recipients.join(" ")}`
          }
          searchPlaceholder="Search reports…"
          exportFilename="scheduled-reports.csv"
          emptyTitle="No scheduled reports"
          emptyDescription="Create a recurring report for the operations team."
          bulkActions={(selected) => (
            <>
              <ToolbarButton variant="secondary" onClick={() => void runNow(selected)}>
                Run now ({selected.length})
              </ToolbarButton>
              <ToolbarButton variant="secondary" onClick={() => void setStatus(selected, "paused")}>
                Pause
              </ToolbarButton>
              <ToolbarButton variant="secondary" onClick={() => void setStatus(selected, "active")}>
                Resume
              </ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
function nextRun(cadence: string) {
  const date = new Date();
  date.setDate(date.getDate() + (cadence === "Daily" ? 1 : cadence === "Weekly" ? 7 : 30));
  return date.toISOString();
}
function csv(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
function download(contents: string, filename: string) {
  const url = URL.createObjectURL(new Blob([contents], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
