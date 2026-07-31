import React from "react";
import { Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import { styles } from "../../styles";
import useTrackingController from "./useTrackingController";

export default function Tracking() {
  const { values } = useTrackingController();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Order tracking" back />
      <View style={styles.hero}>
        <Text style={styles.heroKicker}>ARRIVING IN</Text>
        <Text style={styles.heroTitle}>28 minutes</Text>
        <Text style={styles.heroText}>Order #{values.order?.reference || "FR-4821"} is being prepared.</Text>
      </View>
      {values.steps.map((step, index) => (
        <View key={step} style={styles.card}>
          <Text style={styles.productName}>{index < values.completedSteps ? "✓ " : "○ "}{step}</Text>
          <Text style={styles.muted}>{index < values.completedSteps ? "Complete" : "Estimated soon"}</Text>
        </View>
      ))}
    </PrimaryLayout>
  );
}
