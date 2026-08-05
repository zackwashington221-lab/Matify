import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../redux/hook/hook";
import { removeFromCart, setCartQuantity } from "../../../redux/slice/cartSlice";

export default function useCartController() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const lines = useAppSelector((state) => state.cart.lines);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.qty, 0);
  const deliveryFee = subtotal >= 45 || subtotal === 0 ? 0 : 4.99;
  const serviceFee = subtotal ? Number((subtotal * 0.03).toFixed(2)) : 0;
  const total = Number((subtotal + deliveryFee + serviceFee).toFixed(2));
  return {
    values: { lines, subtotal, deliveryFee, serviceFee, total },
    functions: {
      checkout: () => navigation.navigate("Checkout"),
      remove: (id: string) => dispatch(removeFromCart(id)),
      setQty: (id: string, qty: number) => dispatch(setCartQuantity({ id, qty })),
    },
  };
}
