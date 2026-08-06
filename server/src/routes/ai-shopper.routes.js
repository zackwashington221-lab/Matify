import { Router } from "express";
import { z } from "zod";
import { Product } from "../models/index.js";
import { asyncHandler } from "../middleware/error.js";
import { getShoppingAdvice } from "../services/gemini-shopper.js";

const router = Router();
const requestSchema = z.object({
  message: z.string().trim().min(1).max(1_000),
  budget: z.number().positive().max(10_000).optional(),
});

// This advice is catalogue-only, so guest shoppers can use it from the public web store.
// Signed-in mobile customers additionally receive recommendations based on saved preferences.
router.post("/shopper", asyncHandler(async (req, res) => {
  const { message, budget } = requestSchema.parse(req.body);
  const products = await Product.find({ status: "active" }).sort("name").lean();
  const advice = await getShoppingAdvice({ message, products, budget: budget ?? budgetFromMessage(message), preferences: req.user?.preferences });
  res.json({ data: advice });
}));

function budgetFromMessage(message) {
  const match = message.match(/(?:under|within|budget(?:\s+of)?)\s*\$?\s*(\d+(?:\.\d{1,2})?)|for\s*\$\s*(\d+(?:\.\d{1,2})?)/i);
  return match ? Number(match[1] || match[2]) : undefined;
}

export default router;
