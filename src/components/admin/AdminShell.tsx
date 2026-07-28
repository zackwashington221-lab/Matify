import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  LayoutDashboard, Package, Boxes, ShoppingBag, Users, Megaphone,
  BarChart3, Image as ImageIcon, Bell, Settings, Search,
  Plus, ChevronRight, HelpCircle, Command, RotateCcw, LineChart,
  Filter, CalendarClock, UserCog, ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/lib/api-client";

type NavItem = {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  exact?: boolean;
  badge?: string;
  tone?: "warn";
};
type NavGroup = { section: string; items: NavItem[] };

const nav: NavGroup[] = [
  { section: "Overview", items: [
    { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  ]},
  { section: "Commerce", items: [
    { to: "/admin/orders", icon: ShoppingBag, label: "Orders", badge: "12" },
    { to: "/admin/returns", icon: RotateCcw, label: "Return orders" },
    { to: "/admin/products", icon: Package, label: "Products" },
    { to: "/admin/inventory", icon: Boxes, label: "Inventory", badge: "3", tone: "warn" },
    { to: "/admin/customers", icon: Users, label: "Customers" },
  ]},
  { section: "Growth", items: [
    { to: "/admin/promotions", icon: Megaphone, label: "Promotions" },
    { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/admin/cohorts", icon: LineChart, label: "Cohorts" },
    { to: "/admin/funnels", icon: Filter, label: "Funnels" },
    { to: "/admin/reports", icon: CalendarClock, label: "Reports" },
    { to: "/admin/banners", icon: ImageIcon, label: "Banners" },
    { to: "/admin/notifications", icon: Bell, label: "Notifications" },
  ]},
  { section: "Administration", items: [
    { to: "/admin/team", icon: UserCog, label: "Team" },
    { to: "/admin/roles", icon: ShieldCheck, label: "Roles" },
  ]},
  { section: "Platform", items: [
    { to: "/admin/settings", icon: Settings, label: "Settings" },
  ]},
];


function crumbLabel(seg: string) {
  const map: Record<string, string> = {
    admin: "Admin",
  };
  if (map[seg]) return map[seg];
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

export function AdminShell({ children, user }: { children: ReactNode; user: AdminUser }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const segments = pathname.split("/").filter(Boolean);

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const initials = user.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-card sticky top-0 h-screen">
        <div className="px-5 h-16 flex items-center gap-2.5 border-b border-border">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-display font-bold text-base shadow-emerald">F</div>
          <div>
            <div className="text-sm font-bold leading-tight font-display">Freshly</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Admin Console</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {nav.map((group) => (
            <div key={group.section}>
              <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                {group.section}
              </div>
              <div className="space-y-0.5">
                {group.items.map((n) => {
                  const active = isActive(n.to, n.exact);
                  const Icon = n.icon;
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      className={cn(
                        "w-full flex items-center gap-3 h-9 px-3 rounded-lg text-[13px] font-medium transition-colors",
                        active
                          ? "bg-primary-soft text-accent-foreground"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="flex-1 truncate">{n.label}</span>
                      {n.badge && (
                        <span className={cn(
                          "text-[10px] font-semibold rounded-full px-1.5 py-0.5 tabular-nums",
                          n.tone === "warn"
                            ? "bg-amber-100 text-amber-700"
                            : active ? "bg-white/60 text-accent-foreground" : "bg-secondary text-foreground"
                        )}>{n.badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-30 px-4 md:px-6 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-lg h-10 px-3 rounded-xl bg-secondary/70 border border-transparent hover:border-border transition-colors">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Search orders, products, customers…"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
            />
            <kbd className="hidden md:inline-flex text-[10px] text-muted-foreground bg-card border border-border rounded px-1.5 py-0.5 items-center gap-0.5">
              <Command className="size-2.5" />K
            </kbd>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <a href="mailto:support@freshly.local?subject=Freshly%20Admin%20help" className="hidden md:inline-flex h-9 px-3 rounded-lg text-muted-foreground hover:bg-secondary items-center gap-1.5 text-sm">
              <HelpCircle className="size-4" /> Help
            </a>
            <Link to="/admin/notifications" className="relative size-9 rounded-lg hover:bg-secondary flex items-center justify-center">
              <Bell className="size-4 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-destructive" />
            </Link>
            <Link to="/admin/product/new" className="h-9 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-1.5 shadow-emerald hover:opacity-95">
              <Plus className="size-4" /> Create
            </Link>
            <Link to="/admin/profile" title={`Signed in as ${user.name}. Open profile.`} className="size-9 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold flex items-center justify-center text-xs ml-1" aria-label="Open profile">
              {initials}
            </Link>
          </div>
        </header>

        {/* Breadcrumb */}
        {segments.length > 1 && (
          <div className="px-4 md:px-6 pt-4 flex items-center gap-1 text-[12px] text-muted-foreground">
            {segments.map((seg, i) => {
              const to = "/" + segments.slice(0, i + 1).join("/");
              const isLast = i === segments.length - 1;
              return (
                <span key={to} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="size-3" />}
                  {isLast ? (
                    <span className="text-foreground font-medium">{crumbLabel(seg)}</span>
                  ) : (
                    <Link to={to} className="hover:text-foreground">{crumbLabel(seg)}</Link>
                  )}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex-1 min-w-0">{children}</div>
      </main>
    </div>
  );
}
