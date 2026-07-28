import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, Product } from "../api/client";
import { ProductCard } from "./HomeScreen";
import { colors, spacing, type } from "../theme";

export default function SearchScreen({ navigation }: any) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    const t = setTimeout(() => {
      api.products({ q }).then(setResults).catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Text style={type.display}>Search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Try “weeknight dinner under $30”"
          placeholderTextColor={colors.muted}
          style={styles.input}
        />
      </View>
      <FlatList
        data={results}
        numColumns={2}
        keyExtractor={(p) => p._id}
        columnWrapperStyle={{ gap: spacing.md }}
        contentContainerStyle={{ gap: spacing.md, paddingHorizontal: spacing.lg, paddingBottom: 48 }}
        ListEmptyComponent={<Text style={type.caption}>No matches yet — try another term.</Text>}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate("Product", { slug: item.slug })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: spacing.md,
    height: 48,
    borderRadius: 999,
    paddingHorizontal: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
});
