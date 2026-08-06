import { Router } from "express";
import { Product, InventoryItem, Category, Banner, Promotion } from "../models/index.js";
import { asyncHandler } from "../middleware/error.js";

// Public storefront API consumed by the Expo mobile app (no auth required).
const router = Router();

const HOME_CONTENT = {
  hero: {
    eyebrow: "AI-curated grocery marketplace",
    title: "Real food, smarter baskets, delivered today.",
    description: "Shop thousands of everyday essentials from local growers and artisan makers. Martify's assistant plans meals, finds cheaper swaps and keeps you inside your budget.",
    primaryCta: "Start shopping",
    secondaryCta: "Build my basket with AI",
  },
  sections: {
    departments: { title: "Shop by department", cta: "Browse all" },
    deals: { title: "This week's deals", cta: "See all deals" },
    trending: { title: "Trending in your area", cta: "Shop all" },
  },
  valueProps: [
    { icon: "truck", title: "Same-day delivery", body: "Order by 6pm for delivery tonight, free over $35." },
    { icon: "shield", title: "Freshness promise", body: "Not perfect? We refund the item, no questions asked." },
    { icon: "sparkles", title: "Smart savings", body: "AI swaps surface cheaper equivalents as you shop." },
    { icon: "clock", title: "One-tap reorders", body: "Your weekly staples rebuilt in a single click." },
  ],
  testimonials: [
    { name: "Amara D.", text: "The AI basket saved me $22 on my usual weekly shop and it still felt like my own list." },
    { name: "Jonas P.", text: "Produce arrives better than my local store, and the delivery windows are actually accurate." },
    { name: "Priya S.", text: "Reordering staples takes seconds now. It's the only grocery site I use on desktop." },
  ],
  cta: { title: "Your first delivery is on us.", body: "Create a free account and get free delivery on your first three orders, plus AI meal planning built in.", primaryLabel: "Create account", secondaryLabel: "Shop as guest" },
};

async function withStock(products) {
  const inventory = await InventoryItem.find({ product: { $in: products.map((product) => product._id) } }).select("product onHand reserved").lean();
  const stockByProduct = new Map(inventory.map((item) => [String(item.product), Math.max(0, item.onHand - item.reserved)]));
  return products.map((product) => ({ ...product.toJSON(), stock: stockByProduct.get(String(product._id)) || 0 }));
}

// One request for the customer homepage. It keeps the home composition server-driven.
router.get(
  "/home",
  asyncHandler(async (_req, res) => {
    const active = { status: "active" };
    const [categories, categoryCounts, featured, deals, trending, banners, promotions, productCount, stockTotals, ratingTotals] = await Promise.all([
      Category.find().sort("sortOrder name").lean(),
      Product.aggregate([{ $match: active }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
      Product.find(active).sort("-rating -reviews").limit(4),
      Product.find({ ...active, $expr: { $gt: ["$compareAt", "$price"] } }).sort("-rating").limit(4),
      Product.find(active).sort("-reviews -rating").limit(4),
      Banner.find({ status: "live" }).sort("slot").lean(),
      Promotion.find({ status: "active" }).select("code name type value minSpend endsAt").lean(),
      Product.countDocuments(active),
      InventoryItem.aggregate([{ $group: { _id: null, onHand: { $sum: "$onHand" } } }]),
      Product.aggregate([{ $match: active }, { $group: { _id: null, rating: { $avg: "$rating" }, reviews: { $sum: "$reviews" } } }]),
    ]);
    const counts = new Map(categoryCounts.map((item) => [item._id, item.count]));
    const [featuredWithStock, dealsWithStock, trendingWithStock] = await Promise.all([
      withStock(featured), withStock(deals), withStock(trending),
    ]);
    res.json({
      data: {
        categories: categories.map((category) => ({ ...category, count: counts.get(category.slug) || 0 })),
        featured: featuredWithStock,
        deals: dealsWithStock,
        trending: trendingWithStock,
        banners,
        promotions,
        content: HOME_CONTENT,
        metrics: [
          { value: `${productCount.toLocaleString()}+`, label: "Products in stock" },
          { value: "45 min", label: "Average delivery" },
          { value: `${(ratingTotals[0]?.rating || 0).toFixed(1)}★`, label: `From ${(ratingTotals[0]?.reviews || 0).toLocaleString()} reviews` },
        ],
        inventoryOnHand: stockTotals[0]?.onHand || 0,
      },
    });
  })
);

router.get(
  "/categories",
  asyncHandler(async (_req, res) => {
    res.json({ data: await Category.find().sort("sortOrder name") });
  })
);

router.get(
  "/products",
  asyncHandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(60, Number(req.query.limit) || 20);
    const query = { status: "active" };
    if (req.query.category && req.query.category !== "all") query.category = req.query.category;
    if (req.query.q) {
      const rx = new RegExp(String(req.query.q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [{ name: rx }, { brand: rx }, { tags: rx }];
    }
    const [products, total] = await Promise.all([
      Product.find(query).sort(req.query.sort || "-rating").skip((page - 1) * limit).limit(limit),
      Product.countDocuments(query),
    ]);
    const data = await withStock(products);
    res.json({ data, page, total, pages: Math.ceil(total / limit) || 1 });
  })
);

router.get(
  "/products/:slug",
  asyncHandler(async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug, status: "active" });
    if (!product) return res.status(404).json({ error: "Product not found" });
    const inventory = await InventoryItem.findOne({ product: product._id });
    res.json({ data: { ...product.toJSON(), stock: inventory ? inventory.onHand - inventory.reserved : 0 } });
  })
);

router.get(
  "/banners",
  asyncHandler(async (_req, res) => {
    res.json({ data: await Banner.find({ status: "live" }).sort("slot") });
  })
);

router.get(
  "/promotions",
  asyncHandler(async (_req, res) => {
    res.json({ data: await Promotion.find({ status: "active" }).select("code name type value minSpend endsAt") });
  })
);

export default router;
