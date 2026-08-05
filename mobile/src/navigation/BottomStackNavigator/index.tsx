import React from "react";
import { Platform, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home as HomeIcon, Receipt, Search as SearchIcon, ShoppingBag, User } from "lucide-react-native";
import Home from "../../screens/User/Home";
import Search from "../../screens/User/Search";
import Cart from "../../screens/User/Cart";
import Orders from "../../screens/User/Orders";
import Profile from "../../screens/User/Profile";
import { useAppSelector } from "../../redux/hook/hook";
import { colors, radius, shadow } from "../../theme";

const Tab = createBottomTabNavigator();

const icons: Record<string, any> = {
  Home: HomeIcon,
  Search: SearchIcon,
  Cart: ShoppingBag,
  Orders: Receipt,
  Profile: User,
};

export default function BottomStackNavigator() {
  const cartCount = useAppSelector((state) => state.cart.lines.reduce((count, line) => count + line.qty, 0));
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primaryDeep,
        tabBarInactiveTintColor: colors.muted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10.5, fontWeight: "700", marginTop: 2 },
        tabBarItemStyle: { paddingVertical: 6 },
        tabBarBadgeStyle: { backgroundColor: colors.accent, color: "#fff", fontSize: 10, fontWeight: "700" },
        tabBarStyle: styles.bar,
        tabBarIcon: ({ color, focused }) => {
          const Icon = icons[route.name];
          return <Icon size={20} color={color} strokeWidth={focused ? 2.5 : 1.9} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} options={{ title: "Discover" }} />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{ title: "Basket", tabBarBadge: cartCount ? cartCount : undefined }}
      />
      <Tab.Screen name="Orders" component={Orders} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: "Account" }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: Platform.OS === "ios" ? 22 : 14,
    height: 68,
    paddingBottom: 10,
    paddingTop: 8,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.raised,
  },
});
