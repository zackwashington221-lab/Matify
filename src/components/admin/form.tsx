import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormGrid({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div className={cn("grid gap-4", cols === 1 ? "grid-cols-1" : cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
      {children}
    </div>
  );
}

export function Field({
  label, hint, error, required, children, className,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[12px] font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <span className="text-[11px] text-destructive mt-1 block">{error}</span>
      ) : hint ? (
        <span className="text-[11px] text-muted-foreground mt-1 block">{hint}</span>
      ) : null}
    </label>
  );
}

const base =
  "w-full h-10 px-3 rounded-xl bg-card border border-border text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-primary/15 placeholder:text-muted-foreground";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(base, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(base, "h-auto py-2.5 min-h-24 leading-relaxed", props.className)} />;
}

export function SelectInput({
  options, ...rest
}: { options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...rest} className={cn(base, "pr-8", rest.className)}>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function Toggle({
  checked, onChange, label, description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <div className="text-[13px] font-semibold">{label}</div>
        {description && <div className="text-[12px] text-muted-foreground mt-0.5">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          "shrink-0 w-11 h-6 rounded-full p-0.5 transition-colors",
          checked ? "bg-primary" : "bg-secondary border border-border"
        )}
      >
        <span className={cn("block size-5 rounded-full bg-card shadow-soft transition-transform", checked && "translate-x-5")} />
      </button>
    </div>
  );
}

export function FormFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 -mx-5 -mb-5 mt-2 px-5 py-3 bg-card/90 backdrop-blur border-t border-border rounded-b-2xl flex items-center justify-end gap-2">
      {children}
    </div>
  );
}
