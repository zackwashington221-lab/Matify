import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PageBody, StatCard, StatusBadge, Tabs, ToolbarButton } from "@/components/admin/primitives";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Crown, Mail, Sparkles, UserPlus, Users } from "lucide-react";
import { customers, type Customer } from "@/lib/admin-mock";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({
    meta: [
      { title: "Customers — Martify Admin" },
      { name: "description", content: "Customer directory with LTV, tiers, segments and AI churn signals." },
    ],
  }),
  component: Customers,
});

const tierTone = { New: "info", Silver: "muted", Gold: "warning", Platinum: "success" } as const;
const riskTone = { low: "success", medium: "warning", high: "danger" } as const;

function Customers() {
  const [tab, setTab] = useState<string>("all");
  const navigate = useNavigate();

  const filtered = tab === "all" ? customers
    : tab === "risk" ? customers.filter((c) => c.risk !== "low")
    : customers.filter((c) => c.tier.toLowerCase() === tab);

  const columns: Column<Customer>[] = [
    {
      key: "name", header: "Customer", sortable: true, sortAccessor: (c) => c.name,
      render: (c) => {
        const initials = c.name.split(" ").map((s) => s[0]).join("");
        return (
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-full bg-gradient-to-br from-accent to-primary text-primary-foreground font-semibold flex items-center justify-center text-[11px]">{initials}</div>
            <div>
              <div className="font-medium inline-flex items-center gap-1">{c.name}{c.tier === "Platinum" && <Crown className="size-3.5 text-violet-500" />}</div>
              <div className="text-[11px] text-muted-foreground">{c.email}</div>
            </div>
          </div>
        );
      },
    },
    { key: "location", header: "Location", render: (c) => <span className="text-muted-foreground">{c.location}</span> },
    { key: "tier", header: "Tier", render: (c) => <StatusBadge tone={tierTone[c.tier]}>{c.tier}</StatusBadge> },
    {
      key: "orders", header: "Orders", sortable: true, sortAccessor: (c) => c.orders, align: "right",
      render: (c) => <span className="tabular-nums">{c.orders}</span>,
    },
    {
      key: "aov", header: "AOV", sortable: true, sortAccessor: (c) => c.aov, align: "right",
      render: (c) => <span className="tabular-nums">${c.aov.toFixed(2)}</span>,
    },
    {
      key: "ltv", header: "LTV", sortable: true, sortAccessor: (c) => c.ltv, align: "right",
      render: (c) => <span className="tabular-nums font-semibold">${c.ltv.toFixed(0)}</span>,
    },
    { key: "risk", header: "Churn risk", render: (c) => <StatusBadge tone={riskTone[c.risk]}>{c.risk}</StatusBadge> },
  ];

  const counts = {
    all: customers.length,
    platinum: customers.filter((c) => c.tier === "Platinum").length,
    gold: customers.filter((c) => c.tier === "Gold").length,
    silver: customers.filter((c) => c.tier === "Silver").length,
    new: customers.filter((c) => c.tier === "New").length,
    risk: customers.filter((c) => c.risk !== "low").length,
  };

  return (
    <>
      <PageHeader
        title="Customers"
        description="Full CRM view: lifetime value, tiers, retention scores and AI segmentation."
        actions={
          <>
            <ToolbarButton variant="secondary"><Mail className="size-3.5" /> Broadcast</ToolbarButton>
            <ToolbarButton variant="primary"><UserPlus className="size-3.5" /> Add customer</ToolbarButton>
          </>
        }
      />

      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total customers" value="12,482" delta="+3.6%" deltaDir="up" icon={<Users className="size-4" />} />
          <StatCard label="New · 7d" value="342" delta="+18%" deltaDir="up" />
          <StatCard label="Active buyers" value="8.1k" hint="last 30d" />
          <StatCard label="At-risk (AI)" value="128" delta="Retain" deltaDir="down" />
        </div>

        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { value: "all", label: "All", count: counts.all },
            { value: "platinum", label: "Platinum", count: counts.platinum },
            { value: "gold", label: "Gold", count: counts.gold },
            { value: "silver", label: "Silver", count: counts.silver },
            { value: "new", label: "New", count: counts.new },
            { value: "risk", label: "Churn risk", count: counts.risk },
          ]}
        />

        <DataTable<Customer>
          data={filtered}
          columns={columns}
          rowKey={(c) => c.id}
          searchAccessor={(c) => `${c.name} ${c.email} ${c.location}`}
          searchPlaceholder="Search by name, email, city…"
          onRowClick={(c) => navigate({ to: "/admin/customer/$id", params: { id: c.id } })}
          exportFilename="customers.csv"
          bulkActions={(sel) => (
            <>
              <ToolbarButton variant="secondary"><Sparkles className="size-3.5" /> AI segment ({sel.length})</ToolbarButton>
              <ToolbarButton variant="secondary"><Mail className="size-3.5" /> Message</ToolbarButton>
            </>
          )}
        />
      </PageBody>
    </>
  );
}
