import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Check, LogOut, Package, Save, Settings, Sparkles } from "lucide-react";
import { StoreLayout } from "@/components/store/StoreLayout";
import { api, type CustomerPreferences, type Order } from "@/lib/api-client";
import { useCustomerSession } from "@/lib/customer-session";
import { PageLoader } from "@/components/store/LoadingState";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "You — Martify" },
      { name: "description", content: "Your Martify account, orders, and preferences." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, loading: sessionLoading, updateProfile, logout } = useCustomerSession();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [preferences, setPreferences] = useState<CustomerPreferences>({
    healthySwaps: false,
    budgetAlerts: false,
    weeklyBudget: 80,
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);
  useEffect(() => {
    if (!user) return;
    Promise.all([api.customer.orders(), api.customer.preferences()])
      .then(([orderResponse, preferenceResponse]) => {
        setOrders(orderResponse.data);
        setPreferences((current) => ({ ...current, ...preferenceResponse.data }));
      })
      .catch(() => setNotice("Some account details could not be refreshed."));
  }, [user]);

  if (sessionLoading)
    return (
      <StoreLayout>
        <PageLoader label="Loading your account" />
      </StoreLayout>
    );
  if (!user)
    return (
      <StoreLayout>
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Sign in to view your account</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Manage your Martify profile, orders, and shopping preferences.
          </p>
          <Link
            to="/auth"
            className="mt-6 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            Sign in
          </Link>
        </div>
      </StoreLayout>
    );

  const initials = user.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const latestOrder = orders[0];
  async function save() {
    if (!name.trim()) return setNotice("Your name cannot be empty.");
    setSaving(true);
    setNotice("");
    try {
      await Promise.all([updateProfile(name.trim()), api.customer.updatePreferences(preferences)]);
      setNotice("Your profile has been saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "We could not save your profile.");
    } finally {
      setSaving(false);
    }
  }
  function signOut() {
    logout();
    navigate({ to: "/" });
  }

  return (
    <StoreLayout>
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Your account</h1>
        <div className="mt-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white shadow-emerald">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-white/20 text-xl font-bold">
              {initials || "M"}
            </div>
            <div>
              <div className="text-lg font-semibold">{user.name}</div>
              <div className="text-sm text-emerald-100">{user.email}</div>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Stat value={String(orders.length)} label="Orders" />
            <Stat
              value={preferences.weeklyBudget ? `$${preferences.weeklyBudget}` : "—"}
              label="Weekly budget"
            />
          </div>
        </div>

        <section className="mt-6 rounded-3xl border border-border bg-card p-5">
          <h2 className="font-display text-lg font-bold">Profile details</h2>
          <label className="mt-4 block text-sm font-medium">
            Display name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </section>
        <section className="mt-5 rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="font-display text-lg font-bold">AI preferences</h2>
          </div>
          <Toggle
            label="Prefer healthier swaps"
            checked={Boolean(preferences.healthySwaps)}
            onChange={(healthySwaps) => setPreferences((current) => ({ ...current, healthySwaps }))}
          />
          <Toggle
            label="Budget alerts"
            checked={Boolean(preferences.budgetAlerts)}
            onChange={(budgetAlerts) => setPreferences((current) => ({ ...current, budgetAlerts }))}
          />
          <label className="mt-4 block text-sm font-medium">
            Weekly grocery budget
            <input
              type="number"
              min="1"
              value={preferences.weeklyBudget || ""}
              onChange={(event) =>
                setPreferences((current) => ({
                  ...current,
                  weeklyBudget: Number(event.target.value) || undefined,
                }))
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </label>
        </section>
        <section className="mt-5 rounded-3xl border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Package className="size-4 text-primary" />
            <h2 className="font-display text-lg font-bold">Recent orders</h2>
          </div>
          {latestOrder ? (
            <Link
              to="/tracking"
              className="mt-4 flex items-center justify-between rounded-2xl bg-secondary p-4 text-sm"
            >
              <span>
                <b>{latestOrder.reference}</b>
                <span className="ml-2 capitalize text-muted-foreground">
                  {latestOrder.status.replaceAll("_", " ")}
                </span>
              </span>
              <span className="font-semibold">${latestOrder.total.toFixed(2)}</span>
            </Link>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">You have no orders yet.</p>
          )}
        </section>
        {notice && <p className="mt-4 text-sm text-muted-foreground">{notice}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            <Save className="size-4" />
            {saving ? "Saving…" : "Save profile"}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
        <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
          <Bell className="size-3.5" />
          <Settings className="size-3.5" />
          Your session and preferences are saved securely.
        </div>
      </div>
    </StoreLayout>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="mt-4 flex cursor-pointer items-center justify-between text-sm">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`grid size-6 place-items-center rounded-md border ${checked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
      >
        {checked && <Check className="size-4" />}
      </button>
    </label>
  );
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl bg-white/15 p-3 text-center">
      <div className="font-bold">{value}</div>
      <div className="mt-0.5 text-[10px] uppercase tracking-wider text-emerald-100">{label}</div>
    </div>
  );
}
