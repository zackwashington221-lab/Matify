import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useCheckoutMutation } from "../../../redux/Apis/Orders";
import { useAppDispatch, useAppSelector } from "../../../redux/hook/hook";
import { clearCart } from "../../../redux/slice/cartSlice";

const SLOTS = ["Today 4–6pm", "Today 6–8pm", "Tomorrow 8–10am", "Tomorrow 12–2pm"];
const TIP_OPTIONS = [0, 2, 4, 6];
const PAYMENT_METHODS = [
  { id: "card", label: "Visa · 4242", detail: "Default card, expires 06/29" },
  { id: "apple_pay", label: "Apple Pay", detail: "Confirm with Face ID" },
  { id: "cash", label: "Cash on delivery", detail: "Pay the shopper at the door" },
];

export default function useCheckoutController() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const lines = useAppSelector((state) => state.cart.lines);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.qty, 0);
  const itemCount = lines.reduce((count, line) => count + line.qty, 0);
  const deliveryFee = subtotal >= 45 || subtotal === 0 ? 0 : 4.99;
  const serviceFee = subtotal ? Number((subtotal * 0.03).toFixed(2)) : 0;

  const [checkout, { isLoading }] = useCheckoutMutation();
  const [address, setAddress] = useState("1247 Elm Street, Apt 4B");
  const [slot, setSlot] = useState(SLOTS[1]);
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].id);
  const [tip, setTip] = useState(2);
  const total = Number((subtotal + deliveryFee + serviceFee + tip).toFixed(2));

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
      await checkout({
        items: lines.map((line) => ({ product: line.product._id, qty: line.qty })),
        address,
      }).unwrap();
      dispatch(clearCart());
      Toast.show({ type: "success", text1: "Order placed", text2: `Arriving ${slot.toLowerCase()}.` });
      navigation.navigate("Orders");
    } catch {
      // The global RTK Query error middleware displays the failure toast.
    }
  };

  return {
    values: {
      address,
      slot,
      slots: SLOTS,
      payment,
      paymentMethods: PAYMENT_METHODS,
      tip,
      tipOptions: TIP_OPTIONS,
      itemCount,
      subtotal,
      deliveryFee,
      serviceFee,
      total,
      isLoading,
    },
    functions: { setAddress, setSlot, setPayment, setTip, placeOrder },
  };
}
