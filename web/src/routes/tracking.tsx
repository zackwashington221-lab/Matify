import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, MapPin, Phone, Sparkles } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { api, type Order } from "@/lib/api-client";
import { PageLoader } from "@/components/store/LoadingState";

export const Route = createFileRoute("/tracking")({
  head: () => ({
    meta: [
      { title: "Order tracking — Martify" },
      { name: "description", content: "Live tracking for your Martify grocery order." },
    ],
  }),
  component: Tracking,
});

type Location = { latitude: number; longitude: number };
const stepLabels = ["Order placed", "Personal shopper picking", "Dispatched", "Delivered"];

function Tracking() {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    api.customer
      .orders()
      .then(({ data }) => setOrder(data[0] || null))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Location is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ latitude: coords.latitude, longitude: coords.longitude }),
      () => setLocationError("Allow location access to show your position on the map."),
      { enableHighAccuracy: true, timeout: 10_000, maximumAge: 60_000 },
    );
  }, []);

  if (loading)
    return (
      <StoreLayout>
        <PageLoader label="Loading your latest order" />
      </StoreLayout>
    );
  if (!order)
    return (
      <StoreLayout>
        <div className="mx-auto max-w-3xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">No orders to track</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Place an order and its delivery progress will appear here.
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Shop now
          </Link>
        </div>
      </StoreLayout>
    );

  const estimate = deliveryEstimate(order);
  const activeStep = statusStep(order.status);
  const rider = order.rider;
  const delivered = order.status === "delivered";
  const destination = order.address?.split(",").slice(0, 2).join(",") || "Your delivery address";

  return (
    <StoreLayout>
      <div className="mx-auto max-w-3xl px-4 lg:px-8 py-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-emerald relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -right-8 -top-8 size-40 rounded-full bg-white/10 blur-2xl"
          />
          <div className="size-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-4">
            <Check className="size-6" strokeWidth={3} />
          </div>
          <div className="text-[13px] uppercase tracking-wider text-emerald-100 font-semibold">
            {delivered ? "Delivered" : "Estimated delivery"}
          </div>
          <div className="text-3xl font-bold tracking-tight mt-1">
            {delivered ? "Order delivered" : formatDateTime(estimate)}
          </div>
          <div className="text-sm text-emerald-100 mt-1">
            {order.reference} · {order.items.reduce((total, item) => total + item.qty, 0)} items · $
            {order.total.toFixed(2)}
          </div>
        </div>

        <div className="mt-5 relative aspect-[16/10] rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border border-border overflow-hidden">
          <svg
            className="absolute inset-0 size-full"
            viewBox="0 0 400 250"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M28,184 Q116,110 218,146 T366,65"
              stroke="currentColor"
              className="text-primary/50"
              strokeWidth="3"
              strokeDasharray="5 5"
            />
          </svg>
          <div className="absolute left-4 top-4 rounded-2xl bg-card shadow-card border border-border px-3 py-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">From</div>
            <div className="text-[12px] font-semibold">Martify Hub</div>
          </div>
          <div className="absolute right-4 bottom-4 max-w-48 rounded-2xl bg-card shadow-card border border-border px-3 py-2 flex items-center gap-2">
            <MapPin className="size-4 text-primary shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Your location
              </div>
              <div className="truncate text-[12px] font-semibold">
                {location
                  ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : destination}
              </div>
            </div>
          </div>
          <div className="absolute left-[52%] top-[42%] size-10 rounded-full bg-primary shadow-emerald flex items-center justify-center text-white text-lg animate-pulse">
            🛵
          </div>
          {locationError && (
            <div className="absolute left-4 bottom-4 rounded-xl bg-card/95 px-3 py-2 text-[11px] text-muted-foreground">
              {locationError}
            </div>
          )}
        </div>

        <section className="mt-5 rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="size-12 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-white flex items-center justify-center font-bold">
            {rider?.name?.[0] || "M"}
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-semibold">
              {rider?.name || "Martify delivery partner"}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {rider
                ? `★ ${rider.rating?.toFixed(1) || "4.9"} · Your assigned rider`
                : "Rider details will appear after dispatch."}
            </div>
          </div>
          {rider?.phone && (
            <a
              href={`tel:${rider.phone}`}
              aria-label={`Call ${rider.name}`}
              className="size-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
            >
              <Phone className="size-4" />
            </a>
          )}
        </section>

        <section className="mt-5 rounded-2xl bg-card border border-border p-4">
          {stepLabels.map((label, index) => {
            const done = delivered ? true : index < activeStep;
            const current = !delivered && index === activeStep;
            return (
              <div key={label} className="flex gap-3 relative">
                <div className="flex flex-col items-center">
                  <div
                    className={`size-6 rounded-full flex items-center justify-center border-2 z-10 ${done ? "bg-primary border-primary" : "bg-card border-border"} ${current ? "ring-4 ring-primary/20 border-primary" : ""}`}
                  >
                    {done && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
                  </div>
                  {index < stepLabels.length - 1 && (
                    <div className={`w-0.5 h-9 ${done ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
                <div className="pb-5 flex-1">
                  <div
                    className={`text-[13px] font-semibold ${done || current ? "" : "text-muted-foreground"}`}
                  >
                    {label}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {current ? "In progress" : done ? "Completed" : "Pending"}
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <div className="mt-5 rounded-2xl bg-primary-soft/60 border border-primary/10 p-4 flex gap-3">
          <div className="size-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shadow-emerald shrink-0">
            <Sparkles className="size-4" />
          </div>
          <p className="text-[13px] leading-relaxed">
            <span className="font-semibold">Delivery window:</span>{" "}
            <span className="text-muted-foreground">
              {windowLabel(order.deliveryWindow)}. We’ll keep this page updated as your order
              progresses.
            </span>
          </p>
        </div>
        <Link
          to="/shop"
          className="mt-6 flex items-center justify-center h-12 rounded-2xl bg-secondary text-foreground font-semibold text-sm"
        >
          Continue shopping
        </Link>
      </div>
    </StoreLayout>
  );
}

function statusStep(status: Order["status"]) {
  return status === "delivered"
    ? 3
    : status === "out_for_delivery"
      ? 2
      : status === "picking"
        ? 1
        : 1;
}
function deliveryEstimate(order: Order) {
  const hours = order.deliveryWindow === "60min" ? 1 : order.deliveryWindow === "evening" ? 6 : 2;
  return new Date(new Date(order.placedAt).getTime() + hours * 60 * 60 * 1000);
}
function formatDateTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}
function windowLabel(window?: Order["deliveryWindow"]) {
  return window === "60min"
    ? "Within 60 minutes"
    : window === "evening"
      ? "Six hours from order time"
      : "Two-hour delivery window";
}
