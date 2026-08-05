import React from "react";
import { Text, View } from "react-native";
import { Check, MessageCircle, Phone } from "lucide-react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Button from "../../../components/Button";
import { Avatar, Badge, Card, Divider, EmptyState, SectionTitle, SummaryRow } from "../../../components/ui";
import { colors, money, radius, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useTrackingController from "./useTrackingController";

export default function Tracking() {
  const { values } = useTrackingController();
  const order = values.order;

  if (!order)
    return (
      <PrimaryLayout contentStyle={styles.page}>
        <Header title="Tracking" back />
        <View style={{ marginTop: spacing.xl }}>
          <EmptyState emoji="🚚" title="No order selected" description="Open an order from your history to follow it live." />
        </View>
      </PrimaryLayout>
    );

  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title={`#${order.reference}`} subtitle="Live delivery tracking" back />

      <Card tone="tint" style={{ marginTop: spacing.lg }}>
        <Badge label={order.status.replaceAll("_", " ")} tone="solid" />
        <Text style={[type.title, { marginTop: spacing.md }]}>Arriving in 28 minutes</Text>
        <Text style={[type.caption, { marginTop: 5 }]}>Your shopper is on the final stretch of the route.</Text>
      </Card>

      <Card style={{ marginTop: spacing.lg, flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        <Avatar name="Jamie Rivers" size={46} />
        <View style={{ flex: 1 }}>
          <Text style={type.label}>Jamie Rivers</Text>
          <Text style={[type.caption, { marginTop: 2 }]}>Your personal shopper · 4.9 ★</Text>
        </View>
        <View style={circle}>
          <MessageCircle size={17} color={colors.primaryDeep} />
        </View>
        <View style={circle}>
          <Phone size={17} color={colors.primaryDeep} />
        </View>
      </Card>

      <SectionTitle title="Progress" />
      <Card>
        {values.steps.map((step, index) => {
          const done = index < values.completedSteps;
          const current = index === values.completedSteps;
          return (
            <View key={step} style={{ flexDirection: "row", gap: spacing.md, paddingVertical: 8 }}>
              <View style={{ alignItems: "center" }}>
                <View
                  style={[
                    node,
                    done && { backgroundColor: colors.primary, borderColor: colors.primary },
                    current && { borderColor: colors.primary },
                  ]}
                >
                  {done ? <Check size={12} color={colors.onPrimary} strokeWidth={3} /> : null}
                </View>
                {index < values.steps.length - 1 ? (
                  <View style={[rail, done && { backgroundColor: colors.primarySoft }]} />
                ) : null}
              </View>
              <View style={{ flex: 1, paddingBottom: 6 }}>
                <Text style={[type.label, !done && !current && { color: colors.muted }]}>{step}</Text>
                <Text style={[type.caption, { marginTop: 2 }]}>
                  {done ? "Completed" : current ? "In progress now" : "Pending"}
                </Text>
              </View>
            </View>
          );
        })}
      </Card>

      <SectionTitle title="Order details" />
      <Card>
        {order.items.map((item, index) => (
          <View key={`${item.name}-${index}`}>
            {index > 0 ? <Divider style={{ marginVertical: spacing.sm }} /> : null}
            <SummaryRow label={`${item.qty} × ${item.name}`} value={money(item.price * item.qty)} />
          </View>
        ))}
        <Divider style={{ marginVertical: spacing.md }} />
        <SummaryRow strong label="Order total" value={money(order.total)} />
      </Card>

      <Button label="Get help with this order" variant="secondary" onPress={() => {}} style={{ marginTop: spacing.xl }} />
    </PrimaryLayout>
  );
}

const circle = {
  width: 40,
  height: 40,
  borderRadius: radius.pill,
  backgroundColor: colors.primaryTint,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const node = {
  width: 22,
  height: 22,
  borderRadius: 11,
  borderWidth: 2,
  borderColor: colors.border,
  backgroundColor: colors.surface,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const rail = { width: 2, flex: 1, minHeight: 20, backgroundColor: colors.border, marginTop: 3 };
