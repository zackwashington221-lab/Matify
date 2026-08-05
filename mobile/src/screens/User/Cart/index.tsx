import React from "react";
import { Text, View } from "react-native";
import { Sparkles, Trash2 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { Card, Divider, EmptyState, IconButton, ProductImage, Stepper, SummaryRow } from "../../../components/ui";
import { colors, money, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useCartController from "./useCartController";

export default function Cart() {
  const navigation = useNavigation<any>();
  const { values, functions } = useCartController();

  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Your basket" subtitle={`${values.lines.length} item${values.lines.length === 1 ? "" : "s"}`} />

      {values.lines.length === 0 ? (
        <View style={{ marginTop: spacing.xl }}>
          <EmptyState emoji="🧺" title="Your basket is empty" description="Add fresh groceries, or let the AI concierge build a basket for you.">
            <Button label="Browse groceries" onPress={() => navigation.navigate("Home")} style={{ marginTop: spacing.lg }} />
            <Button
              label="Ask Martify AI"
              variant="secondary"
              onPress={() => navigation.navigate("Assistant")}
              style={{ marginTop: spacing.md }}
            />
          </EmptyState>
        </View>
      ) : (
        <>
          <Card style={{ marginTop: spacing.lg }}>
            {values.lines.map((line, index) => (
              <View key={line.product._id}>
                {index > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
                <View style={{ flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
                  <ProductImage uri={line.product.imageUrl} emoji={line.product.emoji} height={64} glyphSize={28} style={{ width: 64 }} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text numberOfLines={1} style={type.label}>
                      {line.product.name}
                    </Text>
                    <Text style={[type.caption, { marginTop: 2 }]}>
                      {money(line.product.price)} · {line.product.unit || "each"}
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.md }}>
                      <Stepper
                        compact
                        value={line.qty}
                        onDecrease={() =>
                          line.qty === 1
                            ? functions.remove(line.product._id)
                            : functions.setQty(line.product._id, line.qty - 1)
                        }
                        onIncrease={() => functions.setQty(line.product._id, line.qty + 1)}
                      />
                      <IconButton tone="ghost" onPress={() => functions.remove(line.product._id)}>
                        <Trash2 size={16} color={colors.danger} />
                      </IconButton>
                    </View>
                  </View>
                  <Text style={[type.subtitle, { fontSize: 16 }]}>{money(line.product.price * line.qty)}</Text>
                </View>
              </View>
            ))}
          </Card>

          <Card tone="tint" style={{ marginTop: spacing.lg, flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
            <Sparkles size={17} color={colors.primaryDeep} />
            <View style={{ flex: 1 }}>
              <Text style={type.label}>Smarter basket available</Text>
              <Text style={[type.caption, { marginTop: 2 }]}>Martify AI found cheaper swaps for similar quality.</Text>
            </View>
            <Button label="Review" size="sm" variant="secondary" onPress={() => navigation.navigate("Assistant")} />
          </Card>

          <Card style={{ marginTop: spacing.lg }}>
            <SummaryRow label="Subtotal" value={money(values.subtotal)} />
            <SummaryRow label="Delivery" value={values.deliveryFee === 0 ? "Free" : money(values.deliveryFee)} />
            <SummaryRow label="Service & handling" value={money(values.serviceFee)} />
            <Divider style={{ marginVertical: spacing.md }} />
            <SummaryRow strong label="Estimated total" value={money(values.total)} />
          </Card>

          <Button
            label={`Continue to checkout · ${money(values.total)}`}
            onPress={functions.checkout}
            style={{ marginTop: spacing.xl }}
          />
          <Text style={[type.caption, { textAlign: "center", marginTop: spacing.md }]}>
            Free delivery on baskets over $45 · slots today
          </Text>
        </>
      )}
    </PrimaryLayout>
  );
}
