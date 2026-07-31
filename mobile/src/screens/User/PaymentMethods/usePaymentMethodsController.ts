import { useGetPaymentMethodsQuery } from "../../../redux/Apis/Customer";

export default function usePaymentMethodsController() {
  const { data = [] } = useGetPaymentMethodsQuery();
  return { values: { title: "Payment methods", description: "Your payment details are securely stored.", items: data.map((method) => ({ title: method.brand || method.provider, detail: method.last4 ? "Ending in " + method.last4 : "Available at checkout" })) }, functions: {} };
}
