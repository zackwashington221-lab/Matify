import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useCheckoutMutation } from "../../../redux/Apis/Orders";
import { useAppDispatch, useAppSelector } from "../../../redux/hook/hook";
import { clearCart } from "../../../redux/slice/cartSlice";
export default function useCheckoutController() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const lines = useAppSelector((state) => state.cart.lines);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.qty, 0);
  const [checkout, { isLoading }] = useCheckoutMutation();
  const [address, setAddress] = useState("1247 Elm Street");
  const placeOrder = async () => {
    if (!user) return navigation.navigate("Login");
    if (!address.trim()) {
      Toast.show({ type: "error", text1: "Delivery address required" });
      return;
    }
    if (!lines.length) {
      Toast.show({ type: "error", text1: "Your cart is empty" });
      return;
    }
    try {
      await checkout({ items: lines.map((line) => ({ product: line.product._id, qty: line.qty })), address }).unwrap();
      dispatch(clearCart());
      Toast.show({ type: "success", text1: "Order placed", text2: "Your groceries are on the way." });
      navigation.navigate("Orders");
    } catch {
      // The global RTK Query error middleware displays the failure toast.
    }
  };
  return { values: { address, subtotal, isLoading }, functions: { setAddress, placeOrder } };
}
