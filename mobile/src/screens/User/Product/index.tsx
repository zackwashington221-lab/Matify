import React from "react";
import { Pressable, Text, View } from "react-native";
import { Heart, Leaf, Share2, ShieldCheck, Star, Truck } from "lucide-react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { Badge, Card, Divider, IconButton, Loading, ProductImage, SectionTitle, Stepper } from "../../../components/ui";
import { colors, money, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useProductController from "./useProductController";

export default function Product() {
  const { values, functions } = useProductController();
  if (values.isLoading || !values.product) return <Loading label="Loading product…" />;
  const product = values.product;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <PrimaryLayout contentStyle={[styles.page, { paddingBottom: 170 }]}>
        <Header
          title=""
          back
          right={
            <View style={{ flexDirection: "row", gap: 8 }}>
              <IconButton>
                <Heart size={17} color={colors.text} />
              </IconButton>
              <IconButton>
                <Share2 size={17} color={colors.text} />
              </IconButton>
            </View>
          }
        />

        <ProductImage uri={product.imageUrl} emoji={product.emoji} height={300} glyphSize={120} style={styles.productImage} />

        <View style={{ flexDirection: "row", gap: 6, marginTop: spacing.lg }}>
          {product.aiTag ? <Badge label={`✦ ${product.aiTag}`} tone="solid" /> : null}
          {product.organic ? <Badge label="Organic" tone="sage" /> : null}
          <Badge label={`In stock · ${product.stock ?? 24}`} tone="neutral" />
        </View>

        <Text style={[type.eyebrow, { marginTop: spacing.lg }]}>{(product.brand || "MARTIFY").toUpperCase()}</Text>
        <Text style={[type.display, { fontSize: 26, marginTop: 5 }]}>{product.name}</Text>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Star size={13} color={colors.accent} fill={colors.accent} />
            <Text style={type.label}>{(product.rating || 4.7).toFixed(1)}</Text>
          </View>
          <Text style={type.caption}>· {product.unit || "each"}</Text>
        </View>

        <Text style={[type.body, { marginTop: spacing.md }]}>
          {product.description || "Fresh groceries, hand-picked by our shoppers and delivered when you need them."}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10, marginTop: spacing.lg }}>
          <Text style={[styles.productPrice, { fontSize: 28 }]}>{money(product.price)}</Text>
          {product.compareAt && product.compareAt > product.price ? (
            <Text style={{ fontSize: 14, color: colors.muted, textDecorationLine: "line-through" }}>
              {money(product.compareAt)}
            </Text>
          ) : null}
        </View>

        <Card style={{ marginTop: spacing.xl }}>
          {[
            { icon: <Truck size={16} color={colors.primary} />, title: "Delivery today", detail: "Order within 2h for the 6–8pm slot" },
            { icon: <Leaf size={16} color={colors.primary} />, title: "Farm traceable", detail: "Sourced from partner growers this week" },
            { icon: <ShieldCheck size={16} color={colors.primary} />, title: "Freshness promise", detail: "Not happy? Refunded, no questions" },
          ].map((item, index) => (
            <View key={item.title}>
              {index > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                {item.icon}
                <View style={{ flex: 1 }}>
                  <Text style={type.label}>{item.title}</Text>
                  <Text style={[type.caption, { marginTop: 2 }]}>{item.detail}</Text>
                </View>
              </View>
            </View>
          ))}
        </Card>

        <SectionTitle title="Nutrition at a glance" />
        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { label: "Calories", value: "112" },
            { label: "Protein", value: "3g" },
            { label: "Fibre", value: "5g" },
          ].map((macro) => (
            <Card key={macro.label} tone="sunken" style={{ flex: 1, alignItems: "center" }}>
              <Text style={[type.subtitle, { fontSize: 18 }]}>{macro.value}</Text>
              <Text style={[type.caption, { marginTop: 3 }]}>{macro.label}</Text>
            </Card>
          ))}
        </View>
      </PrimaryLayout>

      <View style={styles.stickyBar}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
          <Stepper value={values.quantity} onDecrease={functions.decrease} onIncrease={functions.increase} />
          <Button
            label={`Add · ${money(product.price * values.quantity)}`}
            onPress={functions.addToCart}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </View>
  );
}
