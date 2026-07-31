import React from "react";
import { Text, View } from "react-native";
import PrimaryLayout from "../../layouts/PrimaryLayout";
import Header from "../Header";
import { styles } from "../../screens/styles";

type AccountListProps = {
  title: string;
  description: string;
  items: { title: string; detail: string }[];
};

export default function AccountList({ title, description, items }: AccountListProps) {
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title={title} back />
      <Text style={styles.muted}>{description}</Text>
      {items.map((item) => (
        <View key={item.title} style={styles.card}>
          <Text style={styles.productName}>{item.title}</Text>
          <Text style={styles.muted}>{item.detail}</Text>
        </View>
      ))}
    </PrimaryLayout>
  );
}
