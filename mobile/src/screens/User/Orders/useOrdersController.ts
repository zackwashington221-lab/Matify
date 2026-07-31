import { useNavigation } from "@react-navigation/native";
import { useGetMyOrdersQuery } from "../../../redux/Apis/Orders";
import { useAppSelector } from "../../../redux/hook/hook";

export default function useOrdersController() {
  const navigation = useNavigation<any>();
  const user = useAppSelector((state) => state.auth.user);
  const { data: orders = [], isLoading } = useGetMyOrdersQuery(undefined, { skip: !user });
  return {
    values: { user, orders, isLoading },
    functions: {
      signIn: () => navigation.navigate("Login"),
      openOrder: (order: (typeof orders)[number]) => navigation.navigate("Tracking", { order }),
    },
  };
}
