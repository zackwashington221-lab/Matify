import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell, TopBar } from "@/components/app/MobileShell";
import { Check, MessageCircle, Phone, Sparkles, MapPin } from "lucide-react";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Order tracking — Freshly" },
      { name: "description", content: "Live tracking for your Freshly grocery order." },
    ],
  }),
  component: Tracking,
});

function Tracking() {
  const steps = [
    { label: "Order placed", time: "2:14 PM", done: true },
    { label: "Personal shopper picking", time: "2:22 PM", done: true },
    { label: "Quality check", time: "2:41 PM", done: true, active: true },
    { label: "Out for delivery", time: "Est. 2:55 PM", done: false },
    { label: "Delivered", time: "Est. 3:12 PM", done: false },
  ];

  return (
    <MobileShell>
      <TopBar back="/home" title="Order #FR-4821" />

      {/* Success hero */}
      <div className="px-5 pt-4 pb-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-emerald relative overflow-hidden">
          <div aria-hidden className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl" />
          <div className="size-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
            <Check className="size-6" strokeWidth={3} />
          </div>
          <div className="text-[13px] uppercase tracking-wider text-emerald-100 font-semibold">Arriving in</div>
          <div className="text-4xl font-bold tracking-tight mt-1">28 minutes</div>
          <div className="text-sm text-emerald-100 mt-1">By 3:12 PM · 4 items · $37.32</div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="px-5 pb-5">
        <div className="relative aspect-[16/10] rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border border-border overflow-hidden">
          <svg className="absolute inset-0 size-full" viewBox="0 0 400 250" fill="none">
            <path d="M0,180 Q80,120 160,150 T320,90 T400,60" stroke="url(#g)" strokeWidth="3" strokeDasharray="4 4" fill="none" />
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="oklch(0.58 0.15 155)" />
                <stop offset="1" stopColor="oklch(0.65 0.15 200)" />
              </linearGradient>
            </defs>
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={i} x1={i * 35} y1={0} x2={i * 35} y2={250} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <line key={i} x1={0} y1={i * 35} x2={400} y2={i * 35} stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
            ))}
          </svg>
          <div className="absolute left-4 top-4 rounded-2xl bg-card shadow-card border border-border px-3 py-2 flex items-center gap-2">
            <div className="size-6 rounded-lg bg-primary-soft flex items-center justify-center">🏪</div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">From</div>
              <div className="text-[12px] font-semibold">Freshly Hub</div>
            </div>
          </div>
          <div className="absolute right-4 bottom-4 rounded-2xl bg-card shadow-card border border-border px-3 py-2 flex items-center gap-2">
            <div className="size-6 rounded-lg bg-primary-soft flex items-center justify-center"><MapPin className="size-3.5 text-primary" /></div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">To</div>
              <div className="text-[12px] font-semibold">1247 Elm St</div>
            </div>
          </div>
          <div className="absolute left-[52%] top-[42%] size-10 rounded-full bg-primary shadow-emerald flex items-center justify-center text-white text-lg animate-pulse">
            🛵
          </div>
        </div>
      </div>

      {/* Courier card */}
      <div className="px-5 pb-5">
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="size-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center font-bold">M</div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">Marcus is your shopper</div>
            <div className="text-[11px] text-muted-foreground">⭐ 4.98 · 2,341 deliveries</div>
          </div>
          <button className="size-10 rounded-full bg-secondary flex items-center justify-center"><MessageCircle className="size-4" /></button>
          <button className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><Phone className="size-4" /></button>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-5 pb-6">
        <div className="rounded-2xl bg-card border border-border p-4">
          {steps.map((s, i) => (
            <div key={s.label} className="flex gap-3 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`size-6 rounded-full flex items-center justify-center border-2 z-10 ${
                    s.done ? "bg-primary border-primary" : "bg-card border-border"
                  } ${s.active ? "ring-4 ring-primary/20" : ""}`}
                >
                  {s.done && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
                </div>
                {i < steps.length - 1 && <div className={`w-0.5 flex-1 ${s.done ? "bg-primary" : "bg-border"}`} />}
              </div>
              <div className="pb-5 flex-1">
                <div className={`text-[13px] font-semibold ${s.done ? "" : "text-muted-foreground"}`}>{s.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{s.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI card */}
      <div className="px-5 pb-6">
        <div className="rounded-2xl bg-primary-soft/60 border border-primary/10 p-4 flex gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-emerald shrink-0">
            <Sparkles className="size-4" />
          </div>
          <div className="text-[13px] leading-relaxed">
            <span className="font-semibold">Recipe idea for tonight:</span>{" "}
            <span className="text-muted-foreground">Avocado toast on sourdough with a poached egg — everything you need is on the truck.</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-8">
        <Link to="/home" className="flex items-center justify-center h-12 rounded-2xl bg-secondary text-foreground font-semibold text-sm">
          Continue shopping
        </Link>
      </div>
    </MobileShell>
  );
}
