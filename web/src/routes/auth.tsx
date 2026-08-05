import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, Phone, Fingerprint, Apple, Eye, EyeOff, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Freshly" },
      { name: "description", content: "Sign in or create your Freshly account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [showPw, setShowPw] = useState(false);

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

        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          {tab === "signup" && (
            <Field icon={<Mail className="size-4" />} placeholder="Full name" />
          )}
          <Field icon={<Mail className="size-4" />} placeholder="Email address" type="email" />
          <Field
            icon={<Lock className="size-4" />}
            placeholder="Password"
            type={showPw ? "text" : "password"}
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

          <Link
            to="/home"
            className="mt-4 flex items-center justify-center gap-2 h-13 py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-emerald hover:bg-primary/90 transition-all"
          >
            {tab === "signin" ? "Sign in" : "Create account"} <ArrowRight className="size-4" />
          </Link>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <SocialButton label="Apple" icon={<Apple className="size-4" />} />
          <SocialButton label="Google" icon={<GoogleG />} />
          <SocialButton label="Phone" icon={<Phone className="size-4" />} />
        </div>

        <button className="mt-4 flex items-center justify-center gap-2 h-12 rounded-2xl bg-secondary text-foreground font-medium text-sm">
          <Fingerprint className="size-4 text-primary" /> Sign in with Face ID
        </button>

        <p className="text-[11px] text-center text-muted-foreground mt-auto pt-6 leading-relaxed">
          By continuing you agree to Freshly's <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>.
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

function SocialButton({ label, icon }: { label: string; icon: React.ReactNode }) {
  return (
    <button className="h-12 rounded-2xl bg-card border border-border flex items-center justify-center gap-2 text-sm font-medium hover:bg-secondary transition-colors">
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.5 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.3l7.8 6C12.3 13.4 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 2.9-2.1 5.3-4.5 7l7.3 5.7c4.3-4 6.8-9.9 6.8-17.2z"/>
      <path fill="#FBBC05" d="M10.4 28.7c-.5-1.4-.7-2.9-.7-4.4s.3-3 .7-4.4l-7.8-6C.9 17.2 0 20.5 0 24s.9 6.8 2.6 9.7l7.8-6z"/>
      <path fill="#34A853" d="M24 48c6.1 0 11.3-2 15-5.5l-7.3-5.7c-2 1.4-4.6 2.2-7.7 2.2-6.3 0-11.7-3.9-13.6-9.5l-7.8 6C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
