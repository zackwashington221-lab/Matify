import type { Banner, Category, Order, Product, User } from "../helpers/types";

export const mockUser: User = { id: "demo-user", name: "Alex Morgan", email: "alex@freshly.test", role: "Customer" };
export const mockCategories: Category[] = [
  { _id: "cat-produce", slug: "produce", name: "Produce", emoji: "🥬" },
  { _id: "cat-dairy", slug: "dairy", name: "Dairy & eggs", emoji: "🥛" },
  { _id: "cat-bakery", slug: "bakery", name: "Bakery", emoji: "🥖" },
  { _id: "cat-pantry", slug: "pantry", name: "Pantry", emoji: "🫙" },
];
export const mockProducts: Product[] = [
  { _id: "avocado", slug: "organic-avocado", name: "Organic Avocado", brand: "Freshly Farms", description: "Creamy Hass avocados picked for today.", price: 3.99, unit: "each", emoji: "🥑", category: "produce", rating: 4.8, organic: true, aiTag: "AI pick" },
  { _id: "strawberries", slug: "sweet-strawberries", name: "Sweet Strawberries", brand: "Berry House", description: "Juicy seasonal strawberries.", price: 5.49, unit: "400g punnet", emoji: "🍓", category: "produce", rating: 4.9 },
  { _id: "sourdough", slug: "artisan-sourdough", name: "Artisan Sourdough", brand: "Daily Loaf", description: "Slow-fermented country sourdough.", price: 4.75, unit: "loaf", emoji: "🥖", category: "bakery", rating: 4.7 },
  { _id: "oat-milk", slug: "barista-oat-milk", name: "Barista Oat Milk", brand: "Oat & Co.", description: "Smooth, foamy oat milk for coffee.", price: 4.25, unit: "1L carton", emoji: "🥛", category: "dairy", rating: 4.6, aiTag: "Best value" },
  { _id: "salmon", slug: "atlantic-salmon", name: "Atlantic Salmon", brand: "Ocean Fresh", description: "Responsibly sourced salmon fillet.", price: 12.99, unit: "250g", emoji: "🐟", category: "produce", rating: 4.8 },
  { _id: "tomatoes", slug: "vine-tomatoes", name: "Vine Tomatoes", brand: "Freshly Farms", description: "Sweet vine-ripened tomatoes.", price: 3.25, unit: "500g", emoji: "🍅", category: "produce", rating: 4.5 },
];
export const mockBanners: Banner[] = [{ _id: "banner-1", title: "Fresh picks, delivered today", subtitle: "Up to 30% off seasonal produce", ctaLabel: "Shop now" }];
export const mockOrders: Order[] = [{ _id: "order-1", reference: "FR-4821", total: 37.32, status: "out_for_delivery", placedAt: new Date().toISOString(), items: [{ name: "Organic Avocado", qty: 2, price: 3.99 }, { name: "Artisan Sourdough", qty: 1, price: 4.75 }] }];
export function findMockProduct(slug: string) { return mockProducts.find((product) => product.slug === slug) || mockProducts[0]; }
