import { useRoute } from "@react-navigation/native";
import type { Order } from "../../../helpers/types";

const steps = ["Order placed", "Personal shopper picking", "Quality check", "Out for delivery", "Delivered"];

export default function useTrackingController() {
  const route = useRoute() as { params?: { order?: Order } };
  const order = route.params?.order;
  return { values: { order, steps, completedSteps: 3 }, functions: {} };
}
