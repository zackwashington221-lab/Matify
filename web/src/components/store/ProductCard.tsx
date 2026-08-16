import { Link } from "@tanstack/react-router";
import { Plus, Star, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/mock-data";
import { useCart } from "@/lib/store-cart";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const resetTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const addToCart = () => {
    add(product.id);
    setAdded(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setAdded(false), 1500);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group flex flex-col rounded-lg bg-card border border-border overflow-hidden hover:shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div
          className={`relative aspect-[4/3] bg-gradient-to-br ${product.gradient} flex items-center justify-center`}
        >
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">
            {product.emoji}
          </span>
          {product.compareAt && (
            <span className="absolute top-3 left-3 rounded-full bg-destructive text-destructive-foreground text-[11px] font-bold px-2.5 py-1">
              Save ${(product.compareAt - product.price).toFixed(2)}
            </span>
          )}
          {product.organic && (
            <span className="absolute top-3 right-3 rounded-full bg-card/90 backdrop-blur text-[11px] font-semibold px-2.5 py-1">
              Organic
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </div>
        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className="mt-1 font-semibold text-[15px] leading-snug line-clamp-2 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-warning text-warning" />
          <span className="font-semibold text-foreground">{product.rating}</span>
          <span>({product.reviews.toLocaleString()})</span>
          <span>·</span>
          <span>{product.unit}</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <div className="font-display text-xl font-bold">${product.price.toFixed(2)}</div>
            {product.compareAt && (
              <div className="text-xs text-muted-foreground line-through">
                ${product.compareAt.toFixed(2)}
              </div>
            )}
          </div>
          <button
            onClick={addToCart}
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            {added ? <Check className="size-4" /> : <Plus className="size-4" />}
            {added ? "Added" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
