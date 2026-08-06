import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout } from "@/components/store/StoreLayout";
import { Heart, MapPin, CreditCard, Bell, Sparkles, HelpCircle, Settings, ChevronRight, Package, Star, LogOut } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "You — Freshly" },
      { name: "description", content: "Your Freshly account, orders, addresses, and preferences." },
    ],
  }),
  component: Profile,
});

function Profile() {
  return (
    <StoreLayout>
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-8">
      <h1 className="font-display text-3xl font-bold tracking-tight px-5">Your account</h1>

      {/* Identity card */}
      <div className="px-5 pt-4 pb-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-emerald relative overflow-hidden">
          <div aria-hidden className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center gap-3">
            <div className="size-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-bold">AM</div>
            <div>
              <div className="text-lg font-semibold">Alex Morgan</div>
              <div className="text-[13px] text-emerald-100">alex@morgan.co · Member since 2023</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              { v: "42", l: "Orders" },
              { v: "$1,248", l: "Saved" },
              { v: "Gold", l: "Status" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-white/15 backdrop-blur p-2.5 text-center">
                <div className="text-sm font-bold">{s.v}</div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-100 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent order */}
      <div className="px-5 pb-5">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Active order</div>
        <Link to="/tracking" className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
          <div className="size-11 rounded-2xl bg-primary-soft flex items-center justify-center"><Package className="size-5 text-primary" /></div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">Order #FR-4821</div>
            <div className="text-[11px] text-muted-foreground">Arriving in 28 min · 4 items</div>
          </div>
          <div className="rounded-full bg-primary-soft text-primary text-[10px] font-semibold px-2 py-1">On the way</div>
        </Link>
      </div>

      {/* Menu */}
      <div className="px-5 pb-6">
        <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
          <MenuRow icon={<Package className="size-4" />} label="Orders & returns" sub="42 orders · 2 returns" />
          <MenuRow icon={<Heart className="size-4" />} label="Wishlist" sub="18 saved items" />
          <MenuRow icon={<MapPin className="size-4" />} label="Addresses" sub="Home · Work · +2" />
          <MenuRow icon={<CreditCard className="size-4" />} label="Payment methods" sub="Apple Pay · Visa · Wallet" />
        </div>
      </div>

      <div className="px-5 pb-6">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Personalize</div>
        <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
          <MenuRow icon={<Sparkles className="size-4 text-primary" />} label="AI preferences" sub="Diet, allergies, budget" highlight />
          <MenuRow icon={<Bell className="size-4" />} label="Notifications" sub="Deals, order updates" />
          <MenuRow icon={<Star className="size-4" />} label="Reviews you left" sub="12 reviews" />
        </div>
      </div>

      <div className="px-5 pb-8">
        <div className="rounded-2xl bg-card border border-border divide-y divide-border overflow-hidden">
          <MenuRow icon={<HelpCircle className="size-4" />} label="Help center" />
          <MenuRow icon={<Settings className="size-4" />} label="Settings" />
          <MenuRow icon={<LogOut className="size-4 text-destructive" />} label="Sign out" cls="text-destructive" />
        </div>
        <div className="text-center text-[11px] text-muted-foreground mt-4">Freshly v3.2 · Made with 🥑</div>
      </div>
    </div>
    </StoreLayout>
  );
}

function MenuRow({ icon, label, sub, cls, highlight }: { icon: React.ReactNode; label: string; sub?: string; cls?: string; highlight?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-secondary/50 transition-colors ${cls ?? ""}`}>
      <div className={`size-9 rounded-xl flex items-center justify-center ${highlight ? "bg-primary-soft" : "bg-secondary"}`}>{icon}</div>
      <div className="flex-1">
        <div className="text-[14px] font-semibold">{label}</div>
        {sub && <div className="text-[11px] text-muted-foreground mt-0.5">{sub}</div>}
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </button>
  );
}
