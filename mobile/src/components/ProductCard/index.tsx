import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Plus, Star } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { Product } from "../../helpers/types";
import { useAppDispatch } from "../../redux/hook/hook";
import { addToCart } from "../../redux/slice/cartSlice";
import { colors, money, radius, shadow, type } from "../../theme";
import { Badge, ProductImage } from "../ui";

export function ProductCard({ product, width = "47%" }: { product: Product; width?: any }) {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const discounted = product.compareAt && product.compareAt > product.price;

  return (
    <View style={[styles.card, { width }]}>
      <Pressable onPress={() => navigation.navigate("Product", { slug: product.slug })}>
        <ProductImage uri={product.imageUrl} emoji={product.emoji} height={132} style={styles.media} />
        <View style={styles.overlay}>
          {product.aiTag ? <Badge label={`✦ ${product.aiTag}`} tone="solid" /> : null}
          {!product.aiTag && product.organic ? <Badge label="Organic" tone="sage" /> : null}
        </View>
        <View style={styles.body}>
          {product.brand ? (
            <Text numberOfLines={1} style={type.eyebrow}>
              {product.brand.toUpperCase()}
            </Text>
          ) : null}
          <Text numberOfLines={2} style={styles.name}>
            {product.name}
          </Text>
          <View style={styles.metaRow}>
            <Text style={type.caption}>{product.unit || "each"}</Text>
            {product.rating ? (
              <View style={styles.rating}>
                <Star size={11} color={colors.accent} fill={colors.accent} />
                <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>{money(product.price)}</Text>
            {discounted ? <Text style={styles.compare}>{money(product.compareAt!)}</Text> : null}
          </View>
        </View>
      </Pressable>
      <Pressable
        onPress={() => dispatch(addToCart({ product }))}
        style={({ pressed }) => [styles.add, pressed && { transform: [{ scale: 0.92 }] }]}
        hitSlop={8}
      >
        <Plus size={17} color={colors.onPrimary} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    position: "relative",
    ...shadow.soft,
  },
  media: { borderRadius: 0 },
  overlay: { position: "absolute", top: 10, left: 10, flexDirection: "row", gap: 6 },
  body: { padding: 12, paddingBottom: 14 },
  name: { ...type.label, fontSize: 14, lineHeight: 19, marginTop: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 6 },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 11, fontWeight: "700", color: colors.textSoft },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 7, marginTop: 8 },
  price: { fontSize: 16, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  compare: { fontSize: 12, color: colors.muted, textDecorationLine: "line-through" },
  add: {
    position: "absolute",
    right: 12,
    bottom: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
});
