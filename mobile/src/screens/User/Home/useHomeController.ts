import { useGetProductsQuery } from "../../../redux/Apis/Catalog";
export default function useHomeController() {
  const { data: products = [], isLoading, error } = useGetProductsQuery();
  return { values: { products, isLoading, error }, functions: {} };
}
