import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
const opts = { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } };

const def = (name, definition, extra = {}) =>
  models[name] || model(name, new Schema(definition, { ...opts, ...extra }));

/* ---------------- Identity & access ---------------- */

export const ROLES = ["Owner", "Admin", "Ops Manager", "Support", "Analyst", "Read only", "Customer"];

export const User = def("User", {
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ROLES, default: "Customer", index: true },
  status: { type: String, enum: ["active", "invited", "suspended"], default: "active" },
  mfaEnabled: { type: Boolean, default: false },
  avatarUrl: String,
  lastActiveAt: Date,
  preferences: {
    healthySwaps: { type: Boolean, default: true },
    budgetAlerts: { type: Boolean, default: true },
    weeklyBudget: { type: Number, default: 120 },
    dietaryPreferences: { type: [String], default: [] },
  },
  paymentMethods: [{
    provider: { type: String, enum: ["stripe", "apple_pay", "google_pay"], required: true },
    providerPaymentMethodId: { type: String, required: true },
    brand: String,
    last4: String,
    isDefault: { type: Boolean, default: false },
  }],
  cart: [{
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1, max: 20 },
  }],
});

export const Role = def("Role", {
  name: { type: String, required: true, unique: true },
  description: String,
  matrix: { type: Schema.Types.Mixed, default: {} }, // { orders: ["View","Edit"], ... }
});

export const ApiKey = def("ApiKey", {
  label: { type: String, required: true },
  prefix: { type: String, required: true },
  hash: { type: String, required: true, select: false },
  scope: { type: String, enum: ["read", "write", "admin"], default: "read" },
  environment: { type: String, enum: ["production", "staging"], default: "staging" },
  status: { type: String, enum: ["active", "revoked"], default: "active" },
  lastUsedAt: Date,
});

export const AuditLog = def("AuditLog", {
  actor: String,
  actorId: { type: Schema.Types.ObjectId, ref: "User" },
  action: { type: String, required: true, index: true },
  target: String,
  severity: { type: String, enum: ["info", "warning", "critical"], default: "info" },
  ip: String,
  meta: Schema.Types.Mixed,
});

export const Integration = def("Integration", {
  name: { type: String, required: true },
  category: { type: String, enum: ["Payments", "Logistics", "Messaging", "Data", "AI"], required: true },
  description: String,
  status: { type: String, enum: ["connected", "available", "error"], default: "available" },
  detail: String,
  config: Schema.Types.Mixed,
});

/* ---------------- Catalog & inventory ---------------- */

export const Category = def("Category", {
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  emoji: String,
  sortOrder: { type: Number, default: 0 },
});

export const Product = def("Product", {
  slug: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: "text" },
  brand: String,
  description: String,
  price: { type: Number, required: true, min: 0 },
  compareAt: Number,
  unit: String,
  emoji: String,
  gradient: String,
  category: { type: String, index: true },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  aiTag: String,
  organic: { type: Boolean, default: false },
  status: { type: String, enum: ["draft", "active", "archived"], default: "active", index: true },
  tags: [String],
});

export const InventoryItem = def("InventoryItem", {
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  sku: { type: String, required: true, unique: true },
  warehouse: { type: String, default: "Main" },
  onHand: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 },
  reorderPoint: { type: Number, default: 10 },
  reorderQty: { type: Number, default: 50 },
  costPrice: Number,
  supplier: String,
  lastCountedAt: Date,
});

InventoryItem.schema?.virtual?.("available")?.get?.(function () {
  return Math.max(0, (this.onHand || 0) - (this.reserved || 0));
});

export const StockMovement = def("StockMovement", {
  inventory: { type: Schema.Types.ObjectId, ref: "InventoryItem", required: true, index: true },
  delta: { type: Number, required: true },
  reason: { type: String, enum: ["sale", "restock", "adjustment", "return", "shrinkage"], required: true },
  note: String,
  actor: String,
});

/* ---------------- Customers & orders ---------------- */

export const Customer = def("Customer", {
  user: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: String,
  tier: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], default: "Bronze" },
  lifetimeValue: { type: Number, default: 0 },
  ordersCount: { type: Number, default: 0 },
  churnRisk: { type: String, enum: ["low", "medium", "high"], default: "low" },
  city: String,
  addresses: [{ label: String, line1: String, city: String, postcode: String, isDefault: Boolean }],
  wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  lastOrderAt: Date,
});

const orderItem = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product" },
    name: String,
    qty: { type: Number, default: 1, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

export const ORDER_STATUSES = ["pending", "confirmed", "picking", "out_for_delivery", "delivered", "cancelled"];

export const Order = def("Order", {
  reference: { type: String, required: true, unique: true, index: true },
  customer: { type: Schema.Types.ObjectId, ref: "Customer", index: true },
  items: [orderItem],
  subtotal: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  status: { type: String, enum: ORDER_STATUSES, default: "pending", index: true },
  paymentStatus: { type: String, enum: ["unpaid", "paid", "refunded", "partially_refunded"], default: "unpaid" },
  channel: { type: String, enum: ["app", "web", "phone"], default: "app" },
  address: String,
  courier: String,
  placedAt: { type: Date, default: Date.now },
  deliveredAt: Date,
  timeline: [{ label: String, at: Date, note: String }],
});

export const ReturnCase = def("ReturnCase", {
  reference: { type: String, required: true, unique: true },
  order: { type: Schema.Types.ObjectId, ref: "Order", index: true },
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
  reason: { type: String, enum: ["Damaged", "Missing item", "Late delivery", "Quality", "Wrong item"], required: true },
  items: { type: Number, default: 1 },
  amount: { type: Number, default: 0 },
  status: { type: String, enum: ["requested", "approved", "rejected", "refunded"], default: "requested", index: true },
  resolutionNote: String,
});

/* ---------------- Growth ---------------- */

export const Promotion = def("Promotion", {
  code: { type: String, required: true, unique: true, uppercase: true },
  name: String,
  type: { type: String, enum: ["percent", "fixed", "free_delivery", "bogo"], default: "percent" },
  value: { type: Number, default: 0 },
  minSpend: { type: Number, default: 0 },
  usageLimit: Number,
  usedCount: { type: Number, default: 0 },
  audience: { type: String, default: "all" },
  startsAt: Date,
  endsAt: Date,
  status: { type: String, enum: ["draft", "scheduled", "active", "ended", "archived"], default: "draft", index: true },
});

export const Banner = def("Banner", {
  title: { type: String, required: true },
  subtitle: String,
  slot: { type: Number, default: 1 },
  imageUrl: String,
  ctaLabel: String,
  ctaHref: String,
  theme: String,
  startsAt: Date,
  endsAt: Date,
  status: { type: String, enum: ["draft", "scheduled", "live", "archived"], default: "draft", index: true },
  impressions: { type: Number, default: 0 },
  clicks: { type: Number, default: 0 },
});

export const Notification = def("Notification", {
  title: { type: String, required: true },
  body: String,
  channel: { type: String, enum: ["push", "sms", "email", "inapp"], default: "push" },
  audience: { type: String, default: "all" },
  category: { type: String, enum: ["orders", "inventory", "growth", "system", "ai"], default: "system", index: true },
  status: { type: String, enum: ["draft", "scheduled", "sent", "failed"], default: "draft" },
  scheduledFor: Date,
  sentAt: Date,
  stats: { delivered: Number, opened: Number, clicked: Number },
});

export const DeviceToken = def("DeviceToken", {
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  token: { type: String, required: true, unique: true },
  platform: { type: String, enum: ["ios", "android", "web"], default: "web" },
  active: { type: Boolean, default: true },
  lastSeenAt: { type: Date, default: Date.now },
});

export const UserNotification = def("UserNotification", {
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  campaign: { type: Schema.Types.ObjectId, ref: "Notification" },
  title: { type: String, required: true },
  body: String,
  category: String,
  channel: { type: String, default: "inapp" },
  readAt: Date,
});

/* ---------------- AI ---------------- */

export const AiAgent = def("AiAgent", {
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  purpose: String,
  model: { type: String, default: "gpt-4.1-mini" },
  temperature: { type: Number, default: 0.3 },
  systemPrompt: String,
  enabled: { type: Boolean, default: false },
  autonomy: { type: String, enum: ["suggest", "approve", "autonomous"], default: "suggest" },
  guardrails: Schema.Types.Mixed,
  runsLast30d: { type: Number, default: 0 },
});

export const AiRun = def("AiRun", {
  agent: { type: Schema.Types.ObjectId, ref: "AiAgent", index: true },
  input: Schema.Types.Mixed,
  output: Schema.Types.Mixed,
  status: { type: String, enum: ["ok", "error", "skipped"], default: "ok" },
  tokens: Number,
  durationMs: Number,
});

/* ---------------- Reporting ---------------- */

export const ScheduledReport = def("ScheduledReport", {
  name: { type: String, required: true },
  cadence: { type: String, enum: ["Daily", "Weekly", "Monthly"], default: "Weekly" },
  recipients: [String],
  format: { type: String, enum: ["CSV", "PDF", "XLSX"], default: "PDF" },
  nextRunAt: Date,
  status: { type: String, enum: ["active", "paused"], default: "active" },
});

export const Setting = def("Setting", {
  key: { type: String, required: true, unique: true },
  value: Schema.Types.Mixed,
  group: { type: String, default: "general" },
});
