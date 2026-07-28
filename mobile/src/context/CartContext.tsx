import React, { createContext, useContext, useMemo, useState } from "react";
import { Product } from "../api/client";

export type CartLine = { product: Product; qty: number };

type CartValue = {
  lines: CartLine[];
  add: (product: Product, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: number;
  count: number;
};

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<CartValue>(() => {
    const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
    return {
      lines,
      subtotal: Math.round(subtotal * 100) / 100,
      count: lines.reduce((s, l) => s + l.qty, 0),
      add: (product, qty = 1) =>
        setLines((prev) => {
          const hit = prev.find((l) => l.product._id === product._id);
          return hit
            ? prev.map((l) => (l.product._id === product._id ? { ...l, qty: l.qty + qty } : l))
            : [...prev, { product, qty }];
        }),
      setQty: (id, qty) =>
        setLines((prev) => (qty <= 0 ? prev.filter((l) => l.product._id !== id) : prev.map((l) => (l.product._id === id ? { ...l, qty } : l)))),
      remove: (id) => setLines((prev) => prev.filter((l) => l.product._id !== id)),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
