import { useNavigation } from "@react-navigation/native";
import { useLogoutMutation } from "../../../redux/Apis/Auth";
import { useAppDispatch, useAppSelector } from "../../../redux/hook/hook";
import { logout } from "../../../redux/slice/authSlice";

const profileLinks = [
  { label: "Orders & returns", route: "Orders" },
  { label: "Wishlist", route: "Wishlist" },
  { label: "Saved addresses", route: "Addresses" },
  { label: "Payment methods", route: "PaymentMethods" },
  { label: "AI preferences", route: "AiPreferences" },
  { label: "Notifications", route: "Notifications" },
];

export default function useProfileController() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [logoutRequest] = useLogoutMutation();
  return {
    values: { user, profileLinks },
    functions: {
      openLink: (route: string) => navigation.navigate(route),
      signIn: () => navigation.navigate("Login"),
      signOut: async () => {
        try {
          await logoutRequest().unwrap();
        } catch {
          // Local logout must always work, even if the server is unreachable.
        }
        dispatch(logout());
      },
    },
  };
}
