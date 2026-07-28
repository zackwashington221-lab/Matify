import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, Product } from "../api/client";
import { Badge, Button, Card } from "../components/ui";
import { useCart } from "../context/CartContext";
import { colors, money, spacing, type } from "../theme";

export default function ProductScreen({ route, navigation }: any) {
  const { slug } = route.params;
  const [product, setProduct] = useState<(Product & { stock: number }) | null>(null);
  const cart = useCart();

  useEffect(() => {
    api.product(slug).then(setProduct).catch(() => {});
  }, [slug]);

  if (!product) return <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        <View style={{ height: 220, borderRadius: 24, backgroundColor: colors.surfaceAlt, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 84 }}>{product.emoji || "🛒"}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.lg }}>
          {product.organic ? <Badge label="Organic" tone="success" /> : null}
          {product.aiTag ? <Badge label={product.aiTag} tone="warning" /> : null}
          <Badge label={product.stock > 0 ? `${product.stock} in stock` : "Out of stock"} tone={product.stock > 0 ? "muted" : "danger"} />
        </View>

        <Text style={[type.display, { marginTop: spacing.md }]}>{product.name}</Text>
        <Text style={type.caption}>{product.brand} · {product.unit}</Text>
        <Text style={[type.title, { marginTop: spacing.md }]}>{money(product.price)}</Text>
        <Text style={[type.body, { marginTop: spacing.md, color: colors.muted, lineHeight: 22 }]}>{product.description}</Text>

        <Card style={{ marginTop: spacing.xl, backgroundColor: colors.primaryTint, borderColor: colors.primaryTint }}>
          <Text style={[type.label, { color: colors.primary }]}>AI insight</Text>
          <Text style={[type.caption, { marginTop: 4 }]}>
            Households like yours reorder this every 9 days. Adding it to a weekly basket saves about 12%.
          </Text>
        </Card>
      </ScrollView>

      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: spacing.lg, backgroundColor: colors.background }}>
        <Button
          label={`Add to cart · ${money(product.price)}`}
          disabled={product.stock <= 0}
          onPress={() => {
            cart.add(product);
            navigation.navigate("Cart");
          }}
        />
      </View>
    </SafeAreaView>
  );
}
