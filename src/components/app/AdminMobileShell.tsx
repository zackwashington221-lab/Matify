import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingBag, Users, BarChart3, Sparkles, Bell, Megaphone, Image as ImageIcon, Settings, ChevronLeft, Search } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin/mobile", icon: LayoutDashboard, label: "Home" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/ai", icon: Sparkles, label: "AI" },
  { to: "/admin/inventory", icon: Package, label: "Stock" },
  { to: "/admin/analytics", icon: BarChart3, label: "Insights" },
] as const;

export const adminMenu = [
  { to: "/admin/mobile", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/inventory", icon: Package, label: "Inventory" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/promotions", icon: Megaphone, label: "Promotions" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/banners", icon: ImageIcon, label: "Banners" },
  { to: "/admin/notifications", icon: Bell, label: "Notifications" },
  { to: "/admin/ai", icon: Sparkles, label: "AI config" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminMobileShell({ children, hideTabs = false }: { children: ReactNode; hideTabs?: boolean }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen bg-background relative pb-24">
        {children}
        {!hideTabs && (
          <nav className="fixed bottom-0 inset-x-0 z-40 pointer-events-none">
            <div className="mx-auto max-w-md pointer-events-auto px-4 pb-4">
              <div className="rounded-3xl bg-card/95 backdrop-blur-xl border border-border shadow-pop px-2 py-2 flex items-center justify-between">
                {tabs.map((t) => {
                  const active = pathname === t.to || (t.label !== "Home" && pathname.startsWith(t.to));
                  const Icon = t.icon;
                  const isAI = t.label === "AI";
                  return (
                    <Link
                      key={t.to}
                      to={t.to}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition-all",
                        active && !isAI && "bg-primary-soft text-accent-foreground"
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-2xl transition-all",
                          isAI
                            ? "size-10 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-emerald -mt-6"
                            : "size-6"
                        )}
                      >
                        <Icon className={cn("size-5", active && !isAI && "text-primary")} strokeWidth={2.2} />
                      </div>
                      <span className={cn("text-[10px] font-medium", active ? "text-primary" : "text-muted-foreground")}>
                        {t.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}

export function AdminTopBar({
  title,
  subtitle,
  back,
  right,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: string;
  right?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="flex items-center justify-between px-5 h-16 gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {back && (
            <Link to={back} className="size-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <ChevronLeft className="size-4" />
            </Link>
          )}
          <div className="min-w-0">
            <div className="font-display font-semibold text-[17px] leading-tight truncate">{title}</div>
            {subtitle && <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate">{subtitle}</div>}
          </div>
        </div>
        {right}
      </div>
    </header>
  );
}

export function AdminSearchBar({ placeholder = "Search…" }: { placeholder?: string }) {
  return (
    <div className="mx-5 mt-3 flex items-center gap-2 h-11 px-4 rounded-2xl bg-secondary">
      <Search className="size-4 text-muted-foreground" />
      <input placeholder={placeholder} className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 mt-6 mb-3">
      <h2 className="font-display text-[15px] font-semibold tracking-tight">{children}</h2>
      {action}
    </div>
  );
}
