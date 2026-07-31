import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { styles } from "../../styles";
import useOrdersController from "./useOrdersController";

export default function Orders() {
  const { values, functions } = useOrdersController();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Orders" />
      {!values.user ? (
        <Button label="Sign in to view orders" onPress={functions.signIn} />
      ) : values.isLoading ? (
        <ActivityIndicator style={{ margin: 30 }} />
      ) : (
        values.orders.map((order) => (
          <Pressable key={order._id} style={styles.card} onPress={() => functions.openOrder(order)}>
            <Text style={styles.productName}>#{order.reference}</Text>
            <Text style={styles.muted}>{order.status.replaceAll("_", " ")} · {order.items.length} items</Text>
            <Text style={styles.productPrice}>{"$"}{order.total.toFixed(2)}</Text>
          </Pressable>
        ))
      )}
    </PrimaryLayout>
  );
}
