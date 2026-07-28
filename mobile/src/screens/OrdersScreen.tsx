import React, { useCallback, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { api, Order } from "../api/client";
import { Badge, Card } from "../components/ui";
import { colors, money, spacing, type } from "../theme";

const tone: Record<string, "muted" | "success" | "warning" | "danger"> = {
  pending: "warning",
  confirmed: "muted",
  picking: "warning",
  out_for_delivery: "warning",
  delivered: "success",
  cancelled: "danger",
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(() => {
    setRefreshing(true);
    api.myOrders().then(setOrders).catch(() => {}).finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <View style={{ padding: spacing.lg }}>
        <Text style={type.display}>Orders</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(o) => o._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md, paddingBottom: 32 }}
        ListEmptyComponent={<Text style={type.caption}>No orders yet — sign in and place your first basket.</Text>}
        renderItem={({ item }) => (
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={type.label}>{item.reference}</Text>
              <Badge label={item.status.replace(/_/g, " ")} tone={tone[item.status] || "muted"} />
            </View>
            <Text style={[type.caption, { marginTop: 6 }]}>
              {item.items.length} item{item.items.length === 1 ? "" : "s"} · {new Date(item.placedAt).toLocaleDateString()}
            </Text>
            <Text style={[type.title, { marginTop: 8, fontSize: 17 }]}>{money(item.total)}</Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}
