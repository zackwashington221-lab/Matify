import { Router } from "express";
import { InventoryItem, StockMovement } from "../models/index.js";
import { asyncHandler } from "../middleware/error.js";
import { requireAdmin, requireWriteAdmin } from "../middleware/auth.js";
import { crudRouter, audit } from "../utils/crud.js";

const router = Router();

router.get(
  "/low-stock",
  requireAdmin,
  asyncHandler(async (_req, res) => {
    const items = await InventoryItem.find().populate("product");
    res.json({ data: items.filter((i) => i.onHand - i.reserved <= i.reorderPoint) });
  })
);

router.post(
  "/:id/adjust",
  requireWriteAdmin,
  asyncHandler(async (req, res) => {
    const { delta, reason = "adjustment", note } = req.body;
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Inventory item not found" });
    item.onHand = Math.max(0, item.onHand + Number(delta || 0));
    item.lastCountedAt = new Date();
    await item.save();
    await StockMovement.create({ inventory: item._id, delta: Number(delta), reason, note, actor: req.user.name });
    await audit(req, "inventory.adjusted", item);
    res.json({ data: item });
  })
);

router.post(
  "/:id/reorder",
  requireWriteAdmin,
  asyncHandler(async (req, res) => {
    const item = await InventoryItem.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Inventory item not found" });
    const qty = Number(req.body.qty) || item.reorderQty;
    item.onHand += qty;
    await item.save();
    await StockMovement.create({ inventory: item._id, delta: qty, reason: "restock", actor: req.user.name });
    await audit(req, "inventory.reordered", item);
    res.json({ data: item });
  })
);

router.get(
  "/:id/movements",
  requireAdmin,
  asyncHandler(async (req, res) => {
    res.json({ data: await StockMovement.find({ inventory: req.params.id }).sort("-createdAt").limit(100) });
  })
);

router.use(
  "/",
  crudRouter(InventoryItem, {
    searchFields: ["sku", "supplier", "warehouse"],
    filterFields: ["warehouse", "supplier"],
    populate: "product",
    resourceName: "inventory",
  })
);

export default router;
