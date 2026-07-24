import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, PageBody, SectionCard } from "@/components/admin/primitives";
import { Shield, Users, KeyRound, Plug, Mail, MessageSquare, Database, CreditCard, HardDrive, Flag, Wrench, Activity, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Freshly Admin" },
      { name: "description", content: "Admin users, roles, API keys, integrations, security and platform configuration." },
    ],
  }),
  component: Settings,
});

const groups = [
  {
    title: "Administration",
    items: [
      { icon: Users, label: "Admin users", desc: "Invite team members and manage access", to: "/admin/settings" },
      { icon: Shield, label: "Roles & permissions", desc: "Fine-grained role-based access control", to: "/admin/settings" },
      { icon: Activity, label: "Audit logs", desc: "Every admin action, filterable and exportable", to: "/admin/settings" },
      { icon: KeyRound, label: "API keys", desc: "Server-side keys for integrations", to: "/admin/settings" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { icon: Plug, label: "Integrations", desc: "Connect Stripe, Shopify, Klaviyo, and more", to: "/admin/settings" },
      { icon: CreditCard, label: "Payment gateways", desc: "Providers, fees, currencies", to: "/admin/settings" },
      { icon: Mail, label: "Email", desc: "Sender identity, DKIM, SPF, templates", to: "/admin/settings" },
      { icon: MessageSquare, label: "SMS", desc: "Twilio / Vonage configuration", to: "/admin/settings" },
      { icon: HardDrive, label: "Storage", desc: "Media, backup and CDN", to: "/admin/settings" },
    ],
  },
  {
    title: "Platform",
    items: [
      { icon: Shield, label: "Security & 2FA", desc: "Sessions, MFA, IP allow-list", to: "/admin/settings" },
      { icon: Flag, label: "Feature flags", desc: "Progressive rollout and A/B", to: "/admin/settings" },
      { icon: Wrench, label: "Maintenance mode", desc: "Take the storefront offline gracefully", to: "/admin/settings" },
      { icon: Database, label: "Backup & restore", desc: "Point-in-time recovery", to: "/admin/settings" },
    ],
  },
];

function Settings() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Administration, integrations and platform-wide configuration."
      />
      <PageBody>
        {groups.map((g) => (
          <SectionCard key={g.title} title={g.title} padded={false}>
            <ul className="divide-y divide-border">
              {g.items.map((it) => (
                <li key={it.label}>
                  <Link to={it.to} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors">
                    <div className="size-10 rounded-xl bg-secondary flex items-center justify-center"><it.icon className="size-4 text-muted-foreground" /></div>
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold">{it.label}</div>
                      <div className="text-[12px] text-muted-foreground">{it.desc}</div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </SectionCard>
        ))}
      </PageBody>
    </>
  );
}
