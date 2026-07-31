import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { useGetProductQuery } from "../../../redux/Apis/Catalog";
import { useAppDispatch } from "../../../redux/hook/hook";
import { addToCart } from "../../../redux/slice/cartSlice";
export default function useProductController() {
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const slug = route.params?.slug || "";
  const { data: product, isLoading } = useGetProductQuery(slug, { skip: !slug });
  return {
    values: { product, quantity, isLoading },
    functions: {
      decrease: () => setQuantity((value) => Math.max(1, value - 1)),
      increase: () => setQuantity((value) => value + 1),
      addToCart: () => product && dispatch(addToCart({ product, qty: quantity })),
    },
  };
}
