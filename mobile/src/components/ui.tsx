import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, radius, shadow, spacing, type } from "../theme";

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label, onPress, variant = "primary", loading, disabled,
}: {
  label: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  loading?: boolean;
  disabled?: boolean;
}) {
  const bg = variant === "primary" ? colors.primary : variant === "secondary" ? colors.surfaceAlt : "transparent";
  const fg = variant === "primary" ? "#fff" : colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        variant === "ghost" && { borderWidth: 1, borderColor: colors.border },
      ]}
    >
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[styles.buttonLabel, { color: fg }]}>{label}</Text>}
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && { backgroundColor: colors.primary, borderColor: colors.primary }]}
    >
      <Text style={[type.caption, { fontWeight: "600" }, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

export function Badge({ label, tone = "muted" }: { label: string; tone?: "muted" | "success" | "warning" | "danger" }) {
  const map = { muted: colors.muted, success: colors.success, warning: colors.warning, danger: colors.danger };
  return (
    <View style={[styles.badge, { backgroundColor: `${map[tone]}1A` }]}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: map[tone] }}>{label}</Text>
    </View>
  );
}

export function Screen({ children }: { children: React.ReactNode }) {
  return <View style={styles.screen}>{children}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },
  button: {
    height: 50,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  buttonLabel: { fontSize: 15, fontWeight: "700" },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: spacing.sm,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, alignSelf: "flex-start" },
});
