import { NAVIGATORS } from "@/helpers/routes";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { colors } from "../../theme";
import AppStackNavigator from "../AppStackNavigator";
import AuthStackNavigator from "../AuthStackNavigator";
import { useAppSelector } from "@/redux/hook/hook";

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
      >
        {!isAuthenticated ? (
          <Stack.Screen name={NAVIGATORS.AUTH_STACK_NAVIGATION} component={AuthStackNavigator} />
        ) : (
          <Stack.Screen name={NAVIGATORS.APP_STACK_NAVIGATION} component={AppStackNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
