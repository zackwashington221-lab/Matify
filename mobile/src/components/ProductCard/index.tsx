import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { Product } from "../../helpers/types";
import { useAppDispatch } from "../../redux/hook/hook";
import { addToCart } from "../../redux/slice/cartSlice";
import { colors, radius } from "../../theme";

export function ProductCard({ product }: { product: Product }) {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  return (
    <View style={styles.card}>
      <Pressable onPress={() => navigation.navigate("Product", { slug: product.slug })}>
        <View style={styles.image}>
          <Text style={styles.emoji}>{product.emoji || "🥬"}</Text>
        </View>
        <Text numberOfLines={1} style={styles.name}>
          {product.name}
        </Text>
        <Text style={styles.muted}>{product.unit || "each"}</Text>
        <Text style={styles.price}>
          {"$"}
          {product.price.toFixed(2)}
        </Text>
      </Pressable>
      <Pressable onPress={() => dispatch(addToCart({ product }))} style={styles.add}>
        <Ionicons name="add" size={18} color="#fff" />
      </Pressable>
    </View>
  );
}

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    width: "47%",
    borderRadius: radius.lg,
    padding: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
  },
  image: {
    height: 126,
    borderRadius: 16,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 55 },
  name: { color: colors.text, fontSize: 13, fontWeight: "800", marginTop: 9 },
  muted: { color: colors.muted, fontSize: 12, marginTop: 3 },
  price: { color: colors.text, fontSize: 14, fontWeight: "800", marginTop: 6 },
  add: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
