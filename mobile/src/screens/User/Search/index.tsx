import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import ProductCard from "../../../components/ProductCard";
import { Chip, EmptyState, IconButton, ProductSkeletonGrid } from "../../../components/ui";
import { colors, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useSearchController from "./useSearchController";

export default function Search() {
  const { values, functions } = useSearchController();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header
        title="Discover"
        subtitle="Search the full Martify catalog"
        right={
          <IconButton>
            <SlidersHorizontal size={17} color={colors.text} />
          </IconButton>
        }
      />
      <Input
        value={values.query}
        onChangeText={functions.setQuery}
        placeholder="Search groceries, brands, recipes"
        leading={<SearchIcon size={17} color={colors.muted} />}
        autoCorrect={false}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingVertical: spacing.lg }}
      >
        <Chip label="All" active={!values.category} onPress={() => functions.setCategory(undefined)} />
        {values.categories.map((category) => (
          <Chip
            key={category._id}
            label={category.name}
            emoji={category.emoji}
            active={values.category === category.slug}
            onPress={() => functions.setCategory(category.slug)}
          />
        ))}
      </ScrollView>

      <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
        <Text style={type.subtitle}>{values.query ? "Results" : "Popular groceries"}</Text>
        <Text style={type.caption}>{values.products.length} items</Text>
      </View>

      {values.isLoading ? (
        <ProductSkeletonGrid />
      ) : values.products.length === 0 ? (
        <View style={{ marginTop: spacing.lg }}>
          <EmptyState
            emoji="🔍"
            title="No matches found"
            description="Try a different search term, or browse another aisle."
          />
        </View>
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
