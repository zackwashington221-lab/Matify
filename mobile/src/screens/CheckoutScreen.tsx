import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../api/client";
import { Button, Card } from "../components/ui";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { colors, money, spacing, type } from "../theme";

export default function CheckoutScreen({ navigation }: any) {
  const { lines, subtotal, clear } = useCart();
  const { user } = useAuth();
  const [address, setAddress] = useState("12 Market St, New York");
  const [busy, setBusy] = useState(false);
  const deliveryFee = subtotal > 45 ? 0 : 2.99;

  async function placeOrder() {
    if (!user) return navigation.navigate("Login");
    setBusy(true);
    try {
      const order = await api.checkout(lines.map((l) => ({ product: l.product._id, qty: l.qty })), address);
      clear();
      navigation.navigate("Orders");
      Alert.alert("Order placed", `${order.reference} is confirmed and being picked.`);
    } catch (e: any) {
      Alert.alert("Checkout failed", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <Text style={type.display}>Checkout</Text>

        <Card>
          <Text style={type.label}>Delivery address</Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            style={{ marginTop: 8, height: 44, borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, color: colors.text }}
          />
        </Card>

        <Card>
          <Text style={type.label}>Order summary</Text>
          {lines.map((l) => (
            <View key={l.product._id} style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <Text style={type.caption}>{l.qty} × {l.product.name}</Text>
              <Text style={type.caption}>{money(l.product.price * l.qty)}</Text>
            </View>
          ))}
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: spacing.md }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={type.label}>Total</Text>
            <Text style={type.label}>{money(subtotal + deliveryFee)}</Text>
          </View>
        </Card>

        <Button label={busy ? "Placing order…" : "Place order"} loading={busy} onPress={placeOrder} />
      </ScrollView>
    </SafeAreaView>
  );
}
