import React from "react";
import { Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import PrimaryLayout from "../../layouts/PrimaryLayout";
import Header from "../Header";
import { Card, Divider, EmptyState, ListRow } from "../ui";
import { colors, spacing, type } from "../../theme";
import { styles } from "../../screens/styles";

type AccountListProps = {
  title: string;
  description: string;
  items: { title: string; detail: string; emoji?: string }[];
};

export default function AccountList({ title, description, items }: AccountListProps) {
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title={title} back />
      <Text style={[type.body, { marginTop: 2 }]}>{description}</Text>
      {items.length === 0 ? (
        <View style={{ marginTop: spacing.xl }}>
          <EmptyState title="Nothing here yet" description="Once you add details they will show up on this screen." />
        </View>
      ) : (
        <Card style={{ marginTop: spacing.xl }}>
          {items.map((item, index) => (
            <View key={item.title}>
              {index > 0 ? <Divider style={{ marginVertical: 4 }} /> : null}
              <ListRow
                title={item.title}
                subtitle={item.detail}
                leading={<Text style={{ fontSize: 18 }}>{item.emoji || "•"}</Text>}
                trailing={<ChevronRight size={18} color={colors.muted} />}
              />
            </View>
          ))}
        </Card>
      )}
    </PrimaryLayout>
  );
}
