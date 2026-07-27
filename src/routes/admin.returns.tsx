import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, SectionCard, StatCard, StatusBadge, Tabs, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Field, FormGrid, SelectInput, TextArea, TextInput } from "@/components/admin/form";
import { RotateCcw, ShieldCheck } from "lucide-react";
import { returnCases, type ReturnCase } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Refunds — Freshly Admin" },
      { name: "description", content: "Review return requests, approve refunds within policy and track refund spend by reason." },
      { property: "og:title", content: "Returns & Refunds — Freshly Admin" },
      { property: "og:description", content: "Review return requests, approve refunds within policy and track refund spend by reason." },
    ],
  }),
  component: ReturnsPage,
});

const tone = { requested: "warning", approved: "info", refunded: "success", rejected: "danger" } as const;

function ReturnsPage() {
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState<ReturnCase | null>(null);

  const rows = tab === "all" ? returnCases : returnCases.filter((r) => r.status === tab);

  const columns: Column<ReturnCase>[] = [
    { key: "id", header: "Case", sortable: true, sortAccessor: (r) => r.id, render: (r) => <span className="font-semibold tabular-nums">{r.id}</span> },
    { key: "orderId", header: "Order", render: (r) => <span className="text-muted-foreground tabular-nums">{r.orderId}</span> },
    { key: "customer", header: "Customer", render: (r) => <span className="font-medium">{r.customer}</span> },
    { key: "reason", header: "Reason", render: (r) => <StatusBadge tone="muted">{r.reason}</StatusBadge> },
    { key: "items", header: "Items", align: "right", render: (r) => <span className="tabular-nums">{r.items}</span> },
    { key: "amount", header: "Amount", align: "right", sortable: true, sortAccessor: (r) => r.amount, render: (r) => <span className="tabular-nums font-semibold">${r.amount.toFixed(2)}</span> },
    { key: "status", header: "Status", render: (r) => <StatusBadge tone={tone[r.status]}>{r.status}</StatusBadge> },
    {
      key: "actions", header: "", align: "right",
      render: (r) => <ToolbarButton variant="secondary" onClick={() => setActive(r)}>Review</ToolbarButton>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Returns & refunds"
        description="Every refund is policy-checked, capped by role, and written to the audit log."
        actions={<ToolbarButton variant="secondary"><ShieldCheck className="size-3.5" /> Refund policy</ToolbarButton>}
        tabs={
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: "all", label: "All", count: returnCases.length },
              { value: "requested", label: "Requested", count: returnCases.filter((r) => r.status === "requested").length },
              { value: "approved", label: "Approved", count: returnCases.filter((r) => r.status === "approved").length },
              { value: "refunded", label: "Refunded", count: returnCases.filter((r) => r.status === "refunded").length },
              { value: "rejected", label: "Rejected", count: returnCases.filter((r) => r.status === "rejected").length },
            ]}
          />
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open cases" value={String(returnCases.filter((r) => r.status === "requested").length)} icon={<RotateCcw className="size-4" />} />
          <StatCard label="Refunded · 30d" value={`$${returnCases.reduce((s, r) => s + r.amount, 0).toFixed(0)}`} delta="-8%" deltaDir="down" />
          <StatCard label="Refund rate" value="1.8%" delta="-0.3pp" deltaDir="down" />
          <StatCard label="Avg resolution" value="4.2h" delta="-40m" deltaDir="down" />
        </div>

        {active && (
          <SectionCard
            title={`Review ${active.id} · ${active.orderId}`}
            action={<ToolbarButton variant="ghost" onClick={() => setActive(null)}>Close</ToolbarButton>}
          >
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setActive(null); }}>
              <FormGrid cols={3}>
                <Field label="Customer"><TextInput readOnly value={active.customer} /></Field>
                <Field label="Reason"><TextInput readOnly value={active.reason} /></Field>
                <Field label="Requested amount"><TextInput readOnly value={`$${active.amount.toFixed(2)}`} /></Field>
                <Field label="Refund method">
                  <SelectInput options={[
                    { value: "original", label: "Original payment method" },
                    { value: "credit", label: "Store credit" },
                    { value: "replace", label: "Send replacement" },
                  ]} />
                </Field>
                <Field label="Refund amount" hint="Support cap: $250"><TextInput type="number" step="0.01" defaultValue={active.amount} /></Field>
                <Field label="Restock items">
                  <SelectInput options={[{ value: "no", label: "No — perishable" }, { value: "yes", label: "Yes — return to stock" }]} />
                </Field>
              </FormGrid>
              <Field label="Internal note" hint="Visible to the team and stored in the audit log.">
                <TextArea placeholder="Courier confirmed the cold chain break; approving full refund." />
              </Field>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" onClick={() => setActive(null)}>Reject</ToolbarButton>
                <ToolbarButton type="submit" variant="primary">Approve refund</ToolbarButton>
              </div>
            </form>
          </SectionCard>
        )}

        <DataTable<ReturnCase>
          data={rows}
          columns={columns}
          rowKey={(r) => r.id}
          searchAccessor={(r) => `${r.id} ${r.orderId} ${r.customer} ${r.reason}`}
          searchPlaceholder="Search case, order or customer…"
          exportFilename="returns.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary">Approve ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary">Reject</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
