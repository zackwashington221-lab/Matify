import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, type Product } from "@/lib/mock-data";

export type CartLine = { id: string; qty: number };

type CartContextValue = {
  lines: CartLine[];
  items: { product: Product; qty: number }[];
  count: number;
  subtotal: number;
  savings: number;
  delivery: number;
  tax: number;
  total: number;
  add: (id: string, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "freshly.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  const add = useCallback((id: string, qty = 1) => {
    setLines((xs) => {
      const found = xs.find((x) => x.id === id);
      if (found) return xs.map((x) => (x.id === id ? { ...x, qty: x.qty + qty } : x));
      return [...xs, { id, qty }];
    });
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setLines((xs) => (qty <= 0 ? xs.filter((x) => x.id !== id) : xs.map((x) => (x.id === id ? { ...x, qty } : x))));
  }, []);

  const remove = useCallback((id: string) => setLines((xs) => xs.filter((x) => x.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const items = lines
      .map((l) => {
        const product = products.find((p) => p.id === l.id);
        return product ? { product, qty: l.qty } : null;
      })
      .filter((x): x is { product: Product; qty: number } => Boolean(x));

    const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
    const savings = items.reduce(
      (s, i) => s + (i.product.compareAt ? (i.product.compareAt - i.product.price) * i.qty : 0),
      0
    );
    const delivery = subtotal === 0 || subtotal > 35 ? 0 : 3.99;
    const tax = subtotal * 0.0825;
    return {
      lines,
      items,
      count: items.reduce((s, i) => s + i.qty, 0),
      subtotal,
      savings,
      delivery,
      tax,
      total: subtotal + delivery + tax,
      add,
      setQty,
      remove,
      clear,
    };
  }, [lines, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
