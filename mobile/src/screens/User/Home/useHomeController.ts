import { useGetProductsQuery } from "../../../redux/Apis/Catalog";
export default function useHomeController() {
  const { data: products = [], isLoading, error, refetch } = useGetProductsQuery({ limit: 20 });
  return { values: { products, isLoading, error }, functions: { refetch } };
}
