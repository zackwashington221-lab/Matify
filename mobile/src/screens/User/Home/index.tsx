import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bell, MapPin, Search as SearchIcon, Sparkles } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import ProductCard from "../../../components/ProductCard";
import Button from "../../../components/Button";
import { Avatar, Badge, Card, EmptyState, IconButton, ProductSkeletonGrid, SectionTitle } from "../../../components/ui";
import { colors, gradients, radius, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useHomeController from "./useHomeController";

export default function Home() {
  const navigation = useNavigation<any>();
  const { values, functions } = useHomeController();

  return (
    <PrimaryLayout contentStyle={styles.page}>
      <View style={styles.top}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <MapPin size={12} color={colors.muted} />
            <Text style={styles.eyebrow}>DELIVER TO</Text>
          </View>
          <Text numberOfLines={1} style={styles.titleSmall}>
            1247 Elm Street · Apt 4B
          </Text>
        </View>
        <IconButton onPress={() => navigation.navigate("Notifications")}>
          <Bell size={18} color={colors.text} />
          <View style={dot} />
        </IconButton>
        <Pressable onPress={() => navigation.navigate("Profile")}>
          <Avatar name={values.user?.name} size={42} />
        </Pressable>
      </View>

      <Text style={styles.title}>
        Good {values.greeting}, {values.user?.name?.split(" ")[0] || "there"}.
      </Text>
      <Text style={[type.body, { marginTop: 6 }]}>Fresh picks, curated for your kitchen today.</Text>

      <Pressable style={[styles.input, { marginTop: spacing.xl, flexDirection: "row", alignItems: "center", gap: 10 }]} onPress={() => navigation.navigate("Search")}>
        <SearchIcon size={17} color={colors.muted} />
        <Text style={type.caption}>Search apples, oat milk, sourdough…</Text>
      </Pressable>

      <Pressable onPress={() => navigation.navigate("Assistant")} style={styles.hero}>
        <LinearGradient colors={gradients.primary} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", inset: 0 as any, top: 0, left: 0, right: 0, bottom: 0 }} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Sparkles size={13} color={colors.onPrimarySoft} />
          <Text style={styles.heroKicker}>AI CONCIERGE</Text>
        </View>
        <Text style={styles.heroTitle}>Plan a healthy week{"\n"}for two in one tap.</Text>
        <Text style={styles.heroText}>Budget-aware baskets · same-day delivery slots</Text>
        <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.lg }}>
          <View style={pill}>
            <Text style={pillText}>Build my basket</Text>
          </View>
          <View style={pill}>
            <Text style={pillText}>Under $60</Text>
          </View>
        </View>
      </Pressable>

      <SectionTitle title="Shop by aisle" caption="Everything from produce to pantry" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
        {values.categories.map((category) => (
          <Pressable
            key={category._id}
            onPress={() => navigation.navigate("Search", { category: category.slug })}
            style={categoryTile}
          >
            <Text style={{ fontSize: 26 }}>{category.emoji || "🧺"}</Text>
            <Text numberOfLines={1} style={[type.label, { fontSize: 12, marginTop: 8 }]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {values.banners.length ? (
        <>
          <SectionTitle title="This week at Martify" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingVertical: 4 }}>
            {values.banners.map((banner) => (
              <Card key={banner._id} tone="accent" style={{ width: 262 }}>
                <Badge label={banner.ctaLabel || "Offer"} tone="accent" />
                <Text style={[type.subtitle, { marginTop: 10 }]}>{banner.title}</Text>
                <Text style={[type.caption, { marginTop: 5 }]}>{banner.subtitle}</Text>
              </Card>
            ))}
          </ScrollView>
        </>
      ) : null}

      <SectionTitle title="Fresh for you" action="See all" onAction={() => navigation.navigate("Search")} />
      {values.isLoading ? (
        <ProductSkeletonGrid />
      ) : values.error ? (
        <EmptyState emoji="📡" title="Products are unavailable right now" description="We could not reach the Martify catalog. Check your connection and try again.">
          <Button label="Try again" onPress={() => void functions.refetch()} style={{ marginTop: spacing.lg }} />
        </EmptyState>
      ) : values.products.length === 0 ? (
        <EmptyState emoji="🌾" title="No products yet" description="Fresh groceries are being stocked — check back shortly." />
      ) : (
        <View style={styles.grid}>
          {values.products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </View>
      )}
    </PrimaryLayout>
  );
}

const dot = {
  position: "absolute" as const,
  top: 9,
  right: 10,
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: colors.accent,
  borderWidth: 1.5,
  borderColor: colors.surface,
};

const pill = {
  paddingHorizontal: 13,
  paddingVertical: 7,
  borderRadius: radius.pill,
  backgroundColor: "rgba(255,255,255,0.16)",
};

const pillText = { color: "#fff", fontSize: 11.5, fontWeight: "700" as const };

const categoryTile = {
  width: 96,
  paddingVertical: spacing.lg,
  paddingHorizontal: spacing.md,
  alignItems: "center" as const,
  borderRadius: radius.lg,
  backgroundColor: colors.surface,
  borderWidth: 1,
  borderColor: colors.border,
};
