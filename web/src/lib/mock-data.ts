export type Product = {
  id: string;
  backendId?: string;
  name: string;
  brand: string;
  price: number;
  compareAt?: number;
  unit: string;
  emoji: string;
  gradient: string;
  category: string;
  rating: number;
  reviews: number;
  aiTag?: string;
  organic?: boolean;
  stock: number;
};

export const products: Product[] = [
  { id: "avocado", name: "Hass Avocados", brand: "Sunrise Farms", price: 1.49, compareAt: 1.99, unit: "each", emoji: "🥑", gradient: "from-emerald-100 to-lime-100", category: "produce", rating: 4.8, reviews: 1240, aiTag: "Healthier pick", organic: true, stock: 42 },
  { id: "strawberry", name: "Organic Strawberries", brand: "Berry Good", price: 4.99, unit: "1 lb", emoji: "🍓", gradient: "from-rose-100 to-pink-100", category: "produce", rating: 4.9, reviews: 890, aiTag: "In season", organic: true, stock: 24 },
  { id: "banana", name: "Bananas", brand: "Sunrise Farms", price: 0.59, unit: "per lb", emoji: "🍌", gradient: "from-yellow-100 to-amber-100", category: "produce", rating: 4.7, reviews: 3420, stock: 120 },
  { id: "sourdough", name: "Artisan Sourdough", brand: "Levain Bakery", price: 6.5, unit: "1 loaf", emoji: "🥖", gradient: "from-amber-100 to-orange-100", category: "bakery", rating: 4.9, reviews: 512, aiTag: "Frequent buy", stock: 18 },
  { id: "salmon", name: "Wild Atlantic Salmon", brand: "Ocean Fresh", price: 14.99, unit: "1 lb fillet", emoji: "🐟", gradient: "from-orange-100 to-rose-100", category: "seafood", rating: 4.8, reviews: 340, aiTag: "High protein", stock: 12 },
  { id: "eggs", name: "Free-Range Eggs", brand: "Green Meadow", price: 5.49, compareAt: 6.99, unit: "12 count", emoji: "🥚", gradient: "from-stone-100 to-amber-100", category: "dairy", rating: 4.9, reviews: 2100, organic: true, stock: 60 },
  { id: "milk", name: "Oat Milk Barista", brand: "Oatly", price: 4.99, unit: "1 qt", emoji: "🥛", gradient: "from-neutral-100 to-stone-100", category: "dairy", rating: 4.8, reviews: 1580, aiTag: "You buy weekly", stock: 88 },
  { id: "tomato", name: "Vine Tomatoes", brand: "Sunrise Farms", price: 3.29, unit: "1 lb", emoji: "🍅", gradient: "from-red-100 to-rose-100", category: "produce", rating: 4.6, reviews: 720, stock: 55 },
  { id: "coffee", name: "Single Origin Coffee", brand: "Blue Bottle", price: 18.0, unit: "12 oz beans", emoji: "☕", gradient: "from-amber-200 to-stone-200", category: "pantry", rating: 4.9, reviews: 980, aiTag: "Try this", stock: 30 },
  { id: "chocolate", name: "Dark Chocolate 72%", brand: "Tony's", price: 4.5, unit: "180g bar", emoji: "🍫", gradient: "from-stone-200 to-amber-200", category: "snacks", rating: 4.9, reviews: 1120, stock: 44 },
  { id: "kale", name: "Organic Kale", brand: "Green Meadow", price: 2.99, unit: "1 bunch", emoji: "🥬", gradient: "from-emerald-100 to-green-100", category: "produce", rating: 4.5, reviews: 210, organic: true, aiTag: "Healthier pick", stock: 30 },
  { id: "pasta", name: "Bronze-Cut Pasta", brand: "Rustichella", price: 5.99, unit: "500g", emoji: "🍝", gradient: "from-yellow-100 to-orange-100", category: "pantry", rating: 4.8, reviews: 640, stock: 70 },
];

export const categories = [
  { id: "produce", name: "Fresh Produce", emoji: "🥬", count: 234, gradient: "from-emerald-400 to-green-500" },
  { id: "bakery", name: "Bakery", emoji: "🥖", count: 88, gradient: "from-amber-400 to-orange-500" },
  { id: "dairy", name: "Dairy & Eggs", emoji: "🥛", count: 142, gradient: "from-sky-300 to-blue-400" },
  { id: "seafood", name: "Meat & Seafood", emoji: "🐟", count: 76, gradient: "from-rose-400 to-red-500" },
  { id: "pantry", name: "Pantry", emoji: "🫙", count: 512, gradient: "from-stone-400 to-amber-500" },
  { id: "snacks", name: "Snacks", emoji: "🍫", count: 320, gradient: "from-fuchsia-400 to-pink-500" },
  { id: "drinks", name: "Beverages", emoji: "🧃", count: 198, gradient: "from-cyan-400 to-teal-500" },
  { id: "frozen", name: "Frozen", emoji: "🧊", count: 154, gradient: "from-indigo-400 to-violet-500" },
];

export const productById = (id: string) => products.find((p) => p.id === id) ?? products[0];
