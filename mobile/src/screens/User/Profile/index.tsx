import React from "react";
import { Pressable, Text, View } from "react-native";
import {
  Bell,
  ChevronRight,
  CreditCard,
  Heart,
  LogOut,
  MapPin,
  Receipt,
  Sparkles,
} from "lucide-react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { Avatar, Badge, Card, Divider, ListRow, SectionTitle } from "../../../components/ui";
import { colors, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useProfileController from "./useProfileController";

const icons: Record<string, React.ReactNode> = {
  Orders: <Receipt size={17} color={colors.primaryDeep} />,
  Wishlist: <Heart size={17} color={colors.primaryDeep} />,
  Addresses: <MapPin size={17} color={colors.primaryDeep} />,
  PaymentMethods: <CreditCard size={17} color={colors.primaryDeep} />,
  AiPreferences: <Sparkles size={17} color={colors.primaryDeep} />,
  Notifications: <Bell size={17} color={colors.primaryDeep} />,
};

export default function Profile() {
  const { values, functions } = useProfileController();

  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Account" subtitle="Preferences, payments and history" />

      <Card style={{ marginTop: spacing.lg }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.lg }}>
          <Avatar name={values.user?.name} size={58} />
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={type.subtitle}>
              {values.user?.name || "Guest shopper"}
            </Text>
            <Text numberOfLines={1} style={[type.caption, { marginTop: 3 }]}>
              {values.user?.email || "Sign in to personalise Martify"}
            </Text>
            <View style={{ marginTop: 8 }}>
              <Badge label={values.user ? "Martify Plus member" : "Guest"} tone={values.user ? "sage" : "neutral"} />
            </View>
          </View>
        </View>
        <Divider style={{ marginVertical: spacing.lg }} />
        <View style={{ flexDirection: "row" }}>
          {[
            { label: "Orders", value: "18" },
            { label: "Saved", value: "$142" },
            { label: "Slots kept", value: "100%" },
          ].map((stat) => (
            <View key={stat.label} style={{ flex: 1, alignItems: "center" }}>
              <Text style={[type.subtitle, { fontSize: 17 }]}>{stat.value}</Text>
              <Text style={[type.caption, { marginTop: 2 }]}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle title="Your Martify" />
      <Card>
        {values.profileLinks.map((item, index) => (
          <View key={item.route}>
            {index > 0 ? <Divider style={{ marginVertical: 2 }} /> : null}
            <ListRow
              title={item.label}
              leading={icons[item.route]}
              trailing={<ChevronRight size={18} color={colors.muted} />}
              onPress={() => functions.openLink(item.route)}
            />
          </View>
        ))}
      </Card>

      <Button
        label={values.user ? "Sign out" : "Sign in"}
        variant={values.user ? "danger" : "primary"}
        icon={values.user ? <LogOut size={16} color={colors.danger} /> : undefined}
        onPress={values.user ? functions.signOut : functions.signIn}
        style={{ marginTop: spacing.xxl }}
      />
      <Pressable>
        <Text style={[type.caption, { textAlign: "center", marginTop: spacing.lg }]}>Martify · v1.0.0</Text>
      </Pressable>
    </PrimaryLayout>
  );
}
