import { createFileRoute, Link } from "@tanstack/react-router";
import { AdminMobileShell, AdminTopBar, SectionTitle } from "@/components/app/AdminMobileShell";
import { Store, CreditCard, Truck, Users, Bell, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Freshly Admin" },
      { name: "description", content: "Store info, payouts, delivery zones and team access." },
    ],
  }),
  component: Settings,
});

const groups = [
  {
    label: "Store",
    items: [
      { icon: Store, l: "Store info", d: "Freshly · Downtown NYC" },
      { icon: Truck, l: "Delivery zones", d: "12 zones · same day" },
      { icon: CreditCard, l: "Payouts", d: "Weekly · Chase ••4821" },
    ],
  },
  {
    label: "Team",
    items: [
      { icon: Users, l: "Team members", d: "8 people · 3 roles" },
      { icon: Shield, l: "Permissions", d: "Owner, Manager, Picker" },
    ],
  },
  {
    label: "Preferences",
    items: [
      { icon: Bell, l: "Notifications", d: "Email · Push · SMS" },
      { icon: HelpCircle, l: "Help & support", d: "Docs · chat · 24/7" },
    ],
  },
];

function Settings() {
  return (
    <AdminMobileShell>
      <AdminTopBar title="Settings" back="/admin/mobile" />

      <div className="px-5 mt-4">
        <div className="rounded-3xl bg-card border border-border p-5 flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-display font-bold flex items-center justify-center text-xl shadow-emerald">F</div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-[15px] leading-tight">Freshly Downtown</div>
            <div className="text-[11px] text-muted-foreground">Owner · Alex Morgan</div>
            <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 rounded-full px-2 py-0.5">● Live</div>
          </div>
          <button className="text-[11px] font-semibold text-primary">Edit</button>
        </div>
      </div>

      {groups.map((g) => (
        <div key={g.label}>
          <SectionTitle>{g.label}</SectionTitle>
          <div className="mx-5 rounded-3xl bg-card border border-border overflow-hidden">
            {g.items.map((it, i) => (
              <button key={it.l} className={`w-full flex items-center gap-3 p-4 text-left ${i > 0 ? "border-t border-border" : ""}`}>
                <div className="size-10 rounded-2xl bg-primary-soft text-accent-foreground flex items-center justify-center">
                  <it.icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold">{it.l}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{it.d}</div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="px-5 mt-6 pb-2">
        <button className="w-full h-12 rounded-2xl bg-rose-50 text-rose-700 text-[13px] font-semibold inline-flex items-center justify-center gap-2">
          <LogOut className="size-4" />Sign out
        </button>
        <div className="text-center text-[10px] text-muted-foreground mt-4">Freshly Admin · v3.4.0</div>
        <Link to="/admin" className="block text-center text-[11px] text-primary mt-3 font-semibold">Open desktop dashboard</Link>
      </div>
    </AdminMobileShell>
  );
}
