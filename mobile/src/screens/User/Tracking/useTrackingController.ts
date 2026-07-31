import { useRoute } from "@react-navigation/native";

const steps = ["Order placed", "Personal shopper picking", "Quality check", "Out for delivery", "Delivered"];

export default function useTrackingController() {
  const route = useRoute<any>();
  const order = route.params?.order;
  return { values: { order, steps, completedSteps: 3 }, functions: {} };
}
