import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Category, Product, InventoryItem } from "./models/index.js";

// Additive catalog seed: safe to run repeatedly on local, staging, or production data.
// Existing products are updated by slug; no collections are cleared.
const PRODUCTS = [
  ["blueberry", "Organic Blueberries", "Berry Good", 5.49, 6.49, "6 oz", "🫐", "produce", 4.9, 735, "In season", true],
  ["mango", "Honey Mangoes", "Sunrise Farms", 1.99, null, "each", "🥭", "produce", 4.7, 420, null, false],
  ["baby-spinach", "Baby Spinach", "Green Meadow", 3.79, null, "5 oz", "🥬", "produce", 4.8, 630, "Healthier pick", true],
  ["sweet-potato", "Sweet Potatoes", "Sunrise Farms", 2.49, null, "2 lb", "🍠", "produce", 4.6, 318, null, false],
  ["cucumber", "English Cucumber", "Local Roots", 1.29, null, "each", "🥒", "produce", 4.6, 271, null, false],
  ["croissant", "Butter Croissants", "Levain Bakery", 5.99, null, "4 pack", "🥐", "bakery", 4.9, 810, "Baked today", false],
  ["bagels", "Everything Bagels", "Brooklyn Bakes", 4.99, null, "6 pack", "🥯", "bakery", 4.7, 490, null, false],
  ["tortillas", "Stone-Ground Tortillas", "Casa Maiz", 3.99, null, "12 count", "🫓", "bakery", 4.8, 302, null, false],
  ["greek-yogurt", "Greek Yogurt", "Green Meadow", 6.49, 7.49, "32 oz", "🥣", "dairy", 4.8, 960, "Protein pick", true],
  ["butter", "Cultured Butter", "Maple Hill", 5.79, null, "8 oz", "🧈", "dairy", 4.9, 444, null, true],
  ["cheddar", "Sharp Cheddar", "Creamery Co.", 5.99, null, "8 oz", "🧀", "dairy", 4.8, 538, null, false],
  ["chicken-breast", "Air-Chilled Chicken Breast", "Farmstead", 11.99, 13.99, "1.5 lb", "🍗", "seafood", 4.8, 650, "High protein", false],
  ["ground-beef", "Grass-Fed Ground Beef", "Pasture Pro", 9.99, null, "1 lb", "🥩", "seafood", 4.7, 381, null, false],
  ["shrimp", "Jumbo Raw Shrimp", "Ocean Fresh", 13.49, null, "1 lb", "🦐", "seafood", 4.8, 559, null, false],
  ["rice", "Jasmine Rice", "Golden Grain", 6.99, null, "5 lb", "🍚", "pantry", 4.9, 1100, "Pantry staple", false],
  ["olive-oil", "Extra Virgin Olive Oil", "Oliva", 12.99, 15.99, "500 ml", "🫒", "pantry", 4.9, 742, null, false],
  ["tomato-sauce", "San Marzano Tomato Sauce", "Rustichella", 4.29, null, "24 oz", "🥫", "pantry", 4.8, 624, null, false],
  ["peanut-butter", "Creamy Peanut Butter", "Good Ground", 4.99, null, "16 oz", "🥜", "pantry", 4.7, 860, null, false],
  ["granola", "Maple Almond Granola", "Morning Harvest", 6.29, null, "12 oz", "🥣", "pantry", 4.8, 405, null, true],
  ["sparkling-water", "Lime Sparkling Water", "Clear Spring", 5.99, null, "8 pack", "💧", "drinks", 4.7, 1060, "Customer favorite", false],
  ["orange-juice", "Fresh Squeezed Orange Juice", "Sunrise Farms", 5.49, null, "52 oz", "🍊", "drinks", 4.8, 510, null, false],
  ["kombucha", "Ginger Lemon Kombucha", "Bright Brew", 3.49, null, "16 oz", "🍹", "drinks", 4.6, 225, null, true],
  ["ice-cream", "Vanilla Bean Ice Cream", "Creamery Co.", 6.99, null, "1 pint", "🍨", "frozen", 4.9, 690, "Treat yourself", false],
  ["frozen-berries", "Frozen Mixed Berries", "Berry Good", 7.49, null, "24 oz", "🧊", "frozen", 4.8, 375, null, true],
  ["pizza", "Margherita Stone-Baked Pizza", "Napoli Kitchen", 8.99, null, "12 in", "🍕", "frozen", 4.7, 442, null, false],
  ["chips", "Sea Salt Kettle Chips", "Kettle & Co.", 3.99, null, "7 oz", "🥔", "snacks", 4.7, 783, null, false],
  ["trail-mix", "Dark Chocolate Trail Mix", "Good Ground", 6.49, null, "10 oz", "🥜", "snacks", 4.8, 387, "Desk snack", false],
  ["crackers", "Rosemary Olive Oil Crackers", "Casa Maiz", 4.79, null, "5 oz", "🍘", "snacks", 4.7, 282, null, false],
];

const EXTRA_CATEGORIES = [
  { slug: "drinks", name: "Beverages", emoji: "🧃", sortOrder: 7 },
  { slug: "frozen", name: "Frozen", emoji: "🧊", sortOrder: 8 },
];
const gradients = ["from-emerald-100 to-lime-100", "from-rose-100 to-pink-100", "from-amber-100 to-orange-100", "from-sky-100 to-blue-100", "from-violet-100 to-indigo-100"];

async function run() {
  await connectDB();
  await Promise.all(EXTRA_CATEGORIES.map((category) => Category.updateOne({ slug: category.slug }, { $set: category }, { upsert: true })));
  await Promise.all(PRODUCTS.map(([slug, name, brand, price, compareAt, unit, emoji, category, rating, reviews, aiTag, organic], index) => Product.updateOne(
    { slug },
    { $set: { slug, name, brand, price, compareAt: compareAt || undefined, unit, emoji, category, rating, reviews, aiTag: aiTag || undefined, organic, status: "active", gradient: gradients[index % gradients.length], tags: [category, organic ? "organic" : "grocery"], description: `${name} from ${brand}. Carefully selected by Martify and delivered fresh to your door.` } },
    { upsert: true }
  )));
  const saved = await Product.find({ slug: { $in: PRODUCTS.map(([slug]) => slug) } }).select("_id slug price");
  await Promise.all(saved.map((product, index) => InventoryItem.updateOne(
    { product: product._id },
    { $setOnInsert: { product: product._id, sku: `MART-${String(3000 + index)}`, onHand: 30 + (index % 9) * 11, reserved: index % 4, reorderPoint: 12, reorderQty: 48, costPrice: Math.round(product.price * 0.62 * 100) / 100, supplier: "Martify Marketplace" } },
    { upsert: true }
  )));
  console.log(`[seed:products] upserted ${saved.length} products without deleting existing data.`);
  await mongoose.disconnect();
}

run().catch((error) => { console.error(error); process.exit(1); });
