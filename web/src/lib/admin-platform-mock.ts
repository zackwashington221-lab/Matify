// Mock datasets for Administration + Analytics depth modules.

function iso(daysAgo: number, hour = 10) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 30, 0, 0);
  return d.toISOString();
}

export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Ops Manager" | "Support" | "Analyst" | "Read only";
  status: "active" | "invited" | "suspended";
  lastActive: string;
  mfa: boolean;
};

export const teamMembers: TeamMember[] = [
  { id: "U-01", name: "Amara Osei", email: "amara@martify.io", role: "Owner", status: "active", lastActive: iso(0, 9), mfa: true },
  { id: "U-02", name: "Daniel Reyes", email: "daniel@martify.io", role: "Admin", status: "active", lastActive: iso(0, 8), mfa: true },
  { id: "U-03", name: "Wei Zhang", email: "wei@martify.io", role: "Ops Manager", status: "active", lastActive: iso(1), mfa: false },
  { id: "U-04", name: "Lena Fischer", email: "lena@martify.io", role: "Support", status: "active", lastActive: iso(0, 11), mfa: true },
  { id: "U-05", name: "Marco Bianchi", email: "marco@martify.io", role: "Analyst", status: "invited", lastActive: iso(3), mfa: false },
  { id: "U-06", name: "Sana Iqbal", email: "sana@martify.io", role: "Support", status: "active", lastActive: iso(2), mfa: true },
  { id: "U-07", name: "Tom Becker", email: "tom@martify.io", role: "Read only", status: "suspended", lastActive: iso(21), mfa: false },
];

export const permissionGroups = [
  { key: "orders", label: "Orders", actions: ["View", "Edit", "Refund", "Cancel"] },
  { key: "catalog", label: "Catalog", actions: ["View", "Edit", "Publish", "Delete"] },
  { key: "inventory", label: "Inventory", actions: ["View", "Adjust", "Reorder", "Audit"] },
  { key: "customers", label: "Customers", actions: ["View", "Edit", "Export", "Delete"] },
  { key: "growth", label: "Growth", actions: ["View", "Edit", "Publish", "Delete"] },
  { key: "platform", label: "Platform", actions: ["View", "Edit", "Billing", "Roles"] },
] as const;

export type RoleName = "Owner" | "Admin" | "Ops Manager" | "Support" | "Analyst" | "Read only";

export const roles: { name: RoleName; description: string; members: number; matrix: Record<string, string[]> }[] = [
  { name: "Owner", description: "Unrestricted access including billing and role management.", members: 1,
    matrix: { orders: ["View","Edit","Refund","Cancel"], catalog: ["View","Edit","Publish","Delete"], inventory: ["View","Adjust","Reorder","Audit"], customers: ["View","Edit","Export","Delete"], growth: ["View","Edit","Publish","Delete"], platform: ["View","Edit","Billing","Roles"] } },
  { name: "Admin", description: "Everything except billing and ownership transfer.", members: 1,
    matrix: { orders: ["View","Edit","Refund","Cancel"], catalog: ["View","Edit","Publish","Delete"], inventory: ["View","Adjust","Reorder","Audit"], customers: ["View","Edit","Export"], growth: ["View","Edit","Publish"], platform: ["View","Edit","Roles"] } },
  { name: "Ops Manager", description: "Fulfilment, inventory and supplier operations.", members: 1,
    matrix: { orders: ["View","Edit","Cancel"], catalog: ["View","Edit"], inventory: ["View","Adjust","Reorder","Audit"], customers: ["View"], growth: ["View"], platform: ["View"] } },
  { name: "Support", description: "Customer care: order lookup, refunds within policy.", members: 2,
    matrix: { orders: ["View","Edit","Refund"], catalog: ["View"], inventory: ["View"], customers: ["View","Edit"], growth: ["View"], platform: [] } },
  { name: "Analyst", description: "Read-only across data plus exports and reports.", members: 1,
    matrix: { orders: ["View"], catalog: ["View"], inventory: ["View"], customers: ["View","Export"], growth: ["View"], platform: ["View"] } },
  { name: "Read only", description: "View dashboards, no mutations.", members: 1,
    matrix: { orders: ["View"], catalog: ["View"], inventory: ["View"], customers: ["View"], growth: ["View"], platform: [] } },
];

export type AuditEntry = {
  id: string;
  actor: string;
  action: string;
  target: string;
  severity: "info" | "warning" | "critical";
  ip: string;
  at: string;
};

const auditSeed: [string, string, string, AuditEntry["severity"]][] = [
  ["Amara Osei", "role.updated", "Support → refund limit $250", "critical"],
  ["Daniel Reyes", "product.published", "Organic Avocado 4pk", "info"],
  ["Wei Zhang", "inventory.adjusted", "SKU-2214 +180 units", "info"],
  ["Lena Fischer", "order.refunded", "FR-4790 · $48.20", "warning"],
  ["System", "ai.autoreorder", "12 SKUs reordered", "info"],
  ["Daniel Reyes", "apikey.created", "Mobile app (prod)", "critical"],
  ["Sana Iqbal", "customer.exported", "1,204 records", "warning"],
  ["Wei Zhang", "promotion.ended", "Flash: Salmon 30% off", "info"],
  ["Amara Osei", "member.invited", "marco@martify.io", "info"],
  ["System", "login.failed", "tom@martify.io ×5", "warning"],
  ["Daniel Reyes", "banner.scheduled", "Slot 2 · Sunday Basket", "info"],
  ["Amara Osei", "settings.updated", "Delivery radius 12km", "info"],
];

export const auditLog: AuditEntry[] = auditSeed.map(([actor, action, target, severity], i) => ({
  id: `A-${9000 - i}`,
  actor, action, target, severity,
  ip: `10.24.${8 + (i % 5)}.${20 + i}`,
  at: iso(Math.floor(i / 3), 18 - (i % 9)),
}));

export type ApiKey = {
  id: string;
  label: string;
  scope: "read" | "write" | "admin";
  prefix: string;
  environment: "production" | "staging";
  lastUsed: string;
  createdAt: string;
  status: "active" | "revoked";
};

export const apiKeys: ApiKey[] = [
  { id: "K-01", label: "Expo mobile app", scope: "write", prefix: "sk_live_9f2a", environment: "production", lastUsed: iso(0, 12), createdAt: iso(120), status: "active" },
  { id: "K-02", label: "Warehouse scanner", scope: "write", prefix: "sk_live_41bd", environment: "production", lastUsed: iso(0, 7), createdAt: iso(210), status: "active" },
  { id: "K-03", label: "BI export job", scope: "read", prefix: "sk_live_77ce", environment: "production", lastUsed: iso(1), createdAt: iso(60), status: "active" },
  { id: "K-04", label: "Staging sandbox", scope: "admin", prefix: "sk_test_10aa", environment: "staging", lastUsed: iso(4), createdAt: iso(45), status: "active" },
  { id: "K-05", label: "Legacy POS bridge", scope: "write", prefix: "sk_live_02de", environment: "production", lastUsed: iso(96), createdAt: iso(400), status: "revoked" },
];

export type Integration = {
  id: string;
  name: string;
  category: "Payments" | "Logistics" | "Messaging" | "Data" | "AI";
  description: string;
  status: "connected" | "available" | "error";
  detail?: string;
};

export const integrations: Integration[] = [
  { id: "I-01", name: "Stripe", category: "Payments", description: "Card, wallet and payout processing.", status: "connected", detail: "acct_1M…4Xa · live" },
  { id: "I-02", name: "Twilio", category: "Messaging", description: "SMS order updates and OTP delivery.", status: "connected", detail: "12,480 msgs / 30d" },
  { id: "I-03", name: "Onfleet", category: "Logistics", description: "Courier dispatch and route optimisation.", status: "error", detail: "Token expired 2d ago" },
  { id: "I-04", name: "Segment", category: "Data", description: "Event pipeline to the warehouse.", status: "connected", detail: "42 events tracked" },
  { id: "I-05", name: "OpenAI", category: "AI", description: "Assistant, copy generation and embeddings.", status: "connected", detail: "gpt-4.1-mini · 1.2M tok/mo" },
  { id: "I-06", name: "Klaviyo", category: "Messaging", description: "Lifecycle email and flows.", status: "available" },
  { id: "I-07", name: "Shippo", category: "Logistics", description: "Label printing for parcel orders.", status: "available" },
  { id: "I-08", name: "Snowflake", category: "Data", description: "Reverse ETL for cohort modelling.", status: "available" },
];

// ---- Analytics depth ----

export const cohorts = Array.from({ length: 8 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - (7 - i));
  const size = 820 + Math.round(Math.sin(i) * 180) + i * 60;
  const retention = Array.from({ length: 8 - i }, (_, m) =>
    m === 0 ? 100 : Math.max(9, Math.round(100 * Math.pow(0.72, m) + (i % 3) * 2))
  );
  return { label: d.toLocaleString("en", { month: "short", year: "2-digit" }), size, retention };
});

export const funnelSteps = [
  { step: "App opened", users: 48210 },
  { step: "Browsed category", users: 36140 },
  { step: "Added to cart", users: 19870 },
  { step: "Started checkout", users: 12420 },
  { step: "Paid", users: 9860 },
];

export const retentionCurve = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i}`,
  retained: Math.round(100 * Math.pow(0.87, i)),
  reactivated: Math.round(6 + Math.sin(i / 2) * 3),
}));

export const geoRows = [
  { region: "New York", orders: 12840, revenue: 486200, growth: "+14%", share: 24 },
  { region: "San Francisco", orders: 9120, revenue: 398400, growth: "+9%", share: 19 },
  { region: "Los Angeles", orders: 8640, revenue: 341800, growth: "+6%", share: 16 },
  { region: "Chicago", orders: 6210, revenue: 224600, growth: "+3%", share: 11 },
  { region: "Miami", orders: 4980, revenue: 187300, growth: "+21%", share: 9 },
  { region: "Seattle", orders: 4310, revenue: 162900, growth: "-2%", share: 8 },
  { region: "Boston", orders: 3820, revenue: 141200, growth: "+5%", share: 7 },
  { region: "Austin", orders: 3140, revenue: 118400, growth: "+18%", share: 6 },
];

export type ScheduledReport = {
  id: string;
  name: string;
  cadence: "Daily" | "Weekly" | "Monthly";
  recipients: number;
  format: "CSV" | "PDF" | "XLSX";
  nextRun: string;
  status: "active" | "paused";
};

export const scheduledReports: ScheduledReport[] = [
  { id: "R-01", name: "Executive KPI digest", cadence: "Daily", recipients: 6, format: "PDF", nextRun: "Tomorrow 07:00", status: "active" },
  { id: "R-02", name: "Inventory reorder sheet", cadence: "Weekly", recipients: 3, format: "XLSX", nextRun: "Mon 06:00", status: "active" },
  { id: "R-03", name: "Cohort retention model", cadence: "Monthly", recipients: 4, format: "CSV", nextRun: "1st 08:00", status: "active" },
  { id: "R-04", name: "Promo performance", cadence: "Weekly", recipients: 5, format: "PDF", nextRun: "Fri 17:00", status: "paused" },
];

// ---- Returns & refunds ----

export type ReturnCase = {
  id: string;
  orderId: string;
  customer: string;
  reason: "Damaged" | "Missing item" | "Late delivery" | "Quality" | "Wrong item";
  items: number;
  amount: number;
  status: "requested" | "approved" | "rejected" | "refunded";
  openedAt: string;
};

const reasons: ReturnCase["reason"][] = ["Damaged", "Missing item", "Late delivery", "Quality", "Wrong item"];
const rStatus: ReturnCase["status"][] = ["requested", "approved", "refunded", "rejected", "requested"];

export const returnCases: ReturnCase[] = Array.from({ length: 16 }, (_, i) => ({
  id: `RT-${320 - i}`,
  orderId: `FR-${4820 - i * 3}`,
  customer: ["Alex Morgan","Priya Patel","James Chen","Sofia Rossi","Mika Tanaka","Diego Alvarez"][i % 6],
  reason: reasons[i % reasons.length],
  items: 1 + (i % 4),
  amount: Math.round((8 + i * 4.3) * 100) / 100,
  status: rStatus[i % rStatus.length],
  openedAt: iso(Math.floor(i / 2), 14),
}));
