import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import {
  User, Role, ApiKey, Integration, Category, Product, InventoryItem, Customer, Order,
  ReturnCase, Promotion, Banner, Notification, AiAgent, ScheduledReport, Setting, AuditLog,
} from "./models/index.js";

const daysAgo = (n, h = 10) => new Date(Date.now() - n * 864e5 - h * 36e5);
const pick = (arr, i) => arr[i % arr.length];
const round = (n) => Math.round(n * 100) / 100;

const CATEGORIES = [
  { slug: "produce", name: "Produce", emoji: "🥬", sortOrder: 1 },
  { slug: "bakery", name: "Bakery", emoji: "🥖", sortOrder: 2 },
  { slug: "dairy", name: "Dairy & Eggs", emoji: "🥛", sortOrder: 3 },
  { slug: "seafood", name: "Meat & Seafood", emoji: "🐟", sortOrder: 4 },
  { slug: "pantry", name: "Pantry", emoji: "🫙", sortOrder: 5 },
  { slug: "snacks", name: "Snacks", emoji: "🍫", sortOrder: 6 },
];

const PRODUCTS = [
  ["avocado", "Hass Avocados", "Sunrise Farms", 1.49, 1.99, "each", "🥑", "produce", 4.8, 1240, "Healthier pick", true],
  ["strawberry", "Organic Strawberries", "Berry Good", 4.99, null, "1 lb", "🍓", "produce", 4.9, 890, "In season", true],
  ["banana", "Bananas", "Sunrise Farms", 0.59, null, "per lb", "🍌", "produce", 4.7, 3420, null, false],
  ["sourdough", "Artisan Sourdough", "Levain Bakery", 6.5, null, "1 loaf", "🥖", "bakery", 4.9, 512, "Frequent buy", false],
  ["salmon", "Wild Atlantic Salmon", "Ocean Fresh", 14.99, null, "1 lb fillet", "🐟", "seafood", 4.8, 340, "High protein", false],
  ["eggs", "Free-Range Eggs", "Green Meadow", 5.49, 6.99, "12 count", "🥚", "dairy", 4.9, 2100, null, true],
  ["milk", "Oat Milk Barista", "Oatly", 4.99, null, "1 qt", "🥛", "dairy", 4.8, 1580, "You buy weekly", false],
  ["tomato", "Vine Tomatoes", "Sunrise Farms", 3.29, null, "1 lb", "🍅", "produce", 4.6, 720, null, false],
  ["coffee", "Single Origin Coffee", "Blue Bottle", 18, null, "12 oz beans", "☕", "pantry", 4.9, 980, "Try this", false],
  ["chocolate", "Dark Chocolate 72%", "Tony's", 4.5, null, "180g bar", "🍫", "snacks", 4.9, 1120, null, false],
  ["kale", "Organic Kale", "Green Meadow", 2.99, null, "1 bunch", "🥬", "produce", 4.5, 210, "Healthier pick", true],
  ["pasta", "Bronze-Cut Pasta", "Rustichella", 5.99, null, "500g", "🍝", "pantry", 4.8, 640, null, false],
];

async function run() {
  await connectDB();
  const models = [User, Role, ApiKey, Integration, Category, Product, InventoryItem, Customer, Order, ReturnCase,
    Promotion, Banner, Notification, AiAgent, ScheduledReport, Setting, AuditLog];
  const reset = process.argv.includes("--reset");
  const existingDocuments = (await Promise.all(models.map((Model) => Model.estimatedDocumentCount()))).reduce((total, count) => total + count, 0);

  if (existingDocuments > 0 && !reset) {
    console.log(`[seed] skipped — database already contains ${existingDocuments} documents. Use npm run seed:reset to replace them.`);
    await mongoose.disconnect();
    return;
  }

  if (reset) {
    console.log("[seed] reset requested — clearing demo collections…");
    await Promise.all(models.map((Model) => Model.deleteMany({})));
  } else {
    console.log("[seed] empty database detected — loading demonstration data…");
  }

  /* users & roles */
  const hash = await bcrypt.hash("Password123!", 10);
  const staff = await User.insertMany([
    { name: "Amara Osei", email: "amara@martify.io", role: "Owner", passwordHash: hash, mfaEnabled: true },
    { name: "Daniel Reyes", email: "daniel@martify.io", role: "Admin", passwordHash: hash, mfaEnabled: true },
    { name: "Wei Zhang", email: "wei@martify.io", role: "Ops Manager", passwordHash: hash },
    { name: "Lena Fischer", email: "lena@martify.io", role: "Support", passwordHash: hash, mfaEnabled: true },
    { name: "Marco Bianchi", email: "marco@martify.io", role: "Analyst", passwordHash: hash, status: "invited" },
    { name: "Tom Becker", email: "tom@martify.io", role: "Read only", passwordHash: hash, status: "suspended" },
    { name: "Alex Morgan", email: "alex@example.com", role: "Customer", passwordHash: hash },
  ]);

  await Role.insertMany([
    { name: "Owner", description: "Unrestricted access including billing and role management.", matrix: { orders: ["View", "Edit", "Refund", "Cancel"], catalog: ["View", "Edit", "Publish", "Delete"], inventory: ["View", "Adjust", "Reorder", "Audit"], customers: ["View", "Edit", "Export", "Delete"], growth: ["View", "Edit", "Publish", "Delete"], platform: ["View", "Edit", "Billing", "Roles"] } },
    { name: "Admin", description: "Everything except billing and ownership transfer.", matrix: { orders: ["View", "Edit", "Refund", "Cancel"], catalog: ["View", "Edit", "Publish"], inventory: ["View", "Adjust", "Reorder"], customers: ["View", "Edit", "Export"], growth: ["View", "Edit", "Publish"], platform: ["View", "Edit", "Roles"] } },
    { name: "Ops Manager", description: "Fulfilment, inventory and supplier operations.", matrix: { orders: ["View", "Edit", "Cancel"], inventory: ["View", "Adjust", "Reorder", "Audit"], catalog: ["View", "Edit"] } },
    { name: "Support", description: "Customer care: order lookup, refunds within policy.", matrix: { orders: ["View", "Edit", "Refund"], customers: ["View", "Edit"] } },
    { name: "Analyst", description: "Read-only across data plus exports.", matrix: { orders: ["View"], customers: ["View", "Export"] } },
    { name: "Read only", description: "View dashboards, no mutations.", matrix: { orders: ["View"], catalog: ["View"] } },
  ]);

  await ApiKey.insertMany([
    { label: "Expo mobile app", prefix: "sk_live_9f2a", hash, scope: "write", environment: "production", lastUsedAt: daysAgo(0) },
    { label: "Warehouse scanner", prefix: "sk_live_41bd", hash, scope: "write", environment: "production", lastUsedAt: daysAgo(0, 3) },
    { label: "BI export job", prefix: "sk_live_77ce", hash, scope: "read", environment: "production", lastUsedAt: daysAgo(1) },
    { label: "Staging sandbox", prefix: "sk_test_10aa", hash, scope: "admin", environment: "staging", lastUsedAt: daysAgo(4) },
    { label: "Legacy POS bridge", prefix: "sk_live_02de", hash, scope: "write", environment: "production", status: "revoked" },
  ]);

  await Integration.insertMany([
    { name: "Stripe", category: "Payments", description: "Card, wallet and payout processing.", status: "connected", detail: "acct_1M…4Xa · live" },
    { name: "Twilio", category: "Messaging", description: "SMS order updates and OTP delivery.", status: "connected", detail: "12,480 msgs / 30d" },
    { name: "Onfleet", category: "Logistics", description: "Courier dispatch and route optimisation.", status: "error", detail: "Token expired 2d ago" },
    { name: "Segment", category: "Data", description: "Event pipeline to the warehouse.", status: "connected", detail: "42 events tracked" },
    { name: "OpenAI", category: "AI", description: "Assistant, copy generation and embeddings.", status: "connected", detail: "gpt-4.1-mini" },
    { name: "Klaviyo", category: "Messaging", description: "Lifecycle email and flows.", status: "available" },
    { name: "Shippo", category: "Logistics", description: "Label printing for parcel orders.", status: "available" },
    { name: "Snowflake", category: "Data", description: "Reverse ETL for cohort modelling.", status: "available" },
  ]);

  /* catalog */
  await Category.insertMany(CATEGORIES);
  const products = await Product.insertMany(
    PRODUCTS.map(([slug, name, brand, price, compareAt, unit, emoji, category, rating, reviews, aiTag, organic]) => ({
      slug, name, brand, price, compareAt: compareAt || undefined, unit, emoji, category, rating, reviews,
      aiTag: aiTag || undefined, organic, status: "active",
      description: `${name} from ${brand}. Sourced fresh and delivered within the hour.`,
    }))
  );

  const inventory = await InventoryItem.insertMany(
    products.map((p, i) => ({
      product: p._id,
      sku: `SKU-${2200 + i}`,
      onHand: 20 + i * 9,
      reserved: i % 5,
      reorderPoint: 15,
      reorderQty: 60,
      costPrice: round(p.price * 0.62),
      supplier: pick(["Sunrise Farms", "Metro Wholesale", "Ocean Fresh", "Green Meadow"], i),
      lastCountedAt: daysAgo(i % 7),
    }))
  );

  /* customers */
  const names = ["Alex Morgan", "Priya Patel", "James Chen", "Sofia Rossi", "Mika Tanaka", "Diego Alvarez", "Nina Kowalski", "Omar Haddad", "Grace Lee", "Ben Carter", "Iris Novak", "Luca Ferrari"];
  const customers = await Customer.insertMany(
    names.map((name, i) => ({
      name,
      email: `${name.split(" ")[0].toLowerCase()}@example.com`,
      phone: `+1 555 01${String(10 + i).padStart(2, "0")}`,
      tier: pick(["Bronze", "Silver", "Gold", "Platinum"], i),
      lifetimeValue: round(180 + i * 96.4),
      ordersCount: 3 + (i % 9),
      churnRisk: pick(["low", "low", "medium", "high"], i),
      city: pick(["New York", "San Francisco", "Chicago", "Miami", "Seattle", "Austin"], i),
      addresses: [{ label: "Home", line1: `${10 + i} Market St`, city: "New York", postcode: "10012", isDefault: true }],
      lastOrderAt: daysAgo(i % 14),
    }))
  );

  /* orders */
  const statuses = ["pending", "confirmed", "picking", "out_for_delivery", "delivered", "delivered", "cancelled"];
  const orders = [];
  for (let i = 0; i < 60; i++) {
    const lines = Array.from({ length: 1 + (i % 4) }, (_, k) => {
      const p = products[(i + k * 3) % products.length];
      return { product: p._id, name: p.name, qty: 1 + ((i + k) % 3), price: p.price };
    });
    const subtotal = round(lines.reduce((s, l) => s + l.price * l.qty, 0));
    const deliveryFee = subtotal > 45 ? 0 : 2.99;
    const status = pick(statuses, i);
    orders.push({
      reference: `FR-${4900 - i}`,
      customer: customers[i % customers.length]._id,
      items: lines,
      subtotal,
      deliveryFee,
      discount: i % 6 === 0 ? 5 : 0,
      total: round(subtotal + deliveryFee - (i % 6 === 0 ? 5 : 0)),
      status,
      paymentStatus: status === "cancelled" ? "refunded" : "paid",
      channel: pick(["app", "app", "web", "phone"], i),
      address: `${10 + i} Market St, New York`,
      courier: pick(["Maya R.", "Jon K.", "Ade T.", "Sara P."], i),
      placedAt: daysAgo(i % 30, i % 12),
      deliveredAt: status === "delivered" ? daysAgo(i % 30, (i % 12) - 1) : undefined,
      timeline: [{ label: "Order placed", at: daysAgo(i % 30, i % 12) }],
    });
  }
  const savedOrders = await Order.insertMany(orders);

  await ReturnCase.insertMany(
    Array.from({ length: 14 }, (_, i) => ({
      reference: `RT-${320 - i}`,
      order: savedOrders[i]._id,
      customer: customers[i % customers.length]._id,
      reason: pick(["Damaged", "Missing item", "Late delivery", "Quality", "Wrong item"], i),
      items: 1 + (i % 3),
      amount: round(8 + i * 4.3),
      status: pick(["requested", "approved", "refunded", "rejected"], i),
    }))
  );

  /* growth */
  await Promotion.insertMany([
    { code: "FRESH20", name: "New customer 20% off", type: "percent", value: 20, minSpend: 25, usageLimit: 5000, usedCount: 3120, status: "active", audience: "new", startsAt: daysAgo(30), endsAt: daysAgo(-30) },
    { code: "FREESHIP", name: "Free delivery weekend", type: "free_delivery", value: 0, minSpend: 30, usedCount: 890, status: "active", startsAt: daysAgo(4), endsAt: daysAgo(-3) },
    { code: "SALMON30", name: "Flash: Salmon 30% off", type: "percent", value: 30, usedCount: 412, status: "ended", startsAt: daysAgo(20), endsAt: daysAgo(13) },
    { code: "BASKET5", name: "$5 off Sunday basket", type: "fixed", value: 5, minSpend: 40, usedCount: 0, status: "scheduled", startsAt: daysAgo(-2), endsAt: daysAgo(-9) },
  ]);

  await Banner.insertMany([
    { title: "Sunday Basket", subtitle: "Everything for the week, one tap", slot: 1, ctaLabel: "Shop basket", ctaHref: "/search?q=basket", status: "live", impressions: 128400, clicks: 9120, startsAt: daysAgo(10) },
    { title: "Peak-season berries", subtitle: "Picked this morning", slot: 2, ctaLabel: "Browse produce", ctaHref: "/search?category=produce", status: "live", impressions: 96200, clicks: 7410, startsAt: daysAgo(6) },
    { title: "Pantry restock", subtitle: "Save 15% on staples", slot: 3, ctaLabel: "Save now", status: "scheduled", startsAt: daysAgo(-3) },
    { title: "Winter warmers", subtitle: "Soups & broths", slot: 4, status: "archived", impressions: 44100, clicks: 2100 },
  ]);

  await Notification.insertMany([
    { title: "Your order is on the way", body: "FR-4899 arrives in 20 min", channel: "push", category: "orders", status: "sent", sentAt: daysAgo(0, 2), stats: { delivered: 8420, opened: 5210, clicked: 1840 } },
    { title: "Weekend free delivery", body: "No fees on orders over $30", channel: "push", category: "growth", status: "sent", sentAt: daysAgo(2), stats: { delivered: 22140, opened: 9810, clicked: 3120 } },
    { title: "Low stock alert", body: "12 SKUs below reorder point", channel: "inapp", category: "inventory", status: "sent", sentAt: daysAgo(0, 5) },
    { title: "Spring produce teaser", body: "Draft copy pending review", channel: "email", category: "growth", status: "draft" },
    { title: "Loyalty double points", body: "Earn 2x this week", channel: "sms", category: "growth", status: "scheduled", scheduledFor: daysAgo(-1) },
  ]);

  await AiAgent.insertMany([
    { key: "auto-reorder", name: "Auto-reorder agent", purpose: "Raises purchase orders when stock dips below the reorder point.", enabled: true, autonomy: "approve", runsLast30d: 184, systemPrompt: "You manage grocery inventory replenishment." },
    { key: "smart-pricing", name: "Smart pricing", purpose: "Suggests markdowns for short-dated stock.", enabled: true, autonomy: "suggest", runsLast30d: 96, temperature: 0.2 },
    { key: "retention", name: "Retention copilot", purpose: "Detects churn risk and drafts win-back offers.", enabled: false, autonomy: "suggest", runsLast30d: 41 },
    { key: "shopper-assistant", name: "Shopper assistant", purpose: "In-app conversational meal planning and budgeting.", enabled: true, autonomy: "autonomous", runsLast30d: 12480, temperature: 0.6 },
  ]);

  await ScheduledReport.insertMany([
    { name: "Executive KPI digest", cadence: "Daily", recipients: ["amara@martify.io", "daniel@martify.io"], format: "PDF", nextRunAt: daysAgo(-1), status: "active" },
    { name: "Inventory reorder sheet", cadence: "Weekly", recipients: ["wei@martify.io"], format: "XLSX", nextRunAt: daysAgo(-3), status: "active" },
    { name: "Cohort retention model", cadence: "Monthly", recipients: ["marco@martify.io"], format: "CSV", nextRunAt: daysAgo(-12), status: "active" },
    { name: "Promo performance", cadence: "Weekly", recipients: ["daniel@martify.io"], format: "PDF", nextRunAt: daysAgo(-5), status: "paused" },
  ]);

  await Setting.insertMany([
    { key: "store.name", value: "Martify", group: "general" },
    { key: "delivery.radiusKm", value: 12, group: "delivery" },
    { key: "delivery.freeThreshold", value: 45, group: "delivery" },
    { key: "checkout.currency", value: "USD", group: "payments" },
    { key: "support.email", value: "help@martify.io", group: "general" },
  ]);

  await AuditLog.insertMany(
    [
      ["Amara Osei", "role.updated", "Support → refund limit $250", "critical"],
      ["Daniel Reyes", "product.published", "Organic Avocado 4pk", "info"],
      ["Wei Zhang", "inventory.adjusted", "SKU-2214 +180 units", "info"],
      ["Lena Fischer", "order.refunded", "FR-4790 · $48.20", "warning"],
      ["System", "ai.autoreorder", "12 SKUs reordered", "info"],
      ["Daniel Reyes", "apikey.created", "Mobile app (prod)", "critical"],
      ["Sana Iqbal", "customer.exported", "1,204 records", "warning"],
      ["Amara Osei", "settings.updated", "Delivery radius 12km", "info"],
    ].map(([actor, action, target, severity], i) => ({ actor, action, target, severity, ip: `10.24.8.${20 + i}` }))
  );

  console.log(`[seed] done — ${products.length} products, ${inventory.length} inventory rows, ${savedOrders.length} orders, ${staff.length} users`);
  console.log("[seed] admin login: amara@martify.io / Password123!");
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
