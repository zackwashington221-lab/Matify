import React from "react";
import { Pressable, Text, View } from "react-native";
import { ChevronRight, Package } from "lucide-react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { Badge, Card, EmptyState, Loading } from "../../../components/ui";
import { colors, money, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useOrdersController from "./useOrdersController";

const toneFor = (status: string) =>
  status.includes("deliver") ? "sage" : status.includes("cancel") ? "danger" : "accent";

export default function Orders() {
  const { values, functions } = useOrdersController();

  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Orders" subtitle="Track deliveries and reorder favourites" />

      {!values.user ? (
        <View style={{ marginTop: spacing.xl }}>
          <EmptyState emoji="🔐" title="Sign in to view orders" description="Your delivery history and live tracking live here.">
            <Button label="Sign in" onPress={functions.signIn} style={{ marginTop: spacing.lg }} />
          </EmptyState>
        </View>
      ) : values.isLoading ? (
        <Loading label="Fetching your orders…" />
      ) : values.orders.length === 0 ? (
        <View style={{ marginTop: spacing.xl }}>
          <EmptyState emoji="📦" title="No orders yet" description="Your first Martify delivery will appear here." />
        </View>
      ) : (
        values.orders.map((order) => (
          <Pressable key={order._id} onPress={() => functions.openOrder(order)}>
            <Card style={{ marginTop: spacing.md }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                <View style={iconBox}>
                  <Package size={18} color={colors.primaryDeep} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={type.label}>#{order.reference}</Text>
                  <Text style={[type.caption, { marginTop: 2 }]}>
                    {new Date(order.placedAt).toLocaleDateString()} · {order.items.length} items
                  </Text>
                </View>
                <ChevronRight size={18} color={colors.muted} />
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.lg }}>
                <Badge label={order.status.replaceAll("_", " ")} tone={toneFor(order.status) as any} />
                <Text style={[type.subtitle, { fontSize: 17 }]}>{money(order.total)}</Text>
              </View>
            </Card>
          </Pressable>
        ))
      )}
    </PrimaryLayout>
  );
}

const iconBox = {
  width: 42,
  height: 42,
  borderRadius: 14,
  backgroundColor: colors.primaryTint,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};
