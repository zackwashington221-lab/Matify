import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { Category, Product, InventoryItem } from "./models/index.js";

// Additive catalog seed: safe to run repeatedly on local, staging, or production data.
// Existing products are updated by slug; no collections are cleared.
const EXPANDED_PRODUCTS = [
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

// These base products make this command self-contained: it always seeds exactly 100 products.
const BASE_PRODUCTS = [
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

const ADDITIONAL_PRODUCTS = [
  ["apple", "Honeycrisp Apples", "Local Roots", 3.99, null, "2 lb", "🍎", "produce", 4.8, 845, null, true], ["lemon", "Organic Lemons", "Sunrise Farms", 3.49, null, "1 lb", "🍋", "produce", 4.7, 362, null, true], ["carrots", "Rainbow Carrots", "Local Roots", 3.29, null, "1 lb", "🥕", "produce", 4.7, 421, null, true], ["broccoli", "Broccoli Crowns", "Green Meadow", 2.79, null, "each", "🥦", "produce", 4.8, 530, "Healthier pick", true], ["onion", "Yellow Onions", "Sunrise Farms", 1.99, null, "2 lb", "🧅", "produce", 4.6, 309, null, false], ["garlic", "California Garlic", "Local Roots", 1.29, null, "each", "🧄", "produce", 4.7, 278, null, false], ["bell-pepper", "Red Bell Peppers", "Sunrise Farms", 2.49, null, "each", "🫑", "produce", 4.7, 415, null, false], ["mushrooms", "Cremini Mushrooms", "Green Meadow", 3.99, null, "8 oz", "🍄", "produce", 4.8, 487, null, true], ["grapes", "Seedless Red Grapes", "Berry Good", 4.49, null, "1 lb", "🍇", "produce", 4.8, 692, null, false], ["pineapple", "Golden Pineapple", "Sunrise Farms", 3.99, null, "each", "🍍", "produce", 4.7, 355, null, false],
  ["brioche", "Sliced Brioche", "Levain Bakery", 5.49, null, "16 oz", "🍞", "bakery", 4.8, 356, null, false], ["focaccia", "Rosemary Focaccia", "Brooklyn Bakes", 5.99, null, "1 loaf", "🥖", "bakery", 4.8, 268, "Baked today", false], ["muffins", "Blueberry Muffins", "Levain Bakery", 6.99, null, "4 pack", "🧁", "bakery", 4.7, 412, null, false], ["pita", "Whole Wheat Pita", "Casa Maiz", 4.29, null, "6 pack", "🫓", "bakery", 4.7, 235, null, false], ["english-muffins", "Sourdough English Muffins", "Brooklyn Bakes", 4.99, null, "6 pack", "🍞", "bakery", 4.8, 390, null, false], ["ciabatta", "Ciabatta Rolls", "Levain Bakery", 4.79, null, "4 pack", "🥖", "bakery", 4.7, 206, null, false], ["cinnamon-rolls", "Cinnamon Rolls", "Brooklyn Bakes", 7.49, null, "4 pack", "🥐", "bakery", 4.9, 601, "Weekend treat", false], ["naan", "Garlic Naan", "Casa Maiz", 3.99, null, "4 pack", "🫓", "bakery", 4.7, 320, null, false], ["rye-bread", "Seeded Rye Bread", "Levain Bakery", 5.79, null, "1 loaf", "🍞", "bakery", 4.8, 289, null, false], ["donuts", "Glazed Doughnuts", "Brooklyn Bakes", 6.49, null, "6 pack", "🍩", "bakery", 4.6, 441, null, false],
  ["cottage-cheese", "Whole Milk Cottage Cheese", "Maple Hill", 4.99, null, "16 oz", "🥣", "dairy", 4.8, 338, "Protein pick", true], ["mozzarella", "Fresh Mozzarella", "Creamery Co.", 6.49, null, "8 oz", "🧀", "dairy", 4.8, 418, null, false], ["parmesan", "Parmigiano Reggiano", "Creamery Co.", 8.99, null, "6 oz", "🧀", "dairy", 4.9, 527, null, false], ["cream-cheese", "Whipped Cream Cheese", "Maple Hill", 4.49, null, "8 oz", "🧀", "dairy", 4.7, 275, null, false], ["kefir", "Plain Whole Milk Kefir", "Green Meadow", 5.79, null, "32 oz", "🥛", "dairy", 4.7, 199, null, true], ["half-half", "Organic Half & Half", "Maple Hill", 4.29, null, "32 oz", "🥛", "dairy", 4.7, 214, null, true], ["soy-milk", "Unsweetened Soy Milk", "Oatly", 4.49, null, "64 oz", "🥛", "dairy", 4.6, 273, null, false], ["goat-cheese", "Creamy Goat Cheese", "Creamery Co.", 6.99, null, "4 oz", "🧀", "dairy", 4.8, 307, null, false], ["whipping-cream", "Heavy Whipping Cream", "Maple Hill", 5.49, null, "16 oz", "🥛", "dairy", 4.8, 188, null, true], ["feta", "Crumbled Feta Cheese", "Creamery Co.", 5.99, null, "6 oz", "🧀", "dairy", 4.7, 361, null, false],
  ["turkey", "Oven-Roasted Turkey Breast", "Farmstead", 9.49, null, "1 lb", "🦃", "seafood", 4.7, 280, null, false], ["pork-chops", "Heritage Pork Chops", "Pasture Pro", 10.99, null, "1 lb", "🥩", "seafood", 4.7, 244, null, false], ["cod", "Wild Pacific Cod", "Ocean Fresh", 12.49, null, "1 lb", "🐟", "seafood", 4.8, 327, null, false], ["tuna", "Ahi Tuna Steaks", "Ocean Fresh", 16.99, null, "12 oz", "🐟", "seafood", 4.9, 298, "High protein", false], ["scallops", "Dry Sea Scallops", "Ocean Fresh", 18.99, null, "1 lb", "🦪", "seafood", 4.8, 236, null, false], ["lamb", "Grass-Fed Ground Lamb", "Pasture Pro", 12.99, null, "1 lb", "🥩", "seafood", 4.7, 177, null, false], ["bacon", "Applewood Smoked Bacon", "Farmstead", 8.49, null, "12 oz", "🥓", "seafood", 4.8, 504, null, false], ["sausages", "Chicken Breakfast Sausages", "Farmstead", 7.99, null, "12 oz", "🌭", "seafood", 4.7, 291, null, false], ["crab-cakes", "Maryland Crab Cakes", "Ocean Fresh", 14.99, null, "2 pack", "🦀", "seafood", 4.8, 163, null, false], ["tilapia", "Fresh Tilapia Fillets", "Ocean Fresh", 9.99, null, "1 lb", "🐟", "seafood", 4.6, 227, null, false],
  ["quinoa", "Organic White Quinoa", "Golden Grain", 7.49, null, "16 oz", "🌾", "pantry", 4.8, 530, null, true], ["black-beans", "Organic Black Beans", "Good Ground", 2.29, null, "15 oz", "🫘", "pantry", 4.8, 670, null, true], ["chickpeas", "Organic Chickpeas", "Good Ground", 2.29, null, "15 oz", "🫘", "pantry", 4.8, 622, null, true], ["coconut-milk", "Organic Coconut Milk", "Casa Maiz", 3.49, null, "13.5 oz", "🥥", "pantry", 4.7, 351, null, true], ["oats", "Old Fashioned Oats", "Morning Harvest", 5.49, null, "32 oz", "🌾", "pantry", 4.8, 789, "Pantry staple", false], ["flour", "Unbleached All-Purpose Flour", "Golden Grain", 4.29, null, "5 lb", "🌾", "pantry", 4.7, 463, null, false], ["honey", "Wildflower Honey", "Local Roots", 8.99, null, "12 oz", "🍯", "pantry", 4.9, 414, null, true], ["soy-sauce", "Naturally Brewed Soy Sauce", "Casa Maiz", 4.49, null, "10 oz", "🍶", "pantry", 4.7, 346, null, false], ["cereal", "Crunchy Almond Cereal", "Morning Harvest", 5.99, null, "12 oz", "🥣", "pantry", 4.6, 292, null, false], ["vegetable-broth", "Low Sodium Vegetable Broth", "Good Ground", 3.79, null, "32 oz", "🥫", "pantry", 4.7, 320, null, false],
  ["lemonade", "Classic Lemonade", "Clear Spring", 4.99, null, "52 oz", "🍋", "drinks", 4.7, 432, null, false], ["cold-brew", "Vanilla Cold Brew", "Blue Bottle", 4.79, null, "11 oz", "🧋", "drinks", 4.8, 554, null, false], ["green-tea", "Organic Green Tea", "Bright Brew", 5.49, null, "20 bags", "🍵", "drinks", 4.7, 372, null, true], ["coconut-water", "Pure Coconut Water", "Clear Spring", 3.29, null, "16 oz", "🥥", "drinks", 4.7, 309, null, false], ["root-beer", "Craft Root Beer", "Clear Spring", 6.49, null, "6 pack", "🥤", "drinks", 4.6, 205, null, false], ["iced-tea", "Peach Iced Tea", "Bright Brew", 4.29, null, "52 oz", "🧋", "drinks", 4.7, 310, null, false], ["protein-shake", "Chocolate Protein Shake", "Good Ground", 3.99, null, "11 oz", "🥤", "drinks", 4.8, 463, "Post-workout pick", false], ["apple-cider", "Sparkling Apple Cider", "Sunrise Farms", 5.99, null, "25 oz", "🍎", "drinks", 4.7, 181, null, false], ["espresso", "Double Espresso Can", "Blue Bottle", 3.49, null, "6.5 oz", "☕", "drinks", 4.7, 400, null, false], ["ginger-beer", "Spicy Ginger Beer", "Bright Brew", 5.49, null, "4 pack", "🍹", "drinks", 4.6, 197, null, false],
];

const PRODUCTS = [...BASE_PRODUCTS, ...EXPANDED_PRODUCTS, ...ADDITIONAL_PRODUCTS];

const CATEGORIES = [
  { slug: "produce", name: "Produce", emoji: "🥬", sortOrder: 1 }, { slug: "bakery", name: "Bakery", emoji: "🥖", sortOrder: 2 }, { slug: "dairy", name: "Dairy & Eggs", emoji: "🥛", sortOrder: 3 }, { slug: "seafood", name: "Meat & Seafood", emoji: "🐟", sortOrder: 4 }, { slug: "pantry", name: "Pantry", emoji: "🫙", sortOrder: 5 }, { slug: "snacks", name: "Snacks", emoji: "🍫", sortOrder: 6 },
  { slug: "drinks", name: "Beverages", emoji: "🧃", sortOrder: 7 },
  { slug: "frozen", name: "Frozen", emoji: "🧊", sortOrder: 8 },
];
const gradients = ["from-emerald-100 to-lime-100", "from-rose-100 to-pink-100", "from-amber-100 to-orange-100", "from-sky-100 to-blue-100", "from-violet-100 to-indigo-100"];

async function run() {
  await connectDB();
  if (PRODUCTS.length !== 100) throw new Error(`Expected 100 catalog products, found ${PRODUCTS.length}`);
  await Promise.all(CATEGORIES.map((category) => Category.updateOne({ slug: category.slug }, { $set: category }, { upsert: true })));
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
