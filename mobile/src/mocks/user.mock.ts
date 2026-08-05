import type { Address, AiPreferences, Banner, Category, Order, PaymentMethod, Product, User, UserNotification } from "../helpers/types";

export const mockUser: User = { id: "demo-user", name: "Alex Morgan", email: "alex@freshly.test", role: "Customer" };
export const mockCategories: Category[] = [
  { _id: "cat-produce", slug: "produce", name: "Produce", emoji: "🥬" },
  { _id: "cat-dairy", slug: "dairy", name: "Dairy & eggs", emoji: "🥛" },
  { _id: "cat-bakery", slug: "bakery", name: "Bakery", emoji: "🥖" },
  { _id: "cat-pantry", slug: "pantry", name: "Pantry", emoji: "🫙" },
  { _id: "cat-frozen", slug: "frozen", name: "Frozen", emoji: "🧊" },
  { _id: "cat-drinks", slug: "drinks", name: "Drinks", emoji: "🧃" },
];
export const mockProducts: Product[] = [
  { _id: "avocado", slug: "organic-avocado", name: "Organic Avocado", brand: "Freshly Farms", description: "Creamy Hass avocados picked for today.", price: 3.99, unit: "each", emoji: "🥑", imageUrl: "https://images.unsplash.com/photo-1523049673822-e5e0ff5d5e0b?auto=format&fit=crop&w=600&q=70", category: "produce", rating: 4.8, organic: true, aiTag: "AI pick" },
  { _id: "strawberries", slug: "sweet-strawberries", name: "Sweet Strawberries", brand: "Berry House", description: "Juicy seasonal strawberries.", price: 5.49, unit: "400g punnet", emoji: "🍓", imageUrl: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=600&q=70", category: "produce", rating: 4.9 },
  { _id: "sourdough", slug: "artisan-sourdough", name: "Artisan Sourdough", brand: "Daily Loaf", description: "Slow-fermented country sourdough.", price: 4.75, unit: "loaf", emoji: "🥖", imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=70", category: "bakery", rating: 4.7 },
  { _id: "oat-milk", slug: "barista-oat-milk", name: "Barista Oat Milk", brand: "Oat & Co.", description: "Smooth, foamy oat milk for coffee.", price: 4.25, unit: "1L carton", emoji: "🥛", imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=70", category: "dairy", rating: 4.6, aiTag: "Best value" },
  { _id: "salmon", slug: "atlantic-salmon", name: "Atlantic Salmon", brand: "Ocean Fresh", description: "Responsibly sourced salmon fillet.", price: 12.99, unit: "250g", emoji: "🐟", imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=70", category: "produce", rating: 4.8 },
  { _id: "tomatoes", slug: "vine-tomatoes", name: "Vine Tomatoes", brand: "Freshly Farms", description: "Sweet vine-ripened tomatoes.", price: 3.25, unit: "500g", emoji: "🍅", imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=70", category: "produce", rating: 4.5 },
  { _id: "eggs", slug: "free-range-eggs", name: "Free Range Eggs", brand: "Meadow & Hen", description: "Large free-range eggs from local farms.", price: 5.95, unit: "12 pack", emoji: "🥚", imageUrl: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=70", category: "dairy", rating: 4.8, organic: true },
  { _id: "pasta", slug: "bronze-cut-pasta", name: "Bronze Cut Pasta", brand: "Casa Verde", description: "Traditional durum wheat spaghetti.", price: 3.8, unit: "500g", emoji: "🍝", imageUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=600&q=70", category: "pantry", rating: 4.6 },
  { _id: "coffee", slug: "single-origin-coffee", name: "Single Origin Coffee", brand: "Roast House", description: "Rich medium-roast whole beans.", price: 14.5, unit: "340g", emoji: "☕", imageUrl: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=600&q=70", category: "pantry", rating: 4.9, aiTag: "Customer favourite" },
  { _id: "peas", slug: "garden-peas", name: "Garden Peas", brand: "Harvest Freezer", description: "Sweet frozen peas, picked at peak freshness.", price: 3.4, unit: "500g", emoji: "🫛", imageUrl: "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?auto=format&fit=crop&w=600&q=70", category: "frozen", rating: 4.4 },
  { _id: "sparkling-water", slug: "sparkling-water", name: "Sparkling Water", brand: "Spring & Co.", description: "Naturally sparkling mineral water.", price: 4.2, unit: "6 × 330ml", emoji: "💧", imageUrl: "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=600&q=70", category: "drinks", rating: 4.5 },
];
export const mockBanners: Banner[] = [
  { _id: "banner-1", title: "Fresh picks, delivered today", subtitle: "Up to 30% off seasonal produce", ctaLabel: "Shop now" },
  { _id: "banner-2", title: "Dinner sorted", subtitle: "Save on pantry essentials this week", ctaLabel: "Explore offers" },
];
export const mockOrders: Order[] = [
  { _id: "order-1", reference: "MT-4821", total: 37.32, status: "out_for_delivery", placedAt: "2026-08-05T09:15:00.000Z", items: [{ name: "Organic Avocado", qty: 2, price: 3.99 }, { name: "Artisan Sourdough", qty: 1, price: 4.75 }] },
  { _id: "order-2", reference: "MT-4714", total: 62.45, status: "delivered", placedAt: "2026-08-01T16:30:00.000Z", items: [{ name: "Atlantic Salmon", qty: 2, price: 12.99 }, { name: "Barista Oat Milk", qty: 2, price: 4.25 }] },
];
export const mockAddresses: Address[] = [
  { _id: "address-home", label: "Home", line1: "1247 Elm Street", city: "North Park", postcode: "92104", isDefault: true },
  { _id: "address-work", label: "Work", line1: "89 Market Lane", city: "Downtown", postcode: "92101" },
];
export const mockPreferences: AiPreferences = { healthySwaps: true, budgetAlerts: true, weeklyBudget: 120, dietaryPreferences: ["Vegetarian options"] };
export const mockPaymentMethods: PaymentMethod[] = [
  { _id: "visa-4242", provider: "stripe", providerPaymentMethodId: "mock-pm-4242", brand: "Visa", last4: "4242", isDefault: true },
  { _id: "apple-pay", provider: "apple_pay", providerPaymentMethodId: "mock-apple-pay", brand: "Apple Pay" },
];
export const mockNotifications: UserNotification[] = [
  { _id: "delivery", title: "Order on its way", body: "Your MT-4821 order arrives in 28 minutes.", category: "orders", channel: "inapp" },
  { _id: "picks", title: "Fresh weekly picks", body: "Your personalised produce list is ready.", category: "growth", channel: "inapp" },
];
export function findMockProduct(idOrSlug: string) { return mockProducts.find((product) => product._id === idOrSlug || product.slug === idOrSlug) || mockProducts[0]; }
