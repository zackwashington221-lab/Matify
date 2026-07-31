import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius } from "../../theme";

type ButtonProps = { label: string; onPress: () => void; disabled?: boolean };

export function PrimaryButton({ label, onPress, disabled }: ButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

export default PrimaryButton;

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  disabled: { opacity: 0.55 },
  label: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
