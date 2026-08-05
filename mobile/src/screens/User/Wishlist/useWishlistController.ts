import { useGetWishlistQuery } from "../../../redux/Apis/Customer";

export default function useWishlistController() {
  const { data = [] } = useGetWishlistQuery();
  return { values: { title: "Wishlist", description: "Save favourites to find them quickly.", items: data.map((product) => ({ title: product.name, detail: (product.brand || "Martify") + " · $" + product.price.toFixed(2) })) }, functions: {} };
}
