import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Field, FormGrid, SelectInput, TextInput } from "@/components/admin/form";
import { CalendarClock, Plus } from "lucide-react";
import { scheduledReports, type ScheduledReport } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/reports")({
  head: () => ({
    meta: [
      { title: "Scheduled Reports — Freshly Admin" },
      { name: "description", content: "Automated KPI, inventory and cohort reports delivered to stakeholders on a schedule." },
      { property: "og:title", content: "Scheduled Reports — Freshly Admin" },
      { property: "og:description", content: "Automated KPI, inventory and cohort reports delivered to stakeholders on a schedule." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  const [creating, setCreating] = useState(false);

  const columns: Column<ScheduledReport>[] = [
    {
      key: "name", header: "Report", sortable: true, sortAccessor: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-xl bg-secondary flex items-center justify-center"><CalendarClock className="size-4 text-muted-foreground" /></div>
          <div>
            <div className="font-medium">{r.name}</div>
            <div className="text-[11px] text-muted-foreground">{r.cadence} · {r.format}</div>
          </div>
        </div>
      ),
    },
    { key: "recipients", header: "Recipients", align: "right", render: (r) => <span className="tabular-nums">{r.recipients}</span> },
    { key: "nextRun", header: "Next run", render: (r) => <span className="text-muted-foreground">{r.nextRun}</span> },
    { key: "status", header: "Status", align: "right", render: (r) => <StatusBadge tone={r.status === "active" ? "success" : "warning"}>{r.status}</StatusBadge> },
  ];

  return (
    <>
      <PageHeader
        title="Scheduled reports"
        description="Push the numbers to people instead of asking them to log in. Delivered by email with signed download links."
        actions={<ToolbarButton variant="primary" onClick={() => setCreating((v) => !v)}><Plus className="size-3.5" /> New report</ToolbarButton>}
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active schedules" value={String(scheduledReports.filter((r) => r.status === "active").length)} />
          <StatCard label="Deliveries · 30d" value="184" delta="+12" deltaDir="up" />
          <StatCard label="Avg open rate" value="76%" delta="+4pp" deltaDir="up" />
          <StatCard label="Failed runs" value="0" deltaDir="flat" />
        </div>

        {creating && (
          <SectionCard title="Create scheduled report">
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setCreating(false); }}>
              <FormGrid cols={3}>
                <Field label="Report name" required><TextInput placeholder="Weekly revenue digest" required /></Field>
                <Field label="Dataset">
                  <SelectInput options={[
                    { value: "kpi", label: "Executive KPIs" },
                    { value: "orders", label: "Orders" },
                    { value: "inventory", label: "Inventory & reorder" },
                    { value: "cohorts", label: "Cohort retention" },
                    { value: "promos", label: "Promotion performance" },
                  ]} />
                </Field>
                <Field label="Cadence">
                  <SelectInput options={[{ value: "daily", label: "Daily" }, { value: "weekly", label: "Weekly" }, { value: "monthly", label: "Monthly" }]} />
                </Field>
                <Field label="Format">
                  <SelectInput options={[{ value: "pdf", label: "PDF" }, { value: "csv", label: "CSV" }, { value: "xlsx", label: "XLSX" }]} />
                </Field>
                <Field label="Send at"><TextInput type="time" defaultValue="07:00" /></Field>
                <Field label="Recipients" hint="Comma separated"><TextInput placeholder="ops@freshly.io, cfo@freshly.io" /></Field>
              </FormGrid>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" onClick={() => setCreating(false)}>Cancel</ToolbarButton>
                <ToolbarButton type="submit" variant="primary">Schedule report</ToolbarButton>
              </div>
            </form>
          </SectionCard>
        )}

        <DataTable<ScheduledReport>
          data={scheduledReports}
          columns={columns}
          rowKey={(r) => r.id}
          searchAccessor={(r) => `${r.name} ${r.cadence} ${r.format}`}
          searchPlaceholder="Search reports…"
          exportFilename="scheduled-reports.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary">Run now ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary">Pause</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
