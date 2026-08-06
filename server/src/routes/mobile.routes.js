import { Router } from "express";
import { z } from "zod";
import { Customer, Product } from "../models/index.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";

const router = Router();
router.use(requireAuth);

const addressSchema = z.object({
  label: z.string().trim().min(1).max(40),
  line1: z.string().trim().min(3).max(140),
  city: z.string().trim().min(2).max(80),
  postcode: z.string().trim().min(2).max(20),
  isDefault: z.boolean().optional(),
});

const paymentMethodSchema = z.object({
  provider: z.enum(["stripe", "apple_pay", "google_pay"]),
  providerPaymentMethodId: z.string().trim().min(3).max(255),
  brand: z.string().trim().max(30).optional(),
  last4: z.string().regex(/^[0-9]{4}$/).optional(),
  isDefault: z.boolean().optional(),
});
const cartSchema = z.object({ items: z.array(z.object({ productId: z.string().regex(/^[a-f\d]{24}$/i), qty: z.number().int().min(1).max(20) })).max(100) });

async function getCustomer(user) {
  return Customer.findOneAndUpdate(
    { email: user.email },
    { email: user.email, name: user.name, user: user._id },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

router.get("/profile", asyncHandler(async (req, res) => {
  res.json({ data: { id: req.user._id, name: req.user.name, email: req.user.email, avatarUrl: req.user.avatarUrl, preferences: req.user.preferences } });
}));

router.patch("/profile", asyncHandler(async (req, res) => {
  const { name, avatarUrl } = req.body;
  if (name) req.user.name = String(name).trim();
  if (avatarUrl !== undefined) req.user.avatarUrl = avatarUrl || undefined;
  await req.user.save();
  res.json({ data: { id: req.user._id, name: req.user.name, email: req.user.email, avatarUrl: req.user.avatarUrl } });
}));

router.get("/addresses", asyncHandler(async (req, res) => {
  const customer = await getCustomer(req.user);
  res.json({ data: customer.addresses || [] });
}));

router.post("/addresses", asyncHandler(async (req, res) => {
  const customer = await getCustomer(req.user);
  const address = addressSchema.parse(req.body);
  if (address.isDefault) customer.addresses.forEach((item) => { item.isDefault = false; });
  if (!customer.addresses.length) address.isDefault = true;
  customer.addresses.push(address);
  await customer.save();
  res.status(201).json({ data: customer.addresses[customer.addresses.length - 1] });
}));

router.patch("/addresses/:id", asyncHandler(async (req, res) => {
  const customer = await getCustomer(req.user);
  const address = customer.addresses.id(req.params.id);
  if (!address) return res.status(404).json({ error: "Address not found" });
  const update = addressSchema.partial().parse(req.body);
  if (update.isDefault) customer.addresses.forEach((item) => { item.isDefault = false; });
  Object.assign(address, update);
  await customer.save();
  res.json({ data: address });
}));

router.delete("/addresses/:id", asyncHandler(async (req, res) => {
  const customer = await getCustomer(req.user);
  const address = customer.addresses.id(req.params.id);
  if (!address) return res.status(404).json({ error: "Address not found" });
  const wasDefault = address.isDefault;
  address.deleteOne();
  if (wasDefault && customer.addresses.length) customer.addresses[0].isDefault = true;
  await customer.save();
  res.status(204).send();
}));

router.get("/wishlist", asyncHandler(async (req, res) => {
  const customer = await getCustomer(req.user);
  await customer.populate("wishlist");
  res.json({ data: customer.wishlist || [] });
}));

router.post("/wishlist/:productId", asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json({ error: "Product not found" });
  const customer = await getCustomer(req.user);
  if (!customer.wishlist.some((id) => String(id) === String(product._id))) customer.wishlist.push(product._id);
  await customer.save();
  await customer.populate("wishlist");
  res.status(201).json({ data: customer.wishlist });
}));

router.delete("/wishlist/:productId", asyncHandler(async (req, res) => {
  const customer = await getCustomer(req.user);
  customer.wishlist = customer.wishlist.filter((id) => String(id) !== req.params.productId);
  await customer.save();
  res.status(204).send();
}));

router.get("/cart", asyncHandler(async (req, res) => {
  await req.user.populate("cart.product");
  res.json({ data: { items: (req.user.cart || []).filter((item) => item.product).map((item) => ({ product: item.product, qty: item.qty })) } });
}));

router.put("/cart", asyncHandler(async (req, res) => {
  const { items } = cartSchema.parse(req.body);
  const products = await Product.find({ _id: { $in: items.map((item) => item.productId) }, status: "active" }).select("_id");
  const allowed = new Set(products.map((product) => String(product._id)));
  req.user.cart = items.filter((item) => allowed.has(item.productId)).map((item) => ({ product: item.productId, qty: item.qty }));
  await req.user.save();
  await req.user.populate("cart.product");
  res.json({ data: { items: req.user.cart.map((item) => ({ product: item.product, qty: item.qty })) } });
}));

router.get("/preferences", asyncHandler(async (req, res) => {
  res.json({ data: req.user.preferences || {} });
}));

router.patch("/preferences", asyncHandler(async (req, res) => {
  const allowed = ["healthySwaps", "budgetAlerts", "weeklyBudget", "dietaryPreferences"];
  const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
  req.user.preferences = { ...req.user.preferences?.toObject?.(), ...update };
  await req.user.save();
  res.json({ data: req.user.preferences });
}));

router.get("/payment-methods", asyncHandler(async (req, res) => {
  res.json({ data: req.user.paymentMethods || [] });
}));

router.post("/payment-methods", asyncHandler(async (req, res) => {
  const method = paymentMethodSchema.parse(req.body);
  if (method.isDefault || !req.user.paymentMethods.length) req.user.paymentMethods.forEach((item) => { item.isDefault = false; });
  req.user.paymentMethods.push(method);
  await req.user.save();
  res.status(201).json({ data: req.user.paymentMethods[req.user.paymentMethods.length - 1] });
}));

router.delete("/payment-methods/:id", asyncHandler(async (req, res) => {
  const method = req.user.paymentMethods.id(req.params.id);
  if (!method) return res.status(404).json({ error: "Payment method not found" });
  method.deleteOne();
  await req.user.save();
  res.status(204).send();
}));

export default router;
