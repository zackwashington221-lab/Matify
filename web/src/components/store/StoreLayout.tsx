import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, Search, ShoppingBag, Sparkles, Truck, User, X } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { useCart } from "@/lib/store-cart";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/shop", label: "Shop all" },
  { to: "/assistant", label: "AI assistant" },
  { to: "/tracking", label: "Track order" },
] as const;

export function StoreLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname as string });
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="bg-primary text-primary-foreground text-[13px]">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 h-9 flex items-center justify-center gap-2">
          <Truck className="size-3.5" />
          Free same-day delivery on orders over $35 · Fresh guarantee on every item
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="h-16 flex items-center gap-4 lg:gap-8">
            <button
              className="lg:hidden size-10 -ml-2 rounded-xl flex items-center justify-center hover:bg-secondary"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>

            <Link to="/" className="flex items-center gap-2 shrink-0">
              <span className="size-9 rounded-2xl bg-primary text-primary-foreground font-display font-bold flex items-center justify-center">
                F
              </span>
              <span className="font-display text-lg font-bold tracking-tight">Martify</span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                    pathname.startsWith(n.to) ? "bg-primary-soft text-accent-foreground" : "text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <Link
              to="/shop"
              className="hidden md:flex flex-1 max-w-xl items-center gap-3 h-11 px-4 rounded-2xl bg-secondary text-muted-foreground hover:bg-muted transition-colors"
            >
              <Search className="size-4" />
              <span className="text-sm">Search produce, bakery, pantry…</span>
            </Link>

            <div className="ml-auto flex items-center gap-1">
              <Link to="/assistant" className="hidden sm:flex size-10 rounded-xl items-center justify-center hover:bg-secondary" aria-label="AI assistant">
                <Sparkles className="size-5 text-primary" />
              </Link>
              <Link to="/profile" className="size-10 rounded-xl flex items-center justify-center hover:bg-secondary" aria-label="Account">
                <User className="size-5" />
              </Link>
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                <ShoppingBag className="size-4" />
                <span className="hidden sm:inline">Cart</span>
                <span className="min-w-5 h-5 px-1 rounded-full bg-primary-foreground/20 text-[11px] font-bold flex items-center justify-center tabular-nums">
                  {count}
                </span>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1 h-11 -mt-px overflow-x-auto no-scrollbar">
            {categories.map((c) => (
              <Link
                key={c.id}
                to="/shop"
                search={{ category: c.id }}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <span>{c.emoji}</span>
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-border bg-background px-4 py-3 space-y-1">
            {[...nav, { to: "/shop", label: "Categories" } as const].map((n) => (
              <Link key={n.label} to={n.to} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary">
                {n.label}
              </Link>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  to="/shop"
                  search={{ category: c.id }}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium"
                >
                  <span>{c.emoji}</span>
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-20 border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 py-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-8 rounded-xl bg-primary text-primary-foreground font-display font-bold flex items-center justify-center">F</span>
              <span className="font-display font-bold">Martify</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              An AI grocery marketplace — thoughtful picks, honest pricing, and same-day delivery from local growers.
            </p>
          </div>
          <FooterCol title="Shop" links={categories.slice(0, 5).map((c) => c.name)} />
          <FooterCol title="Company" links={["About us", "Careers", "Sustainability", "Press", "Partner with us"]} />
          <FooterCol title="Support" links={["Help center", "Delivery areas", "Returns & refunds", "Contact", "Track an order"]} />
        </div>
        <div className="border-t border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 h-14 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Martify Markets. All rights reserved.</span>
            <span className="flex gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Accessibility</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l} className="text-foreground/80 hover:text-primary transition-colors cursor-pointer">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}
