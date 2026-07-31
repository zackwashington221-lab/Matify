import { useState } from "react";
import { useGetProductsQuery } from "../../../redux/Apis/Catalog";
export default function useSearchController() {
  const [query, setQuery] = useState("");
  const { data: products = [], isLoading } = useGetProductsQuery(query ? { q: query } : undefined);
  return { values: { query, products, isLoading }, functions: { setQuery } };
}
