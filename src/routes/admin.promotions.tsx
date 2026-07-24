import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, StatCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Megaphone, Plus, Sparkles, Trash2 } from "lucide-react";
import { campaigns, type Campaign } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/promotions")({
  head: () => ({
    meta: [
      { title: "Promotions — Freshly Admin" },
      { name: "description", content: "Campaigns, coupons, flash sales, bundles, referrals and cashback with AI targeting." },
    ],
  }),
  component: Promotions,
});

const statusTone = { live: "success", scheduled: "info", ended: "muted", draft: "warning" } as const;
const typeTone = { coupon: "info", flash: "danger", bundle: "success", referral: "warning", cashback: "muted" } as const;

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

function Promotions() {
  const columns: Column<Campaign>[] = [
    {
      key: "name", header: "Campaign", sortable: true, sortAccessor: (c) => c.name,
      render: (c) => (
        <div>
          <div className="font-medium">{c.name}</div>
          <div className="text-[11px] text-muted-foreground">{c.discount}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", render: (c) => <StatusBadge tone={typeTone[c.type]}>{c.type}</StatusBadge> },
    { key: "code", header: "Code", render: (c) => c.code ? <code className="text-[11px] bg-secondary rounded px-1.5 py-0.5">{c.code}</code> : <span className="text-muted-foreground">—</span> },
    { key: "status", header: "Status", render: (c) => <StatusBadge tone={statusTone[c.status]}>{c.status}</StatusBadge> },
    {
      key: "redemptions", header: "Redemptions", sortable: true, sortAccessor: (c) => c.redemptions, align: "right",
      render: (c) => <span className="tabular-nums">{c.redemptions.toLocaleString()}</span>,
    },
    {
      key: "revenue", header: "Revenue", sortable: true, sortAccessor: (c) => c.revenue, align: "right",
      render: (c) => <span className="tabular-nums font-semibold">${c.revenue.toLocaleString()}</span>,
    },
    {
      key: "window", header: "Window",
      render: (c) => <span className="text-muted-foreground text-[12px]">{fmtDate(c.startsAt)} → {fmtDate(c.endsAt)}</span>,
    },
  ];

  return (
    <>
      <PageHeader
        title="Promotions"
        description="Campaigns, coupons, flash sales, bundles, referrals and cashback with AI-suggested targeting."
        actions={
          <>
            <ToolbarButton variant="secondary"><Sparkles className="size-3.5" /> AI suggest</ToolbarButton>
            <ToolbarButton variant="primary"><Plus className="size-3.5" /> New campaign</ToolbarButton>
          </>
        }
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Live campaigns" value="6" icon={<Megaphone className="size-4" />} />
          <StatCard label="Redemptions · 7d" value="8,650" delta="+22%" deltaDir="up" />
          <StatCard label="Attributed revenue" value="$121k" delta="+14%" deltaDir="up" />
          <StatCard label="ROI" value="4.8×" delta="+0.3" deltaDir="up" />
        </div>

        <DataTable<Campaign>
          data={campaigns}
          columns={columns}
          rowKey={(c) => c.id}
          searchAccessor={(c) => `${c.name} ${c.code ?? ""} ${c.type}`}
          searchPlaceholder="Search campaigns, codes…"
          exportFilename="campaigns.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary">Pause ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary"><Trash2 className="size-3.5" /> Archive</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
