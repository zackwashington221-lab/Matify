import { useGetBannersQuery, useGetCategoriesQuery, useGetProductsQuery } from "../../../redux/Apis/Catalog";
import { useAppSelector } from "../../../redux/hook/hook";

const greetingFor = (hour: number) => (hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening");

export default function useHomeController() {
  const user = useAppSelector((state) => state.auth.user);
  const { data: products = [], isLoading, error, refetch } = useGetProductsQuery({ limit: 20 });
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: banners = [] } = useGetBannersQuery();

  return {
    values: {
      user,
      products,
      categories,
      banners,
      isLoading,
      error,
      greeting: greetingFor(new Date().getHours()),
    },
    functions: { refetch },
  };
}
