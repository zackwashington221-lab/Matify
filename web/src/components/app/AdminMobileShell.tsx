import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart3,
  Bell,
  Megaphone,
  Image as ImageIcon,
  Settings,
  ChevronLeft,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/admin/mobile", icon: LayoutDashboard, label: "Home" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
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
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminMobileShell({
  children,
  hideTabs = false,
}: {
  children: ReactNode;
  hideTabs?: boolean;
}) {
  const pathname: string = useRouterState({
    select: (s: any) => s.location.pathname as string,
  });

  return (
    <div className="min-h-screen w-full bg-background pb-24">
      <div className={cn("relative min-h-screen w-full bg-background", !hideTabs && "pb-24")}>
        {children}

        {!hideTabs && (
          <nav className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
            <div className="w-full pointer-events-auto px-4 pb-4 md:px-6 lg:px-8">
              <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-card/95 px-2 py-2 shadow-pop backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  {tabs.map((t) => {
                    const active =
                      pathname === t.to || (t.label !== "Home" && pathname.startsWith(t.to));

                    const Icon = t.icon;

                    return (
                      <Link
                        key={t.to}
                        to={t.to}
                        className={cn(
                          "flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 transition-all",
                          active && "bg-primary-soft text-accent-foreground",
                        )}
                      >
                        <div className="flex size-6 items-center justify-center rounded-2xl">
                          <Icon
                            className={cn(
                              "size-5",
                              active ? "text-primary" : "text-muted-foreground",
                            )}
                            strokeWidth={2.2}
                          />
                        </div>

                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            active ? "text-primary" : "text-muted-foreground",
                          )}
                        >
                          {t.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
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
            <Link
              to={back}
              className="size-9 rounded-full bg-secondary flex items-center justify-center shrink-0"
            >
              <ChevronLeft className="size-4" />
            </Link>
          )}
          <div className="min-w-0">
            <div className="font-display font-semibold text-[17px] leading-tight truncate">
              {title}
            </div>
            {subtitle && (
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider mt-0.5 truncate">
                {subtitle}
              </div>
            )}
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
      <input
        placeholder={placeholder}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
      />
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
