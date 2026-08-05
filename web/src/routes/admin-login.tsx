import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError, api, getCachedAdminUser } from "@/lib/api-client";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "Admin sign in — Martify" },
      { name: "description", content: "Secure access to the Martify admin console." },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const cachedUser = getCachedAdminUser();
    if (cachedUser && isAdmin(cachedUser.role)) {
      navigate({ to: "/admin", replace: true });
    }
  }, [navigate]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const { user } = await api.auth.login(email.trim(), password);
      if (!isAdmin(user.role)) {
        api.auth.logout();
        const message = "This account does not have access to the admin console.";
        setError(message);
        toast.error("Access denied", { description: message });
        return;
      }
      await navigate({ to: "/admin" });
    } catch (cause) {
      const message = cause instanceof ApiError ? cause.message : "We couldn't sign you in. Please try again.";
      setError(message);
      toast.error("Sign-in failed", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-8 sm:grid sm:place-items-center">
      <section className="mx-auto w-full max-w-md rounded-[28px] border border-border bg-card p-6 shadow-card sm:p-8">
        <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">← Back to Martify</Link>

        <div className="mt-10">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-emerald">
            <ShieldCheck className="size-6" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-primary">Martify operations</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Use your approved staff account to continue to the admin console.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={submit} noValidate>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Work email</span>
            <span className="flex h-12 items-center gap-3 rounded-xl border border-border bg-background px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
              <Mail className="size-4 text-muted-foreground" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="you@company.com"
                type="email"
                autoComplete="email"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Password</span>
            <span className="flex h-12 items-center gap-3 rounded-xl border border-border bg-background px-3.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
              <Lock className="size-4 text-muted-foreground" />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
              />
              <button type="button" onClick={() => setShowPassword((visible) => !visible)} className="text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </span>
          </label>

          {error && <p role="alert" className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p>}

          <button disabled={submitting} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-emerald transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? "Signing in…" : <>Sign in securely <ArrowRight className="size-4" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">Access is restricted to authorized Martify staff. Contact an owner if you need an account.</p>
      </section>
    </main>
  );
}

export const isAdmin = (role?: string) => ["Owner", "Admin", "Ops Manager", "Support", "Analyst", "Read only"].includes(role || "");
