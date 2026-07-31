import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomStackNavigator from "../BottomStackNavigator";
import Product from "../../screens/User/Product";
import Checkout from "../../screens/User/Checkout";
import Tracking from "../../screens/User/Tracking";
import Assistant from "../../screens/User/Assistant";
import Wishlist from "../../screens/User/Wishlist";
import Addresses from "../../screens/User/Addresses";
import PaymentMethods from "../../screens/User/PaymentMethods";
import AiPreferences from "../../screens/User/AiPreferences";
import Notifications from "../../screens/User/Notifications";
import { colors } from "../../theme";

const Stack = createNativeStackNavigator();

export default function AppStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
    >
      <Stack.Screen name="Tabs" component={BottomStackNavigator} />
      <Stack.Screen name="Product" component={Product} />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Tracking" component={Tracking} />
      <Stack.Screen name="Assistant" component={Assistant} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="Addresses" component={Addresses} />
      <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      <Stack.Screen name="AiPreferences" component={AiPreferences} />
      <Stack.Screen name="Notifications" component={Notifications} />
    </Stack.Navigator>
  );
}
