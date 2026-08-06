// Typed client for the standalone Express + MongoDB API (see server/).
// Set VITE_API_URL in .env, e.g. VITE_API_URL=http://localhost:4000/api

const BASE_URL = (import.meta.env.VITE_API_URL as string) || "https://matify.up.railway.app/api";
const TOKEN_KEY = "martify.admin.token";
const USER_KEY = "martify.admin.user";
const CUSTOMER_TOKEN_KEY = "martify.customer.token";
const CUSTOMER_USER_KEY = "martify.customer.user";

export function getToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export function getCustomerToken() {
  return typeof window === "undefined" ? null : window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
}

export function setCustomerToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
  else window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
}

export function getCachedCustomerUser(): CustomerUser | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CUSTOMER_USER_KEY);
    return value ? JSON.parse(value) as CustomerUser : null;
  } catch {
    window.localStorage.removeItem(CUSTOMER_USER_KEY);
    return null;
  }
}

export function setCachedCustomerUser(user: CustomerUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(CUSTOMER_USER_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(CUSTOMER_USER_KEY);
}

export function getCachedAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(USER_KEY);
    return value ? (JSON.parse(value) as AdminUser) : null;
  } catch {
    window.localStorage.removeItem(USER_KEY);
    return null;
  }
}

export function setCachedAdminUser(user: AdminUser | null) {
  if (typeof window === "undefined") return;
  if (user) window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  else window.localStorage.removeItem(USER_KEY);
}

export type ListResponse<T> = { data: T[]; page: number; limit: number; total: number; pages: number };
export type Query = Record<string, string | number | boolean | undefined>;

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) throw new ApiError(body?.error || res.statusText, res.status);
  return body as T;
}

async function customerRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getCustomerToken();
  if (!token) throw new ApiError("Please sign in to continue.", 401);
  return request<T>(path, { ...init, headers: { ...(init.headers || {}), Authorization: `Bearer ${token}` } });
}

function qs(query?: Query) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== undefined && v !== "") params.set(k, String(v));
  const s = params.toString();
  return s ? `?${s}` : "";
}

/** Generic REST resource matching the server's crudRouter contract. */
function resource<T>(path: string) {
  return {
    list: (query?: Query) => request<ListResponse<T>>(`${path}${qs(query)}`),
    get: (id: string) => request<{ data: T }>(`${path}/${id}`),
    create: (payload: Partial<T>) => request<{ data: T }>(path, { method: "POST", body: JSON.stringify(payload) }),
    update: (id: string, payload: Partial<T>) =>
      request<{ data: T }>(`${path}/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
    remove: (id: string) => request<{ data: T }>(`${path}/${id}`, { method: "DELETE" }),
  };
}

export const api = {
  request,

  auth: {
    login: async (email: string, password: string) => {
      const res = await request<{ token: string; user: AdminUser }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(res.token);
      setCachedAdminUser(res.user);
      return res;
    },
    me: async () => {
      const res = await request<{ user: AdminUser }>("/auth/me");
      setCachedAdminUser(res.user);
      return res;
    },
    updateProfile: async (payload: Pick<AdminUser, "name"> & { avatarUrl?: string }) => {
      const res = await request<{ user: AdminUser }>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) });
      setCachedAdminUser(res.user);
      return res;
    },
    logout: () => {
      setToken(null);
      setCachedAdminUser(null);
    },
  },

  customerAuth: {
    login: (email: string, password: string) => request<{ token: string; user: CustomerUser }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    signup: (name: string, email: string, password: string) => request<{ token: string; user: CustomerUser }>("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),
    me: (token: string) => request<{ user: CustomerUser }>("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
  },
  customer: {
    updateProfile: (payload: { name: string; avatarUrl?: string }) => customerRequest<{ user: CustomerUser }>("/auth/me", { method: "PATCH", body: JSON.stringify(payload) }),
    orders: () => customerRequest<{ data: Order[] }>("/orders/mine"),
    addresses: () => customerRequest<{ data: CustomerAddress[] }>("/mobile/addresses"),
    saveCheckoutDetails: (payload: { name: string; phone?: string; company?: string; address: Omit<CustomerAddress, "_id" | "isDefault"> }) => customerRequest<{ data: { user: CustomerUser; address: CustomerAddress } }>("/mobile/checkout-details", { method: "PUT", body: JSON.stringify(payload) }),
    checkout: (payload: { items: { product: string; qty: number }[]; address: string; deliverySlot: "60min" | "2h" | "evening"; paymentMethod: "card" | "wallet" | "cash" }) => customerRequest<{ data: Order }>("/orders/checkout", { method: "POST", body: JSON.stringify(payload) }),
    preferences: () => customerRequest<{ data: CustomerPreferences }>("/mobile/preferences"),
    updatePreferences: (payload: Partial<CustomerPreferences>) => customerRequest<{ data: CustomerPreferences }>("/mobile/preferences", { method: "PATCH", body: JSON.stringify(payload) }),
    cart: () => customerRequest<{ data: { items: { product: Product; qty: number }[] } }>("/mobile/cart"),
    updateCart: (items: { productId: string; qty: number }[]) => customerRequest<{ data: { items: { product: Product; qty: number }[] } }>("/mobile/cart", { method: "PUT", body: JSON.stringify({ items }) }),
  },

  products: resource<Product>("/products"),
  categories: resource<Category>("/categories"),
  storefront: {
    home: () => request<{ data: StorefrontHome }>("/storefront/home"),
    products: (query?: Query) => request<ListResponse<Product & { stock?: number }>>(`/storefront/products${qs(query)}`),
    product: (slug: string) => request<{ data: Product & { stock?: number } }>(`/storefront/products/${encodeURIComponent(slug)}`),
    categories: () => request<{ data: Category[] }>("/storefront/categories"),
  },
  ai: {
    shopper: (message: string, budget?: number) => {
      const token = getCustomerToken();
      return request<{ data: ShoppingAdvice }>("/ai/shopper", { method: "POST", body: JSON.stringify({ message, budget }), headers: token ? { Authorization: `Bearer ${token}` } : undefined });
    },
  },
  inventory: {
    ...resource<InventoryItem>("/inventory"),
    lowStock: () => request<{ data: InventoryItem[] }>("/inventory/low-stock"),
    adjust: (id: string, delta: number, note?: string) =>
      request<{ data: InventoryItem }>(`/inventory/${id}/adjust`, { method: "POST", body: JSON.stringify({ delta, note }) }),
    reorder: (id: string, qty?: number) =>
      request<{ data: InventoryItem }>(`/inventory/${id}/reorder`, { method: "POST", body: JSON.stringify({ qty }) }),
    movements: (id: string) => request<{ data: StockMovement[] }>(`/inventory/${id}/movements`),
  },
  orders: {
    ...resource<Order>("/orders"),
    createManual: (payload: { customerId: string; items: { productId: string; qty: number }[]; address?: string; deliveryFee?: number; channel?: "app" | "web" | "phone" }) =>
      request<{ data: Order }>("/orders/manual", { method: "POST", body: JSON.stringify(payload) }),
    setStatus: (id: string, status: Order["status"], note?: string) =>
      request<{ data: Order }>(`/orders/${id}/status`, { method: "POST", body: JSON.stringify({ status, note }) }),
    refund: (id: string, amount: number) =>
      request<{ data: Order }>(`/orders/${id}/refund`, { method: "POST", body: JSON.stringify({ amount }) }),
  },
  returns: resource<ReturnCase>("/returns"),
  customers: resource<Customer>("/customers"),
  promotions: resource<Promotion>("/promotions"),
  banners: resource<Banner>("/banners"),
  notifications: {
    ...resource<NotificationRecord>("/notifications"),
    send: (id: string) => request<{ data: NotificationRecord; delivered: number }>(`/notifications/${id}/send`, { method: "POST" }),
    mine: () => request<{ data: UserNotification[]; unread: number }>("/notifications/mine"),
    markRead: (id: string) => request<{ data: UserNotification }>(`/notifications/mine/${id}/read`, { method: "PATCH" }),
    registerDevice: (token: string, platform: "ios" | "android" | "web" = "web") => request<{ ok: boolean }>("/notifications/device-token", { method: "POST", body: JSON.stringify({ token, platform }) }),
  },
  reports: resource<ScheduledReport>("/reports"),
  aiAgents: resource<AiAgent>("/ai/agents"),
  team: {
    ...resource<AdminUser>("/team"),
    invite: (email: string, role: string) => request<{ data: AdminUser; delivery?: { success: boolean; id?: string } }>("/team/invite", { method: "POST", body: JSON.stringify({ email, role }) }),
    createAdmin: (email: string, password: string) => request<{ data: AdminUser }>("/team/admins", { method: "POST", body: JSON.stringify({ email, password }) }),
  },
  roles: resource<RoleRecord>("/roles"),
  apiKeys: resource<ApiKeyRecord>("/api-keys"),
  integrations: resource<IntegrationRecord>("/integrations"),
  settings: resource<SettingRecord>("/settings"),

  audit: (query?: Query) => request<{ data: AuditEntry[] }>(`/audit${qs(query)}`),

  analytics: {
    kpis: (days = 30, category?: string) => request<{ data: Kpis }>(`/analytics/kpis${qs({ days, category })}`),
    revenueSeries: (days = 30, category?: string) => request<{ data: { date: string; revenue: number; orders: number }[] }>(`/analytics/revenue-series${qs({ days, category })}`),
    topProducts: (days = 30, category?: string) => request<{ data: { _id: string; name: string; units: number; revenue: number }[] }>(`/analytics/top-products${qs({ days, category })}`),
    categoryMix: (days = 30) => request<{ data: { category: string; revenue: number }[] }>(`/analytics/category-mix${qs({ days })}`),
    funnel: (days = 30) => request<{ data: { step: string; users: number }[] }>(`/analytics/funnel${qs({ days })}`),
    cohorts: () => request<{ data: { month: string; size: number; avgLtv: number; repeatRate: number; orders: number }[] }>("/analytics/cohorts"),
    geography: (days = 30) => request<{ data: { region: string; orders: number; revenue: number }[] }>(`/analytics/geography${qs({ days })}`),
  },
};

/* ---------------- types mirroring server/src/models ---------------- */

export type Id = string;
export type AdminUser = { id?: Id; _id?: Id; name: string; email: string; role: string; status?: string; mfaEnabled?: boolean; lastActiveAt?: string; avatarUrl?: string };
export type CustomerUser = { id: Id; name: string; email: string; role: string; avatarUrl?: string };
export type CustomerAddress = { _id?: Id; label: string; line1: string; line2?: string; city: string; state?: string; postcode: string; notes?: string; isDefault?: boolean };
export type CustomerPreferences = { healthySwaps?: boolean; budgetAlerts?: boolean; weeklyBudget?: number; dietaryPreferences?: string[] };
export type Category = { _id: Id; slug: string; name: string; emoji?: string; sortOrder?: number };
export type Product = {
  _id: Id; slug: string; name: string; brand?: string; description?: string; price: number; compareAt?: number;
  unit?: string; emoji?: string; category?: string; rating?: number; reviews?: number; aiTag?: string;
  organic?: boolean; status: "draft" | "active" | "archived"; tags?: string[]; gradient?: string; stock?: number;
};
export type InventoryItem = {
  _id: Id; product: Product | Id; sku: string; warehouse: string; onHand: number; reserved: number;
  reorderPoint: number; reorderQty: number; costPrice?: number; supplier?: string; lastCountedAt?: string;
};
export type StockMovement = { _id: Id; delta: number; reason: string; note?: string; actor?: string; createdAt: string };
export type OrderItem = { product: Id; name: string; qty: number; price: number };
export type Order = {
  _id: Id; reference: string; customer: Customer | Id; items: OrderItem[]; subtotal: number; deliveryFee: number;
  discount: number; total: number; status: "pending" | "confirmed" | "picking" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: string; channel: string; address?: string; courier?: string; placedAt: string; deliveredAt?: string;
  paymentMethod?: "card" | "wallet" | "cash"; deliveryWindow?: "60min" | "2h" | "evening";
  rider?: { name?: string; phone?: string; rating?: number };
  timeline: { label: string; at: string; note?: string }[];
};
export type ReturnCase = { _id: Id; reference: string; reason: string; items: number; amount: number; status: string; resolutionNote?: string; createdAt: string };
export type Customer = {
  _id: Id; name: string; email: string; phone?: string; tier: string; lifetimeValue: number; ordersCount: number;
  churnRisk: "low" | "medium" | "high"; city?: string; lastOrderAt?: string;
};
export type Promotion = { _id: Id; code: string; name?: string; type: string; value: number; minSpend?: number; usageLimit?: number; usedCount: number; status: string; startsAt?: string; endsAt?: string };
export type Banner = { _id: Id; title: string; subtitle?: string; slot: number; ctaLabel?: string; ctaHref?: string; theme?: string; status: string; impressions: number; clicks: number; startsAt?: string; endsAt?: string };
export type StorefrontHome = { categories: (Category & { count: number })[]; featured: (Product & { stock?: number })[]; deals: (Product & { stock?: number })[]; trending: (Product & { stock?: number })[]; banners: Banner[]; promotions: Pick<Promotion, "_id" | "code" | "name" | "type" | "value" | "minSpend" | "endsAt">[]; metrics: { value: string; label: string }[]; inventoryOnHand: number; content: { hero: { eyebrow: string; title: string; description: string; primaryCta: string; secondaryCta: string }; sections: { departments: { title: string; cta: string }; deals: { title: string; cta: string }; trending: { title: string; cta: string } }; valueProps: { icon: "truck" | "shield" | "sparkles" | "clock"; title: string; body: string }[]; testimonials: { name: string; text: string }[]; cta: { title: string; body: string; primaryLabel: string; secondaryLabel: string } } };
export type NotificationRecord = { _id: Id; title: string; body?: string; channel: string; audience?: string; category: string; status: string; scheduledFor?: string; sentAt?: string; stats?: { delivered?: number; opened?: number; clicked?: number } };
export type UserNotification = { _id: Id; title: string; body?: string; category?: string; channel: string; readAt?: string; createdAt: string };
export type ScheduledReport = { _id: Id; name: string; cadence: string; recipients: string[]; format: string; nextRunAt?: string; status: string };
export type AiAgent = { _id: Id; key: string; name: string; purpose?: string; model: string; temperature: number; systemPrompt?: string; enabled: boolean; autonomy: string; runsLast30d: number };
export type RoleRecord = { _id: Id; name: string; description?: string; matrix: Record<string, string[]> };
export type ApiKeyRecord = { _id: Id; label: string; prefix: string; scope: string; environment: string; status: string; lastUsedAt?: string; createdAt: string };
export type IntegrationRecord = { _id: Id; name: string; category: string; description?: string; status: string; detail?: string };
export type SettingRecord = { _id: Id; key: string; value: unknown; group: string };
export type AuditEntry = { _id: Id; actor: string; action: string; target?: string; severity: "info" | "warning" | "critical"; ip?: string; createdAt: string };
export type Kpis = { revenue30d: number; orders30d: number; avgOrderValue: number; customers: number; lowStockCount: number };
export type ShoppingAdvice = { reply: string; recommendations: { product: Product; qty: number; reason: string }[]; total: number; budget?: number };
