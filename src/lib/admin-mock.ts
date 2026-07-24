// Mock data for the admin panel. Shapes align with a future REST/RPC layer.

export type OrderStatus = "pending" | "packing" | "shipped" | "delivered" | "cancelled" | "refunded";

export type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  status: OrderStatus;
  payment: "paid" | "pending" | "failed" | "refunded";
  channel: "app" | "web" | "kiosk";
  placedAt: string; // ISO
};

const names = ["Alex Morgan","Priya Patel","James Chen","Sofia Rossi","Mika Tanaka","Diego Alvarez","Yuki Sato","Emma Wilson","Noah Bennett","Ava Thompson","Liam Carter","Olivia Nguyen","Ethan Brown","Mia Rodriguez","Lucas Kim","Isabella Costa","Mason Lee","Charlotte Silva","Henry Adams","Amelia Wright"];

function iso(daysAgo: number, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

const statuses: OrderStatus[] = ["pending","packing","shipped","delivered","cancelled","refunded"];
const payments: Order["payment"][] = ["paid","paid","paid","paid","pending","failed","refunded"];
const channels: Order["channel"][] = ["app","app","web","kiosk"];

export const orders: Order[] = Array.from({ length: 42 }, (_, i) => {
  const name = names[i % names.length];
  return {
    id: `FR-${4820 - i}`,
    customer: name,
    email: name.toLowerCase().replace(" ", ".") + "@mail.com",
    total: Math.round((15 + Math.random() * 180) * 100) / 100,
    items: Math.floor(3 + Math.random() * 22),
    status: statuses[i % statuses.length],
    payment: payments[i % payments.length],
    channel: channels[i % channels.length],
    placedAt: iso(Math.floor(i / 3), 9 + (i % 12)),
  };
});

export type Customer = {
  id: string;
  name: string;
  email: string;
  tier: "New" | "Silver" | "Gold" | "Platinum";
  orders: number;
  ltv: number;
  aov: number;
  risk: "low" | "medium" | "high";
  joinedAt: string;
  location: string;
};

const tiers: Customer["tier"][] = ["New","Silver","Gold","Platinum"];
const risks: Customer["risk"][] = ["low","low","low","medium","medium","high"];
const cities = ["New York","San Francisco","Los Angeles","Chicago","Miami","Seattle","Boston","Austin"];

export const customers: Customer[] = Array.from({ length: 28 }, (_, i) => {
  const name = names[i % names.length];
  const orders = Math.floor(1 + Math.random() * 90);
  const aov = 25 + Math.random() * 40;
  return {
    id: `CU-${1000 + i}`,
    name,
    email: name.toLowerCase().replace(" ", ".") + "@mail.com",
    tier: tiers[Math.min(3, Math.floor(orders / 25))],
    orders,
    ltv: Math.round(orders * aov * 100) / 100,
    aov: Math.round(aov * 100) / 100,
    risk: risks[i % risks.length],
    joinedAt: iso(30 + i * 4, 12),
    location: cities[i % cities.length],
  };
});

export type Campaign = {
  id: string;
  name: string;
  type: "coupon" | "flash" | "bundle" | "referral" | "cashback";
  code?: string;
  status: "live" | "scheduled" | "ended" | "draft";
  discount: string;
  redemptions: number;
  revenue: number;
  startsAt: string;
  endsAt: string;
};

export const campaigns: Campaign[] = [
  { id: "C-01", name: "Weekend Fresh Fridays", type: "coupon", code: "FRESH20", status: "live", discount: "20% off produce", redemptions: 1284, revenue: 18420, startsAt: iso(2), endsAt: iso(-5) },
  { id: "C-02", name: "Sunday Basket Boost", type: "coupon", code: "BOOST10", status: "scheduled", discount: "$10 off $60", redemptions: 0, revenue: 0, startsAt: iso(-1), endsAt: iso(-8) },
  { id: "C-03", name: "First order welcome", type: "coupon", code: "WELCOME15", status: "live", discount: "15% off first order", redemptions: 3120, revenue: 42800, startsAt: iso(30), endsAt: iso(-90) },
  { id: "C-04", name: "Flash: Salmon 30% off", type: "flash", status: "live", discount: "30% off salmon", redemptions: 214, revenue: 4210, startsAt: iso(0, 10), endsAt: iso(0, 18) },
  { id: "C-05", name: "Meal-plan bundle", type: "bundle", status: "live", discount: "3 meals from $19", redemptions: 892, revenue: 22100, startsAt: iso(10), endsAt: iso(-20) },
  { id: "C-06", name: "Refer a friend", type: "referral", status: "live", discount: "$10 for each", redemptions: 480, revenue: 9840, startsAt: iso(60), endsAt: iso(-30) },
  { id: "C-07", name: "Loyalty cashback", type: "cashback", status: "live", discount: "5% back", redemptions: 2140, revenue: 15300, startsAt: iso(90), endsAt: iso(-60) },
  { id: "C-08", name: "Holiday early bird", type: "coupon", code: "HOLIDAY", status: "draft", discount: "25% off", redemptions: 0, revenue: 0, startsAt: iso(-14), endsAt: iso(-21) },
  { id: "C-09", name: "Winter clearance", type: "flash", status: "ended", discount: "40% off frozen", redemptions: 620, revenue: 8410, startsAt: iso(45), endsAt: iso(38) },
];

export type Banner = {
  id: string;
  slot: number;
  title: string;
  subtitle: string;
  gradient: string;
  status: "live" | "draft" | "scheduled" | "expired";
  ctr: string;
  clicks: number;
  audience: string;
  startsAt: string;
  endsAt: string;
};

export const banners: Banner[] = [
  { id: "B-01", slot: 1, title: "Weekend Fresh Fridays", subtitle: "20% off produce", gradient: "from-emerald-400 to-teal-500", status: "live", ctr: "3.2%", clicks: 4210, audience: "All shoppers", startsAt: iso(2), endsAt: iso(-5) },
  { id: "B-02", slot: 2, title: "Sunday Basket Boost", subtitle: "Extra $10 off $60", gradient: "from-sky-400 to-indigo-500", status: "scheduled", ctr: "—", clicks: 0, audience: "Repeat buyers", startsAt: iso(-1), endsAt: iso(-8) },
  { id: "B-03", slot: 3, title: "Meal-plan bundle", subtitle: "AI plans starting $19", gradient: "from-amber-400 to-orange-500", status: "live", ctr: "2.4%", clicks: 2810, audience: "New shoppers", startsAt: iso(10), endsAt: iso(-30) },
  { id: "B-04", slot: 4, title: "New shopper welcome", subtitle: "15% off first order", gradient: "from-rose-400 to-pink-500", status: "live", ctr: "5.1%", clicks: 6420, audience: "Guests", startsAt: iso(60), endsAt: iso(-60) },
  { id: "B-05", slot: 5, title: "Late-summer clearance", subtitle: "Up to 40% off", gradient: "from-violet-400 to-fuchsia-500", status: "expired", ctr: "1.8%", clicks: 940, audience: "All shoppers", startsAt: iso(90), endsAt: iso(60) },
];

export type NotificationTemplate = {
  id: string;
  name: string;
  channel: "push" | "email" | "sms" | "in-app";
  audience: string;
  status: "active" | "paused" | "draft";
  sent: number;
  openRate: string;
  ctr: string;
  updatedAt: string;
};

export const notificationTemplates: NotificationTemplate[] = [
  { id: "N-01", name: "Order shipped", channel: "push", audience: "Order recipients", status: "active", sent: 12480, openRate: "62%", ctr: "18%", updatedAt: iso(4) },
  { id: "N-02", name: "Weekly picks", channel: "email", audience: "Weekly buyers", status: "active", sent: 8920, openRate: "44%", ctr: "12%", updatedAt: iso(2) },
  { id: "N-03", name: "Cart abandoned", channel: "push", audience: "Cart 24h", status: "active", sent: 3420, openRate: "38%", ctr: "9%", updatedAt: iso(1) },
  { id: "N-04", name: "Low stock alert", channel: "sms", audience: "Ops team", status: "active", sent: 84, openRate: "—", ctr: "—", updatedAt: iso(0) },
  { id: "N-05", name: "Loyalty reward earned", channel: "in-app", audience: "Gold+", status: "paused", sent: 620, openRate: "72%", ctr: "24%", updatedAt: iso(10) },
  { id: "N-06", name: "Reorder reminder", channel: "email", audience: "Frequent buyers", status: "draft", sent: 0, openRate: "—", ctr: "—", updatedAt: iso(6) },
];

export type AiAgent = {
  id: string;
  name: string;
  role: string;
  status: "on" | "off" | "learning";
  model: string;
  tokens: number;
  cost: number;
  successRate: string;
  lastRun: string;
};

export const aiAgents: AiAgent[] = [
  { id: "A-01", name: "Auto Restock", role: "Predicts and drafts POs", status: "on", model: "gpt-5.5", tokens: 128_400, cost: 3.12, successRate: "94%", lastRun: iso(0, 8) },
  { id: "A-02", name: "Smart Pricing", role: "Dynamic price suggestions", status: "learning", model: "gpt-5.5", tokens: 96_200, cost: 2.28, successRate: "88%", lastRun: iso(0, 7) },
  { id: "A-03", name: "Demand Forecast", role: "14-day demand curves", status: "on", model: "gpt-5.5", tokens: 210_100, cost: 5.42, successRate: "91%", lastRun: iso(0, 6) },
  { id: "A-04", name: "Retention Copilot", role: "Churn scoring + offers", status: "on", model: "gpt-5.5", tokens: 74_300, cost: 1.81, successRate: "82%", lastRun: iso(1, 22) },
  { id: "A-05", name: "Search Ranker", role: "Personalized search sort", status: "on", model: "gpt-5.5", tokens: 402_800, cost: 8.94, successRate: "96%", lastRun: iso(0, 9) },
  { id: "A-06", name: "Description Writer", role: "Product copy + SEO", status: "off", model: "gpt-5.5", tokens: 18_400, cost: 0.42, successRate: "—", lastRun: iso(5) },
];

// Revenue time series for charts
export const revenueSeries = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  revenue: Math.round(3400 + Math.sin(i / 3) * 900 + Math.random() * 700),
  orders: Math.round(80 + Math.sin(i / 4) * 25 + Math.random() * 15),
}));

export const weeklyBars = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => ({
  day: d,
  thisWeek: Math.round(3800 + Math.sin(i) * 900 + Math.random() * 500),
  lastWeek: Math.round(3400 + Math.cos(i) * 800 + Math.random() * 400),
}));

export const categoryShare = [
  { name: "Produce", value: 34, color: "hsl(155 50% 45%)" },
  { name: "Dairy & Eggs", value: 22, color: "hsl(200 60% 55%)" },
  { name: "Bakery", value: 18, color: "hsl(35 85% 55%)" },
  { name: "Seafood", value: 14, color: "hsl(0 70% 55%)" },
  { name: "Pantry", value: 12, color: "hsl(265 55% 60%)" },
];

export const statusTone: Record<OrderStatus, "success" | "info" | "warning" | "danger" | "muted"> = {
  pending: "warning",
  packing: "info",
  shipped: "info",
  delivered: "success",
  cancelled: "danger",
  refunded: "muted",
};

export const paymentTone: Record<Order["payment"], "success" | "warning" | "danger" | "muted"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
  refunded: "muted",
};
