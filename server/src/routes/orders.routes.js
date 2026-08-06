import { Router } from "express";
import { z } from "zod";
import { Order, Customer, Product, InventoryItem, StockMovement, ORDER_STATUSES } from "../models/index.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAuth, requireAdmin, requireWriteAdmin } from "../middleware/auth.js";
import { crudRouter, audit } from "../utils/crud.js";

const router = Router();
const checkoutSchema = z.object({
  items: z.array(z.object({ product: z.string().regex(/^[a-f\d]{24}$/i), qty: z.number().int().min(1).max(20) })).min(1).max(100),
  address: z.string().trim().min(8).max(500),
  deliverySlot: z.enum(["60min", "2h", "evening"]).default("2h"),
  paymentMethod: z.enum(["card", "wallet", "cash"]).default("cash"),
});

/* ---- customer-facing checkout (mobile app) ---- */
router.post(
  "/checkout",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { items, address, deliverySlot, paymentMethod } = checkoutSchema.parse(req.body);

    const products = await Product.find({ _id: { $in: items.map((i) => i.product) }, status: "active" });
    const lines = items.map((i) => {
      const p = products.find((x) => String(x._id) === String(i.product));
      if (!p) throw Object.assign(new Error("Unknown product in cart"), { status: 422 });
      return { product: p._id, name: p.name, qty: Math.max(1, Number(i.qty) || 1), price: p.price };
    });

    const inventory = await InventoryItem.find({ product: { $in: lines.map((line) => line.product) } });
    for (const line of lines) {
      const stock = inventory.find((item) => String(item.product) === String(line.product));
      if (stock && stock.onHand - stock.reserved < line.qty) {
        throw Object.assign(new Error(`${line.name} does not have enough stock available`), { status: 422 });
      }
    }

    const subtotal = round(lines.reduce((s, l) => s + l.price * l.qty, 0));
    const deliveryFee = deliverySlot === "60min" || subtotal <= 35 ? 3.99 : 0;
    const discount = 0;
    const customer = await Customer.findOneAndUpdate(
      { email: req.user.email },
      { email: req.user.email, name: req.user.name, user: req.user._id },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const order = await Order.create({
      reference: `FR-${Math.floor(1000 + Math.random() * 8999)}`,
      customer: customer._id,
      items: lines,
      subtotal,
      deliveryFee,
      discount,
      total: round(subtotal + deliveryFee - discount),
      status: "confirmed",
      paymentStatus: "unpaid",
      paymentMethod,
      channel: "web",
      address,
      timeline: [{ label: "Order placed", at: new Date() }],
    });

    // reserve stock
    for (const line of lines) {
      const inv = inventory.find((item) => String(item.product) === String(line.product));
      if (inv) {
        inv.reserved += line.qty;
        await inv.save();
        await StockMovement.create({ inventory: inv._id, delta: -line.qty, reason: "sale", actor: req.user.name });
      }
    }

    await Customer.findByIdAndUpdate(customer._id, {
      $inc: { ordersCount: 1, lifetimeValue: order.total },
      lastOrderAt: new Date(),
    });
    req.user.cart = [];
    await req.user.save();

    res.status(201).json({ data: order });
  })
);

router.get(
  "/mine",
  requireAuth,
  asyncHandler(async (req, res) => {
    const customer = await Customer.findOne({ email: req.user.email });
    if (!customer) return res.json({ data: [] });
    res.json({ data: await Order.find({ customer: customer._id }).sort("-placedAt").limit(50) });
  })
);

/* ---- admin operations ---- */
router.post(
  "/manual",
  requireWriteAdmin,
  asyncHandler(async (req, res) => {
    const { customerId, items = [], address = "", deliveryFee = 2.99, channel = "web" } = req.body;
    if (!customerId || !items.length) return res.status(422).json({ error: "Customer and at least one item are required" });
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ error: "Customer not found" });

    const products = await Product.find({ _id: { $in: items.map((item) => item.productId) }, status: "active" });
    const lines = items.map((item) => {
      const product = products.find((candidate) => String(candidate._id) === String(item.productId));
      if (!product) throw Object.assign(new Error("An order item is unavailable"), { status: 422 });
      const qty = Math.max(1, Math.floor(Number(item.qty) || 1));
      return { product: product._id, name: product.name, qty, price: product.price };
    });
    const subtotal = round(lines.reduce((sum, line) => sum + line.price * line.qty, 0));
    const order = await Order.create({
      reference: `FR-${Date.now().toString().slice(-7)}`,
      customer: customer._id,
      items: lines,
      subtotal,
      deliveryFee: Math.max(0, Number(deliveryFee) || 0),
      total: round(subtotal + Math.max(0, Number(deliveryFee) || 0)),
      status: "pending",
      paymentStatus: "unpaid",
      channel: ["app", "web", "phone"].includes(channel) ? channel : "web",
      address,
      timeline: [{ label: "Order created by admin", at: new Date(), note: req.user.name }],
    });
    await audit(req, "order.created", order);
    res.status(201).json({ data: order });
  })
);

router.post(
  "/:id/status",
  requireWriteAdmin,
  asyncHandler(async (req, res) => {
    const { status, note } = req.body;
    if (!ORDER_STATUSES.includes(status)) return res.status(422).json({ error: "Invalid status" });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.status = status;
    order.timeline.push({ label: status.replace(/_/g, " "), at: new Date(), note });
    if (status === "delivered") order.deliveredAt = new Date();
    await order.save();
    await audit(req, "order.status_changed", order);
    res.json({ data: order });
  })
);

router.post(
  "/:id/refund",
  requireWriteAdmin,
  asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.paymentStatus = Number(amount) >= order.total ? "refunded" : "partially_refunded";
    order.timeline.push({ label: `Refunded $${Number(amount).toFixed(2)}`, at: new Date() });
    await order.save();
    await audit(req, "order.refunded", order, "warning");
    res.json({ data: order });
  })
);

router.get(
  "/stats/summary",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const [byStatus] = await Promise.all([
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 }, revenue: { $sum: "$total" } } }]),
    ]);
    res.json({ data: byStatus });
  })
);

router.use(
  "/",
  crudRouter(Order, {
    searchFields: ["reference", "address", "courier"],
    filterFields: ["status", "paymentStatus", "channel"],
    populate: "customer",
    defaultSort: "-placedAt",
    resourceName: "order",
  })
);

const round = (n) => Math.round(n * 100) / 100;

export default router;
