import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useCustomerSession } from "@/lib/customer-session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Martify" },
      { name: "description", content: "Sign in or create your Martify account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useCustomerSession();
  const navigate = useNavigate();

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(""); setSubmitting(true);
    try {
      if (tab === "signup") await signup(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
      navigate({ to: "/" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not sign you in. Please try again.");
    } finally { setSubmitting(false); }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen flex flex-col px-6 pt-10 pb-8 relative">
        <div aria-hidden className="absolute top-0 right-0 size-72 rounded-full bg-emerald-200/40 blur-3xl -z-10" />

        <Link to="/" className="text-sm font-medium text-muted-foreground mb-8">← Back</Link>

        <div className="mb-8">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald flex items-center justify-center text-white font-bold text-xl mb-5">F</div>
          <h1 className="text-3xl font-bold tracking-tight">
            {tab === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            {tab === "signin" ? "Sign in to pick up where you left off." : "Start shopping smarter in seconds."}
          </p>
        </div>

        <div className="inline-flex p-1 bg-secondary rounded-2xl mb-6 w-full">
          {(["signin", "signup"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 h-10 rounded-xl text-sm font-medium transition-all ${
                tab === k ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"
              }`}
            >
              {k === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form className="space-y-3" onSubmit={submit}>
          {tab === "signup" && (
            <Field icon={<Mail className="size-4" />} placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} required />
          )}
          <Field icon={<Mail className="size-4" />} placeholder="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Field
            icon={<Lock className="size-4" />}
            placeholder="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            right={
              <button type="button" onClick={() => setShowPw((v) => !v)} className="text-muted-foreground">
                {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />

          {tab === "signin" && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" defaultChecked /> Remember me
              </label>
              <Link to="/auth" className="font-medium text-primary">Forgot password?</Link>
            </div>
          )}

          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <button type="submit" disabled={submitting} className="mt-4 flex w-full items-center justify-center gap-2 h-13 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-emerald hover:bg-primary/90 transition-all disabled:opacity-60">
            {submitting ? "Please wait…" : tab === "signin" ? "Sign in" : "Create account"} <ArrowRight className="size-4" />
          </button>
        </form>

        <p className="text-[11px] text-center text-muted-foreground mt-auto pt-6 leading-relaxed">
          By continuing you agree to Martify's <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}

function Field({ icon, right, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { icon: React.ReactNode; right?: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 h-13 py-3.5 px-4 rounded-2xl bg-secondary border border-transparent focus-within:border-primary focus-within:bg-card transition-all">
      <span className="text-muted-foreground">{icon}</span>
      <input
        {...props}
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
      />
      {right}
    </label>
  );
}
