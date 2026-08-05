import React from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, radius, shadow, spacing, type } from "../../theme";

/* ------------------------------------------------------------------ */
/* Surfaces                                                            */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  style,
  padded = true,
  tone = "surface",
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  tone?: "surface" | "sunken" | "tint" | "accent";
}) {
  return (
    <View
      style={[
        ui.card,
        tone === "sunken" && { backgroundColor: colors.surfaceSunken },
        tone === "tint" && { backgroundColor: colors.primaryTint, borderColor: "#d5e3c9" },
        tone === "accent" && { backgroundColor: colors.accentTint, borderColor: "#ecdcc2" },
        padded && { padding: spacing.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
  caption,
}: {
  title: string;
  caption?: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={ui.sectionTitle}>
      <View style={{ flex: 1 }}>
        <Text style={type.subtitle}>{title}</Text>
        {caption ? <Text style={[type.caption, { marginTop: 2 }]}>{caption}</Text> : null}
      </View>
      {action ? (
        <Pressable hitSlop={10} onPress={onAction}>
          <Text style={ui.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[ui.divider, style]} />;
}

/* ------------------------------------------------------------------ */
/* Atoms                                                               */
/* ------------------------------------------------------------------ */

export function Badge({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "sage" | "accent" | "danger" | "solid";
}) {
  const palette = {
    neutral: { bg: colors.surfaceAlt, fg: colors.textSoft },
    sage: { bg: colors.primaryTint, fg: colors.primaryDeep },
    accent: { bg: colors.accentTint, fg: colors.accent },
    danger: { bg: colors.dangerTint, fg: colors.danger },
    solid: { bg: colors.primary, fg: colors.onPrimary },
  }[tone];
  return (
    <View style={[ui.badge, { backgroundColor: palette.bg }]}>
      <Text style={[ui.badgeText, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
  emoji,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  emoji?: string;
}) {
  return (
    <Pressable onPress={onPress} style={[ui.chip, active && ui.chipActive]}>
      {emoji ? <Text style={{ fontSize: 14 }}>{emoji}</Text> : null}
      <Text style={[ui.chipText, active && { color: colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({
  children,
  onPress,
  tone = "surface",
  style,
}: {
  children: React.ReactNode;
  onPress?: () => void;
  tone?: "surface" | "primary" | "ghost";
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={({ pressed }) => [
        ui.iconButton,
        tone === "primary" && { backgroundColor: colors.primary, borderColor: colors.primary },
        tone === "ghost" && { backgroundColor: "transparent", borderColor: "transparent" },
        pressed && { opacity: 0.7 },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

export function Stepper({
  value,
  onDecrease,
  onIncrease,
  compact,
}: {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  compact?: boolean;
}) {
  return (
    <View style={[ui.stepper, compact && { height: 34, paddingHorizontal: 4 }]}>
      <Pressable hitSlop={8} onPress={onDecrease} style={ui.stepperButton}>
        <Text style={ui.stepperGlyph}>−</Text>
      </Pressable>
      <Text style={ui.stepperValue}>{value}</Text>
      <Pressable hitSlop={8} onPress={onIncrease} style={ui.stepperButton}>
        <Text style={ui.stepperGlyph}>+</Text>
      </Pressable>
    </View>
  );
}

export function Avatar({ name, size = 46 }: { name?: string; size?: number }) {
  const initials = (name || "Guest")
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return (
    <LinearGradient
      colors={gradients.sage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}
    >
      <Text style={{ color: colors.onPrimary, fontWeight: "800", fontSize: size * 0.34 }}>{initials}</Text>
    </LinearGradient>
  );
}

/* ------------------------------------------------------------------ */
/* Media                                                               */
/* ------------------------------------------------------------------ */

export function ProductImage({
  uri,
  emoji,
  height = 128,
  glyphSize = 54,
  style,
}: {
  uri?: string;
  emoji?: string;
  height?: number;
  glyphSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[ui.media, { height }, style]}>
      <LinearGradient colors={gradients.sand} style={StyleSheet.absoluteFill} />
      {uri ? (
        <Image source={{ uri }} resizeMode="cover" style={StyleSheet.absoluteFill} />
      ) : (
        <Text style={{ fontSize: glyphSize }}>{emoji || "🧺"}</Text>
      )}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* States                                                             */
/* ------------------------------------------------------------------ */

export function Loading({ label }: { label?: string }) {
  return (
    <View style={ui.stateBox}>
      <ActivityIndicator color={colors.primary} />
      {label ? <Text style={[type.caption, { marginTop: spacing.md }]}>{label}</Text> : null}
    </View>
  );
}

export function EmptyState({
  emoji = "🧺",
  title,
  description,
  children,
}: {
  emoji?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <Card style={{ alignItems: "center", paddingVertical: spacing.xxl }}>
      <View style={ui.emptyGlyph}>
        <Text style={{ fontSize: 30 }}>{emoji}</Text>
      </View>
      <Text style={[type.subtitle, { marginTop: spacing.lg, textAlign: "center" }]}>{title}</Text>
      {description ? (
        <Text style={[type.caption, { marginTop: 6, textAlign: "center", maxWidth: 260 }]}>{description}</Text>
      ) : null}
      {children ? <View style={{ alignSelf: "stretch" }}>{children}</View> : null}
    </Card>
  );
}

export function Skeleton({ height = 16, width = "100%", style }: { height?: number; width?: any; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height, width, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt }, style]} />;
}

export function ProductSkeletonGrid() {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: spacing.md }}>
      {[0, 1, 2, 3].map((key) => (
        <Card key={key} style={{ width: "47%" }} padded={false}>
          <Skeleton height={128} style={{ borderRadius: 0 }} />
          <View style={{ padding: spacing.md, gap: 8 }}>
            <Skeleton height={13} width="80%" />
            <Skeleton height={11} width="45%" />
            <Skeleton height={15} width="35%" />
          </View>
        </Card>
      ))}
    </View>
  );
}

/* ------------------------------------------------------------------ */
/* Rows                                                               */
/* ------------------------------------------------------------------ */

export function ListRow({
  title,
  subtitle,
  leading,
  trailing,
  onPress,
}: {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [ui.listRow, pressed && onPress ? { opacity: 0.75 } : null]}
    >
      {leading ? <View style={ui.listLeading}>{leading}</View> : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={type.label}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={2} style={[type.caption, { marginTop: 3 }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing}
    </Pressable>
  );
}

export function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={ui.summaryRow}>
      <Text style={strong ? type.label : type.caption}>{label}</Text>
      <Text style={[strong ? type.subtitle : type.label, strong && { fontSize: 17 }]}>{value}</Text>
    </View>
  );
}

export const ui = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    ...shadow.soft,
  },
  sectionTitle: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.md,
    marginTop: spacing.xxl,
    marginBottom: spacing.sm,
  },
  link: { ...type.label, color: colors.primary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.lg },
  badge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.pill, alignSelf: "flex-start" },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: "700", color: colors.textSoft },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    height: 40,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceSunken,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperButton: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  stepperGlyph: { fontSize: 18, fontWeight: "800", color: colors.primaryDeep, marginTop: -2 },
  stepperValue: { minWidth: 24, textAlign: "center", fontSize: 14, fontWeight: "800", color: colors.text },
  media: {
    borderRadius: radius.md,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
  },
  stateBox: { paddingVertical: spacing.xxxl, alignItems: "center" },
  emptyGlyph: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  listLeading: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 7,
  },
});
