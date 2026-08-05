import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients, radius, shadow, type } from "../../theme";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  size?: "md" | "sm";
};

export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  icon,
  style,
  size = "md",
}: ButtonProps) {
  const height = size === "sm" ? 44 : 54;
  const isDisabled = disabled || loading;
  const content = (
    <View style={styles.content}>
      {loading ? (
        <ActivityIndicator size="small" color={variant === "primary" ? colors.onPrimary : colors.primary} />
      ) : (
        icon
      )}
      <Text
        style={[
          styles.label,
          variant === "secondary" && { color: colors.primaryDeep },
          variant === "ghost" && { color: colors.textSoft },
          variant === "danger" && { color: colors.danger },
          size === "sm" && { fontSize: 14 },
        ]}
      >
        {label}
      </Text>
    </View>
  );

  return (
    <Pressable
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        { height },
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        variant === "danger" && styles.danger,
        pressed && !isDisabled && { transform: [{ scale: 0.985 }], opacity: 0.94 },
        isDisabled && { opacity: 0.5 },
        style,
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={gradients.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      {content}
    </Pressable>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: colors.primary,
    ...shadow.card,
  },
  secondary: { backgroundColor: colors.primaryTint, borderWidth: 1, borderColor: "#d5e3c9", shadowOpacity: 0 },
  ghost: { backgroundColor: "transparent", shadowOpacity: 0, elevation: 0 },
  danger: { backgroundColor: colors.dangerTint, shadowOpacity: 0 },
  content: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  label: { ...type.label, fontSize: 15, color: colors.onPrimary },
});
