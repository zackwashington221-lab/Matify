import React, { useEffect, useState } from "react";
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, Banner, Category, Product } from "../api/client";
import { Card, Chip } from "../components/ui";
import { colors, money, spacing, type } from "../theme";

export function ProductCard({ product, onPress }: { product: Product; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.tile}>
      <View style={styles.tileArt}>
        <Text style={{ fontSize: 40 }}>{product.emoji || "🛒"}</Text>
      </View>
      {product.aiTag ? (
        <Text style={[type.caption, { color: colors.primary, fontWeight: "700", marginTop: 8 }]}>{product.aiTag}</Text>
      ) : null}
      <Text style={[type.label, { marginTop: 4 }]} numberOfLines={1}>{product.name}</Text>
      <Text style={type.caption} numberOfLines={1}>{product.brand} · {product.unit}</Text>
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 6 }}>
        <Text style={[type.label, { fontSize: 15 }]}>{money(product.price)}</Text>
        {product.compareAt ? (
          <Text style={[type.caption, { textDecorationLine: "line-through" }]}>{money(product.compareAt)}</Text>
        ) : null}
      </View>
    </Pressable>
  );
}

export default function HomeScreen({ navigation }: any) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState("all");

  useEffect(() => {
    api.categories().then(setCategories).catch(() => {});
    api.banners().then(setBanners).catch(() => {});
  }, []);

  useEffect(() => {
    api.products({ category: active === "all" ? undefined : active }).then(setProducts).catch(() => {});
  }, [active]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 48 }}>
        <Text style={type.caption}>Delivering to Home · 25 min</Text>
        <Text style={[type.display, { marginTop: 2 }]}>Good morning</Text>

        {banners[0] ? (
          <Card style={{ marginTop: spacing.lg, backgroundColor: colors.primaryTint, borderColor: colors.primaryTint }}>
            <Text style={[type.title, { color: colors.primary }]}>{banners[0].title}</Text>
            <Text style={[type.caption, { marginTop: 4 }]}>{banners[0].subtitle}</Text>
          </Card>
        ) : null}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xl }}>
          <Chip label="All" active={active === "all"} onPress={() => setActive("all")} />
          {categories.map((c) => (
            <Chip key={c._id} label={`${c.emoji || ""} ${c.name}`} active={active === c.slug} onPress={() => setActive(c.slug)} />
          ))}
        </ScrollView>

        <Text style={[type.title, { marginTop: spacing.xl, marginBottom: spacing.md }]}>Picked for you</Text>
        <FlatList
          data={products}
          scrollEnabled={false}
          numColumns={2}
          keyExtractor={(p) => p._id}
          columnWrapperStyle={{ gap: spacing.md }}
          contentContainerStyle={{ gap: spacing.md }}
          renderItem={({ item }) => (
            <ProductCard product={item} onPress={() => navigation.navigate("Product", { slug: item.slug })} />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  tileArt: {
    height: 96,
    borderRadius: 16,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
});
