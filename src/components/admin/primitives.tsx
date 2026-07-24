import type { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title, description, actions, tabs,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  tabs?: ReactNode;
}) {
  return (
    <div className="px-4 md:px-6 pt-4 pb-4">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">{title}</h1>
          {description && <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
      {tabs && <div className="mt-4">{tabs}</div>}
    </div>
  );
}

export function PageBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("px-4 md:px-6 pb-10 space-y-5 max-w-[1600px]", className)}>{children}</div>;
}

export function SectionCard({
  title, action, children, className, padded = true,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={cn("rounded-2xl bg-card border border-border shadow-soft", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3 border-b border-border/60">
          {typeof title === "string" ? <h2 className="text-sm font-semibold">{title}</h2> : title}
          {action}
        </header>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function StatCard({
  label, value, delta, deltaDir = "up", hint, icon,
}: {
  label: string;
  value: string;
  delta?: string;
  deltaDir?: "up" | "down" | "flat";
  hint?: string;
  icon?: ReactNode;
}) {
  const isUp = deltaDir === "up";
  return (
    <div className="rounded-2xl bg-card border border-border p-5 shadow-soft flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{label}</div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="text-2xl font-display font-bold tabular-nums leading-tight">{value}</div>
      <div className="flex items-center gap-2 text-[11px]">
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 font-semibold",
              deltaDir === "up" ? "bg-emerald-100 text-emerald-700" :
              deltaDir === "down" ? "bg-rose-100 text-rose-700" :
              "bg-secondary text-muted-foreground"
            )}
          >
            {deltaDir !== "flat" && (isUp ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />)}
            {delta}
          </span>
        )}
        {hint && <span className="text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

export function StatusBadge({
  tone = "default", children,
}: {
  tone?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  children: ReactNode;
}) {
  const styles = {
    default: "bg-secondary text-foreground",
    success: "bg-emerald-100 text-emerald-700",
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-sky-100 text-sky-700",
    muted: "bg-secondary text-muted-foreground",
  }[tone];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", styles)}>
      {children}
    </span>
  );
}

export function EmptyState({
  icon, title, description, action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6">
      <div className="mx-auto size-12 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground mb-3">
        {icon ?? <Inbox className="size-5" />}
      </div>
      <div className="font-display font-semibold">{title}</div>
      {description && <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">{description}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export function Tabs({ items, value, onChange }: {
  items: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex bg-card border border-border rounded-xl p-1 text-[13px] font-medium">
      {items.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 transition-colors",
            value === t.value ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t.label}
          {typeof t.count === "number" && (
            <span className="text-[10px] tabular-nums text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}

export function ToolbarButton({ children, variant = "secondary", ...rest }: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const style = {
    primary: "bg-primary text-primary-foreground shadow-emerald hover:opacity-95",
    secondary: "bg-card border border-border hover:bg-secondary",
    ghost: "hover:bg-secondary text-muted-foreground",
  }[variant];
  return (
    <button {...rest} className={cn("h-9 px-3 rounded-lg text-[13px] font-semibold inline-flex items-center gap-1.5", style, rest.className)}>
      {children}
    </button>
  );
}
