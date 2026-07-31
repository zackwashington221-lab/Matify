import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
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
    if (!address.trim()) return Alert.alert("Delivery address required");
    if (!lines.length) return Alert.alert("Your cart is empty");
    try {
      await checkout({ items: lines.map((line) => ({ product: line.product._id, qty: line.qty })), address }).unwrap();
      dispatch(clearCart());
      Alert.alert("Order placed", "Your groceries are on the way.");
      navigation.navigate("Orders");
    } catch (error: any) {
      Alert.alert("Checkout failed", error.message || "Please try again.");
    }
  };
  return { values: { address, subtotal, isLoading }, functions: { setAddress, placeOrder } };
}
