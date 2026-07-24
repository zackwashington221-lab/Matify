import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageBody, StatCard, SectionCard, StatusBadge, ToolbarButton } from "@/components/admin/primitives";
import { Eye, GripVertical, Image as ImageIcon, Plus } from "lucide-react";
import { banners } from "@/lib/admin-mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/banners")({
  head: () => ({
    meta: [
      { title: "Banners — Freshly Admin" },
      { name: "description", content: "Home hero rotation, mobile/desktop variants, scheduling, A/B and click analytics." },
    ],
  }),
  component: Banners,
});

const tone = { live: "success", scheduled: "info", expired: "muted", draft: "warning" } as const;

function Banners() {
  return (
    <>
      <PageHeader
        title="Banners"
        description="Home hero rotation, mobile/desktop variants, scheduling, A/B testing and click analytics."
        actions={<ToolbarButton variant="primary"><Plus className="size-3.5" /> New banner</ToolbarButton>}
      />
      <PageBody>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Live slots" value="3" icon={<ImageIcon className="size-4" />} />
          <StatCard label="Scheduled" value="1" />
          <StatCard label="Clicks · 7d" value="14,381" delta="+12%" deltaDir="up" />
          <StatCard label="Avg CTR" value="3.6%" delta="+0.4pp" deltaDir="up" />
        </div>

        <SectionCard title="Slot rotation" action={<button className="text-[12px] font-semibold text-primary inline-flex items-center gap-1"><Eye className="size-3.5" /> Preview</button>}>
          <div className="space-y-3">
            {banners.map((b) => (
              <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl border border-border hover:bg-secondary/40 transition-colors">
                <GripVertical className="size-4 text-muted-foreground cursor-grab" />
                <div className={cn("w-56 h-24 rounded-xl bg-gradient-to-br p-3 text-white flex flex-col justify-between shrink-0", b.gradient)}>
                  <div>
                    <div className="text-[9px] uppercase tracking-wider opacity-90 font-semibold">Slot {b.slot}</div>
                    <div className="font-display font-bold text-[14px] leading-tight mt-0.5">{b.title}</div>
                  </div>
                  <div className="text-[11px] opacity-90">{b.subtitle}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="font-semibold text-sm">{b.title}</div>
                    <StatusBadge tone={tone[b.status]}>{b.status}</StatusBadge>
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-1">
                    {b.audience} · CTR {b.ctr} · {b.clicks.toLocaleString()} clicks
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {new Date(b.startsAt).toLocaleDateString()} → {new Date(b.endsAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <ToolbarButton variant="secondary">Edit</ToolbarButton>
                  <ToolbarButton variant="ghost">Analytics</ToolbarButton>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </PageBody>
    </>
  );
}
