import React from "react";
import { Text, View } from "react-native";
import { Clock, CreditCard, MapPin, ShieldCheck } from "lucide-react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { Card, Chip, Divider, SectionTitle, SummaryRow } from "../../../components/ui";
import { colors, money, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useCheckoutController from "./useCheckoutController";

export default function Checkout() {
  const { values, functions } = useCheckoutController();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Checkout" subtitle="Review and confirm your delivery" back />

      <SectionTitle title="Delivery address" />
      <Card>
        <Input
          label="Street address"
          value={values.address}
          onChangeText={functions.setAddress}
          placeholder="1247 Elm Street, Apt 4B"
          leading={<MapPin size={16} color={colors.muted} />}
          containerStyle={{ marginTop: 0 }}
        />
        <Text style={[type.caption, { marginTop: spacing.md }]}>
          Leave at the door · our shopper will text on arrival.
        </Text>
      </Card>

      <SectionTitle title="Delivery slot" caption="Same-day windows available" />
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {values.slots.map((slot) => (
          <Chip
            key={slot}
            label={slot}
            active={values.slot === slot}
            onPress={() => functions.setSlot(slot)}
          />
        ))}
      </View>

      <SectionTitle title="Payment" />
      <Card>
        {values.paymentMethods.map((method, index) => (
          <View key={method.id}>
            {index > 0 ? <Divider style={{ marginVertical: spacing.md }} /> : null}
            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
              <CreditCard size={17} color={values.payment === method.id ? colors.primary : colors.muted} />
              <View style={{ flex: 1 }}>
                <Text style={type.label}>{method.label}</Text>
                <Text style={[type.caption, { marginTop: 2 }]}>{method.detail}</Text>
              </View>
              <Chip
                label={values.payment === method.id ? "Selected" : "Use"}
                active={values.payment === method.id}
                onPress={() => functions.setPayment(method.id)}
              />
            </View>
          </View>
        ))}
      </Card>

      <SectionTitle title="Order summary" />
      <Card>
        <SummaryRow label={`Items (${values.itemCount})`} value={money(values.subtotal)} />
        <SummaryRow label="Delivery" value={values.deliveryFee === 0 ? "Free" : money(values.deliveryFee)} />
        <SummaryRow label="Service & handling" value={money(values.serviceFee)} />
        <SummaryRow label="Shopper tip" value={money(values.tip)} />
        <Divider style={{ marginVertical: spacing.md }} />
        <SummaryRow strong label="Total due" value={money(values.total)} />
      </Card>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: spacing.lg }}>
        {values.tipOptions.map((option) => (
          <Chip key={option} label={option === 0 ? "No tip" : money(option)} active={values.tip === option} onPress={() => functions.setTip(option)} />
        ))}
      </View>

      <Card tone="tint" style={{ marginTop: spacing.xl, flexDirection: "row", gap: spacing.md, alignItems: "center" }}>
        <ShieldCheck size={17} color={colors.primaryDeep} />
        <Text style={[type.caption, { flex: 1 }]}>Payments are encrypted and never stored on your device.</Text>
      </Card>

      <Button
        label={values.isLoading ? "Placing order…" : `Place secure order · ${money(values.total)}`}
        loading={values.isLoading}
        onPress={() => void functions.placeOrder()}
        style={{ marginTop: spacing.xl }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: spacing.md }}>
        <Clock size={12} color={colors.muted} />
        <Text style={type.caption}>Arriving {values.slot.toLowerCase()}</Text>
      </View>
    </PrimaryLayout>
  );
}
