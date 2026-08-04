import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import ProductCard from "../../../components/ProductCard";
import Button from "../../../components/Button";
import { styles } from "../../styles";
import useHomeController from "./useHomeController";
export default function Home() {
  const navigation = useNavigation<any>();
  const { values, functions } = useHomeController();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <View style={styles.top}>
        <View>
          <Text style={styles.eyebrow}>DELIVER TO</Text>
          <Text style={styles.titleSmall}>1247 Elm Street</Text>
        </View>
      </View>
      <Pressable style={styles.input} onPress={() => navigation.navigate("Search")}>
        <Text style={styles.muted}>Search apples, milk, snacks…</Text>
      </Pressable>
      <Pressable style={styles.hero} onPress={() => navigation.navigate("Assistant")}>
        <Text style={styles.heroKicker}>✦ AI CONCIERGE</Text>
        <Text style={styles.heroTitle}>Plan a healthy week{"\n"}for 2 in one tap.</Text>
        <Text style={styles.heroText}>Personalised picks · delivery today</Text>
      </Pressable>
      <Text style={styles.section}>Fresh for you</Text>
      {values.isLoading ? (
        <ActivityIndicator style={{ margin: 30 }} />
      ) : values.error ? (
        <View style={styles.card}>
          <Text style={styles.productName}>Products are unavailable right now.</Text>
          <Text style={styles.muted}>Check your connection and try again.</Text>
          <Button label="Try again" onPress={() => void functions.refetch()} />
        </View>
      ) : values.products.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.productName}>No products are available yet.</Text>
          <Text style={styles.muted}>Please check back soon for fresh groceries.</Text>
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
