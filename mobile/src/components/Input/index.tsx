import React from "react";
import { StyleSheet, TextInput, TextInputProps } from "react-native";
import { colors, radius } from "../../theme";
export default function Input(props: TextInputProps) {
  return (
    <TextInput {...props} style={[styles.input, props.style]} placeholderTextColor={colors.muted} />
  );
}
const styles = StyleSheet.create({
  input: {
    minHeight: 50,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 15,
    color: colors.text,
    marginTop: 12,
  },
});
