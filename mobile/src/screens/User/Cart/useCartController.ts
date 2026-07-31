import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../redux/hook/hook";
import { removeFromCart, setCartQuantity } from "../../../redux/slice/cartSlice";

export default function useCartController() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const lines = useAppSelector((state) => state.cart.lines);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.qty, 0);
  return {
    values: { lines, subtotal },
    functions: {
      checkout: () => navigation.navigate("Checkout"),
      remove: (id: string) => dispatch(removeFromCart(id)),
      setQty: (id: string, qty: number) => dispatch(setCartQuantity({ id, qty })),
    },
  };
}
