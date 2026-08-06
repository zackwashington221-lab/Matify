import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, type Banner, type Category as ApiCategory, type Product as ApiProduct, type Promotion, type StorefrontHome } from "@/lib/api-client";
import { categories as fallbackCategories, products as fallbackProducts, type Product } from "@/lib/mock-data";

type StoreCategory = { id: string; name: string; emoji: string; count: number; gradient: string };
type StorefrontValue = { products: Product[]; categories: StoreCategory[]; loading: boolean; usingFallback: boolean };
const StorefrontContext = createContext<StorefrontValue | null>(null);
const gradients = ["from-emerald-400 to-green-500", "from-amber-400 to-orange-500", "from-sky-300 to-blue-400", "from-rose-400 to-red-500", "from-stone-400 to-amber-500", "from-fuchsia-400 to-pink-500", "from-cyan-400 to-teal-500", "from-indigo-400 to-violet-500"];

function toStoreProduct(product: ApiProduct): Product {
  return {
    id: product.slug,
    name: product.name,
    brand: product.brand || "Martify",
    price: product.price,
    compareAt: product.compareAt,
    unit: product.unit || "each",
    emoji: product.emoji || "🛒",
    gradient: product.gradient || "from-emerald-100 to-lime-100",
    category: product.category || "other",
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    aiTag: product.aiTag,
    organic: product.organic,
    stock: product.stock ?? 0,
  };
}

function toStoreCategories(source: ApiCategory[], catalog: Product[]): StoreCategory[] {
  return source.map((category, index) => ({
    id: category.slug,
    name: category.name,
    emoji: category.emoji || "🛒",
    count: catalog.filter((product) => product.category === category.slug).length,
    gradient: gradients[index % gradients.length],
  }));
}

export function StorefrontProvider({ children }: { children: ReactNode }) {
  const [catalog, setCatalog] = useState<Product[]>(fallbackProducts);
  const [departments, setDepartments] = useState<StoreCategory[]>(fallbackCategories);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([api.storefront.products({ limit: 60 }), api.storefront.categories()])
      .then(([productResponse, categoryResponse]) => {
        if (!active || productResponse.data.length === 0) return;
        const products = productResponse.data.map(toStoreProduct);
        setCatalog(products);
        setDepartments(toStoreCategories(categoryResponse.data, products));
        setUsingFallback(false);
      })
      .catch(() => {
        // The customer site remains browsable during an API outage or static preview.
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({ products: catalog, categories: departments, loading, usingFallback }), [catalog, departments, loading, usingFallback]);
  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export function useStorefront() {
  const value = useContext(StorefrontContext);
  if (!value) throw new Error("useStorefront must be used inside StorefrontProvider");
  return value;
}

type HomeCatalog = { categories: StoreCategory[]; featured: Product[]; deals: Product[]; trending: Product[]; banners: Banner[]; promotions: Pick<Promotion, "_id" | "code" | "name" | "type" | "value" | "minSpend" | "endsAt">[]; metrics: StorefrontHome["metrics"]; content: StorefrontHome["content"] | null; loading: boolean };

function toHomeCatalog(home: StorefrontHome): Omit<HomeCatalog, "loading"> {
  return {
    categories: home.categories.map((category, index) => ({ id: category.slug, name: category.name, emoji: category.emoji || "🛒", count: category.count, gradient: gradients[index % gradients.length] })),
    featured: home.featured.map(toStoreProduct),
    deals: home.deals.map(toStoreProduct),
    trending: home.trending.map(toStoreProduct),
    banners: home.banners,
    promotions: home.promotions,
    metrics: home.metrics,
    content: home.content,
  };
}

export function useStorefrontHome(): HomeCatalog {
  const { loading: catalogLoading } = useStorefront();
  const [home, setHome] = useState<Omit<HomeCatalog, "loading"> | null>(null);

  useEffect(() => {
    let active = true;
    api.storefront.home().then((response) => {
      if (active) setHome(toHomeCatalog(response.data));
    }).catch(() => undefined);
    return () => { active = false; };
  }, []);

  if (home) return { ...home, loading: false };
  return { categories: [], featured: [], deals: [], trending: [], banners: [], promotions: [], metrics: [], content: null, loading: catalogLoading || !home };
}
