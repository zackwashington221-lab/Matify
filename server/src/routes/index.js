import { Router } from "express";
import authRoutes from "./auth.routes.js";
import storefrontRoutes from "./storefront.routes.js";
import ordersRoutes from "./orders.routes.js";
import inventoryRoutes from "./inventory.routes.js";
import analyticsRoutes from "./analytics.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import teamRoutes from "./team.routes.js";
import mobileRoutes from "./mobile.routes.js";
import { crudRouter } from "../utils/crud.js";
import { requireAdmin, requireAuth, requireRole } from "../middleware/auth.js";
import {
  Product, Category, Customer, Promotion, Banner, Notification, AiAgent, AiRun,
  User, Role, ApiKey, AuditLog, Integration, ReturnCase, ScheduledReport, Setting,
} from "../models/index.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true, uptime: process.uptime() }));

// public + customer app
router.use("/auth", authRoutes);
router.use("/storefront", storefrontRoutes);
router.use("/mobile", mobileRoutes);

// commerce
router.use("/products", crudRouter(Product, {
  searchFields: ["name", "brand", "slug", "tags"],
  filterFields: ["category", "status"],
  resourceName: "product",
}));
router.use("/categories", crudRouter(Category, { searchFields: ["name", "slug"], defaultSort: "sortOrder" }));
router.use("/inventory", inventoryRoutes);
router.use("/orders", ordersRoutes);
router.use("/returns", crudRouter(ReturnCase, {
  searchFields: ["reference"],
  filterFields: ["status", "reason"],
  populate: "customer order",
  resourceName: "return",
}));
router.use("/customers", crudRouter(Customer, {
  searchFields: ["name", "email", "phone", "city"],
  filterFields: ["tier", "churnRisk"],
  resourceName: "customer",
}));

// growth
router.use("/promotions", crudRouter(Promotion, { searchFields: ["code", "name"], filterFields: ["status", "type"], resourceName: "promotion" }));
router.use("/banners", crudRouter(Banner, { searchFields: ["title", "subtitle"], filterFields: ["status"], defaultSort: "slot", resourceName: "banner" }));
router.use("/notifications", notificationsRoutes);

// analytics & reporting
router.use("/analytics", analyticsRoutes);
router.use("/reports", crudRouter(ScheduledReport, { searchFields: ["name"], filterFields: ["status", "cadence"], resourceName: "report" }));

// AI
router.use("/ai/agents", crudRouter(AiAgent, { searchFields: ["name", "key", "purpose"], resourceName: "aiagent" }));
router.use("/ai/runs", crudRouter(AiRun, { populate: "agent", filterFields: ["status"], resourceName: "airun" }));

// administration
router.use("/team", teamRoutes);
router.use("/roles", crudRouter(Role, { searchFields: ["name"], writeGuard: [requireAuth, requireRole("Owner", "Admin")], resourceName: "role" }));
router.use("/api-keys", crudRouter(ApiKey, {
  searchFields: ["label", "prefix"],
  filterFields: ["environment", "status", "scope"],
  writeGuard: [requireAuth, requireRole("Owner", "Admin")],
  resourceName: "apikey",
}));
router.use("/integrations", crudRouter(Integration, { searchFields: ["name"], filterFields: ["category", "status"], resourceName: "integration" }));
router.use("/settings", crudRouter(Setting, { searchFields: ["key"], filterFields: ["group"], resourceName: "setting" }));

// audit log is append-only: read via crud GETs, writes happen server-side
router.get("/audit", ...requireAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(200, Number(req.query.limit) || 50);
    const query = {};
    if (req.query.severity && req.query.severity !== "all") query.severity = req.query.severity;
    res.json({ data: await AuditLog.find(query).sort("-createdAt").limit(limit) });
  } catch (e) {
    next(e);
  }
});

export default router;
