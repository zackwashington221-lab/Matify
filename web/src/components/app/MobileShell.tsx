import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, ShoppingBag, Sparkles, User } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/home", icon: Home, label: "Home" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/assistant", icon: Sparkles, label: "AI" },
  { to: "/cart", icon: ShoppingBag, label: "Cart" },
  { to: "/profile", icon: User, label: "You" },
] as const;

export function MobileShell({ children, hideTabs = false }: { children: ReactNode; hideTabs?: boolean }) {
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
                  const active = pathname === t.to || (t.to !== "/home" && pathname.startsWith(t.to));
                  const Icon = t.icon;
                  const isAI = t.label === "AI";
                  return (
                    <Link
                      key={t.to}
                      to={t.to}
                      className={cn(
                        "flex-1 flex flex-col items-center gap-0.5 py-2 rounded-2xl transition-all",
                        active && !isAI && "bg-primary-soft text-accent-foreground",
                        isAI && "relative"
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
                        <Icon className={cn(isAI ? "size-5" : "size-5", active && !isAI && "text-primary")} strokeWidth={2.2} />
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

export function TopBar({ title, right, back }: { title?: ReactNode; right?: ReactNode; back?: string }) {
  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-xl border-b border-border/60">
      <div className="flex items-center justify-between px-5 h-14">
        <div className="flex items-center gap-3 min-w-0">
          {back && (
            <Link to={back} className="size-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
          )}
          <div className="font-semibold text-[15px] truncate">{title}</div>
        </div>
        {right}
      </div>
    </header>
  );
}
