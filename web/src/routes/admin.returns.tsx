import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageHeader, PageBody, SectionCard, StatCard, StatusBadge, Tabs, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Field, FormGrid, SelectInput, TextArea, TextInput } from "@/components/admin/form";
import { RotateCcw } from "lucide-react";
import { returnCases, type ReturnCase } from "@/lib/admin-platform-mock";

export const Route = createFileRoute("/admin/returns")({
  head: () => ({
    meta: [
      { title: "Return Orders — Martify Admin" },
      { name: "description", content: "Review returned orders, approve refunds within policy and track refund spend by reason." },
      { property: "og:title", content: "Return Orders — Martify Admin" },
      { property: "og:description", content: "Review returned orders, approve refunds within policy and track refund spend by reason." },
    ],
  }),
  component: ReturnsPage,
});

const tone = { requested: "warning", approved: "info", refunded: "success", rejected: "danger" } as const;

function ReturnsPage() {
  const [tab, setTab] = useState("all");
  const [active, setActive] = useState<ReturnCase | null>(null);
  const [saving, setSaving] = useState(false);
  const [liveCases, setLiveCases] = useState<ReturnCase[] | null>(null);
  const [note, setNote] = useState("");

  const loadCases = useCallback(async () => {
    try {
      const response = await api.returns.list({ limit: 200 });
      const mapped = response.data.map((item: any) => ({
        id: item._id,
        orderId: item.order?.reference || "Order",
        customer: item.customer?.name || "Customer",
        reason: item.reason,
        items: item.items,
        amount: item.amount,
        status: item.status,
        openedAt: item.createdAt,
      })) as ReturnCase[];
      setLiveCases(mapped.length ? mapped : null);
    } catch {
      toast.error("Returns could not be refreshed", { description: "Showing demonstration return data until the API is available." });
    }
  }, []);

  useEffect(() => { loadCases(); }, [loadCases]);

  const caseData = liveCases || returnCases;
  const rows = tab === "all" ? caseData : caseData.filter((r) => r.status === tab);

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
      render: (r) => <ToolbarButton variant="secondary" onClick={() => { setNote(""); setActive(r); }}>Review</ToolbarButton>,
    },
  ];

  async function decide(status: "approved" | "rejected" | "refunded") {
    if (!active) return;
    setSaving(true);
    try {
      await api.returns.update(active.id, { status, resolutionNote: note.trim() || `${status} from admin returns review` });
      toast.success(status === "rejected" ? "Return rejected" : status === "refunded" ? "Return refunded" : "Return approved");
      setActive(null);
      setNote("");
      await loadCases();
    } catch (error) {
      toast.error("Could not update return", { description: error instanceof Error ? error.message : "Please try again." });
    } finally { setSaving(false); }
  }

  async function decideMany(selected: ReturnCase[], status: "approved" | "rejected") {
    if (!liveCases) return toast.error("Bulk actions need return cases saved in the backend.");
    setSaving(true);
    try {
      await Promise.all(selected.map((item) => api.returns.update(item.id, { status, resolutionNote: `${status} in bulk return review` })));
      await loadCases();
      toast.success(`${selected.length} return order${selected.length === 1 ? "" : "s"} ${status}`);
    } catch (error) { toast.error("Could not update return orders", { description: error instanceof Error ? error.message : "Please try again." }); }
    finally { setSaving(false); }
  }

  return (
    <>
      <PageHeader
        title="Return orders"
        description="Review returned orders, resolve customer requests, and issue refunds when appropriate."
        tabs={
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { value: "all", label: "All", count: caseData.length },
              { value: "requested", label: "Requested", count: caseData.filter((r) => r.status === "requested").length },
              { value: "approved", label: "Approved", count: caseData.filter((r) => r.status === "approved").length },
              { value: "refunded", label: "Refunded", count: caseData.filter((r) => r.status === "refunded").length },
              { value: "rejected", label: "Rejected", count: caseData.filter((r) => r.status === "rejected").length },
            ]}
          />
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Open cases" value={String(caseData.filter((r) => r.status === "requested").length)} icon={<RotateCcw className="size-4" />} />
          <StatCard label="Refunded · 30d" value={`$${caseData.reduce((s, r) => s + r.amount, 0).toFixed(0)}`} delta="-8%" deltaDir="down" />
          <StatCard label="Refund rate" value="1.8%" delta="-0.3pp" deltaDir="down" />
          <StatCard label="Avg resolution" value="4.2h" delta="-40m" deltaDir="down" />
        </div>

        {active && (
          <Dialog open onOpenChange={(open) => !open && setActive(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{`Review ${active.id} · ${active.orderId}`}</DialogTitle><DialogDescription>Review the request, refund value and internal resolution before saving.</DialogDescription></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); decide("approved"); }}>
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
                <TextArea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Courier confirmed the cold chain break; approving full refund." />
              </Field>
              <div className="flex justify-end gap-2">
                <ToolbarButton type="button" variant="secondary" disabled={saving} onClick={() => decide("rejected")}>Reject</ToolbarButton>
                {active.status === "approved" && <ToolbarButton type="button" variant="secondary" disabled={saving} onClick={() => decide("refunded")}>Issue refund</ToolbarButton>}
                <ToolbarButton type="submit" variant="primary" disabled={saving}>{saving ? "Saving…" : "Approve refund"}</ToolbarButton>
              </div>
            </form>
            </DialogContent>
          </Dialog>
        )}

        <DataTable<ReturnCase>
          data={rows}
          columns={columns}
          rowKey={(r) => r.id}
          searchAccessor={(r) => `${r.id} ${r.orderId} ${r.customer} ${r.reason}`}
          searchPlaceholder="Search case, order or customer…"
          onRowClick={(returnOrder) => { setNote(""); setActive(returnOrder); }}
          exportFilename="returns.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary" disabled={saving} onClick={() => void decideMany(sel, "approved")}>Approve ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary" disabled={saving} onClick={() => void decideMany(sel, "rejected")}>Reject</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
