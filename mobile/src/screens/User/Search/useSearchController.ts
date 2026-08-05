import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useGetCategoriesQuery, useGetProductsQuery } from "../../../redux/Apis/Catalog";

export default function useSearchController() {
  const route = useRoute<any>();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>(route.params?.category);
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: products = [], isLoading } = useGetProductsQuery({
    q: query || undefined,
    category: category || undefined,
  });
  return {
    values: { query, category, categories, products, isLoading },
    functions: { setQuery, setCategory },
  };
}
