import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import SearchScreen from "../screens/SearchScreen";
import CartScreen from "../screens/CartScreen";
import OrdersScreen from "../screens/OrdersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProductScreen from "../screens/ProductScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import LoginScreen from "../screens/LoginScreen";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: "home-outline",
  Search: "search-outline",
  Cart: "bag-outline",
  Orders: "receipt-outline",
  Profile: "person-outline",
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border, height: 64, paddingBottom: 10 },
        tabBarIcon: ({ color, size }) => <Ionicons name={icons[route.name]} color={color} size={size} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ presentation: "modal" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
