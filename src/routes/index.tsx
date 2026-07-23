import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Zap, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Freshly — AI Grocery Marketplace" },
      { name: "description", content: "Groceries, reimagined. AI-curated shopping with same-day delivery." },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen flex flex-col relative overflow-hidden">
        {/* ambient gradient */}
        <div aria-hidden className="absolute -top-40 -right-24 size-96 rounded-full bg-emerald-300/40 blur-3xl" />
        <div aria-hidden className="absolute top-40 -left-32 size-96 rounded-full bg-lime-200/50 blur-3xl" />

        <header className="relative z-10 flex items-center justify-between px-6 pt-8">
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald flex items-center justify-center text-white font-bold">F</div>
            <span className="font-semibold tracking-tight">Freshly</span>
          </div>
          <Link to="/auth" className="text-sm font-medium text-muted-foreground">Skip</Link>
        </header>

        <main className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-8">
          <div className="relative h-[380px] mb-8">
            <FloatingTile emoji="🥑" className="top-4 left-4 rotate-[-8deg]" delay={0} />
            <FloatingTile emoji="🍓" className="top-12 right-6 rotate-[10deg]" delay={0.4} />
            <FloatingTile emoji="🥖" className="top-40 left-12 rotate-[6deg]" delay={0.8} />
            <FloatingTile emoji="🥛" className="top-52 right-4 rotate-[-6deg]" delay={0.2} />
            <FloatingTile emoji="🍅" className="bottom-8 left-6 rotate-[12deg]" delay={0.6} />
            <FloatingTile emoji="🐟" className="bottom-16 right-14 rotate-[-10deg]" delay={1} />
            <div className="absolute top-24 left-1/2 -translate-x-1/2 rounded-3xl bg-card shadow-pop border border-border p-4 w-56">
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-700">
                <Sparkles className="size-3.5" /> AI meal plan ready
              </div>
              <div className="mt-2 text-[13px] font-semibold leading-snug">
                Mediterranean week for 2 · $84.20 · 12 items
              </div>
              <div className="mt-3 flex -space-x-2">
                {["🥑", "🍅", "🐟", "🥖"].map((e) => (
                  <div key={e} className="size-7 rounded-full bg-secondary border-2 border-card flex items-center justify-center text-sm">{e}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-[34px] font-bold tracking-tight leading-[1.05]">
              Groceries that <span className="text-primary">think ahead</span>.
            </h1>
            <p className="text-[15px] text-muted-foreground leading-relaxed">
              Personalized picks, budget-aware planning, and same-day delivery — all guided by AI you actually want to talk to.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-2">
            <Feature icon={<Sparkles className="size-4" />} label="AI picks" />
            <Feature icon={<Zap className="size-4" />} label="60-min delivery" />
            <Feature icon={<ShieldCheck className="size-4" />} label="Freshness promise" />
          </div>

          <div className="mt-8 space-y-3">
            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-primary-foreground font-semibold shadow-emerald hover:bg-primary/90 transition-all"
            >
              Get started <ArrowRight className="size-4" />
            </Link>
            <Link to="/home" className="block text-center text-sm font-medium text-muted-foreground py-2">
              Continue as guest
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}

function FloatingTile({ emoji, className, delay }: { emoji: string; className: string; delay: number }) {
  return (
    <div
      className={`absolute size-20 rounded-3xl bg-card shadow-card border border-border flex items-center justify-center text-4xl ${className}`}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite` }}
    >
      {emoji}
      <style>{`@keyframes float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }`}</style>
    </div>
  );
}

function Feature({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3 flex flex-col items-start gap-1.5">
      <div className="size-7 rounded-lg bg-primary-soft text-accent-foreground flex items-center justify-center">{icon}</div>
      <div className="text-[11px] font-semibold text-foreground">{label}</div>
    </div>
  );
}
