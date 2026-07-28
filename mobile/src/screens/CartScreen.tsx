import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card } from "../components/ui";
import { useCart } from "../context/CartContext";
import { colors, money, spacing, type } from "../theme";

export default function CartScreen({ navigation }: any) {
  const { lines, setQty, subtotal, count } = useCart();
  const deliveryFee = subtotal > 45 || subtotal === 0 ? 0 : 2.99;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Text style={type.display}>Cart</Text>
        <Text style={type.caption}>{count} item{count === 1 ? "" : "s"}</Text>
      </View>

      <FlatList
        data={lines}
        keyExtractor={(l) => l.product._id}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: 24 }}
        ListEmptyComponent={<Text style={type.caption}>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <Card style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
            <Text style={{ fontSize: 32 }}>{item.product.emoji || "🛒"}</Text>
            <View style={{ flex: 1 }}>
              <Text style={type.label} numberOfLines={1}>{item.product.name}</Text>
              <Text style={type.caption}>{money(item.product.price)} · {item.product.unit}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Stepper label="−" onPress={() => setQty(item.product._id, item.qty - 1)} />
              <Text style={type.label}>{item.qty}</Text>
              <Stepper label="+" onPress={() => setQty(item.product._id, item.qty + 1)} />
            </View>
          </Card>
        )}
      />

      <View style={{ padding: spacing.lg, gap: spacing.sm }}>
        <Row label="Subtotal" value={money(subtotal)} />
        <Row label="Delivery" value={deliveryFee ? money(deliveryFee) : "Free"} />
        <Row label="Total" value={money(subtotal + deliveryFee)} strong />
        <View style={{ height: spacing.sm }} />
        <Button label="Checkout" disabled={!lines.length} onPress={() => navigation.navigate("Checkout")} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={strong ? type.label : type.caption}>{label}</Text>
      <Text style={strong ? type.label : type.caption}>{value}</Text>
    </View>
  );
}

function Stepper({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ color: colors.text, fontSize: 16 }}>{label}</Text>
    </Pressable>
  );
}
