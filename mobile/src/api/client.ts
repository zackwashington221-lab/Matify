import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const BASE_URL =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl || "http://localhost:4000/api";

const TOKEN_KEY = "freshly.token";

let cachedToken: string | null = null;

export async function getToken() {
  if (cachedToken) return cachedToken;
  cachedToken = await AsyncStorage.getItem(TOKEN_KEY);
  return cachedToken;
}
export async function setToken(token: string | null) {
  cachedToken = token;
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken();
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
  if (!res.ok) throw new Error(body?.error || res.statusText);
  return body as T;
}

export type Product = {
  _id: string; slug: string; name: string; brand?: string; description?: string; price: number;
  compareAt?: number; unit?: string; emoji?: string; category?: string; rating?: number; aiTag?: string; organic?: boolean;
};
export type Category = { _id: string; slug: string; name: string; emoji?: string };
export type Banner = { _id: string; title: string; subtitle?: string; ctaLabel?: string };
export type Order = {
  _id: string; reference: string; total: number; status: string; placedAt: string;
  items: { name: string; qty: number; price: number }[];
};
export type User = { id: string; name: string; email: string; role: string };

export const api = {
  login: async (email: string, password: string) => {
    const res = await request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    await setToken(res.token);
    return res.user;
  },
  register: async (name: string, email: string, password: string) => {
    const res = await request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    await setToken(res.token);
    return res.user;
  },
  logout: () => setToken(null),
  me: () => request<{ user: User }>("/auth/me").then((r) => r.user),

  categories: () => request<{ data: Category[] }>("/storefront/categories").then((r) => r.data),
  products: (params: { q?: string; category?: string } = {}) => {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v) as [string, string][]
    ).toString();
    return request<{ data: Product[] }>(`/storefront/products${qs ? `?${qs}` : ""}`).then((r) => r.data);
  },
  product: (slug: string) => request<{ data: Product & { stock: number } }>(`/storefront/products/${slug}`).then((r) => r.data),
  banners: () => request<{ data: Banner[] }>("/storefront/banners").then((r) => r.data),

  checkout: (items: { product: string; qty: number }[], address: string) =>
    request<{ data: Order }>("/orders/checkout", { method: "POST", body: JSON.stringify({ items, address }) }).then((r) => r.data),
  myOrders: () => request<{ data: Order[] }>("/orders/mine").then((r) => r.data),
};
