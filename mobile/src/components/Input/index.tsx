import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View, type TextInputProps, type StyleProp, type ViewStyle } from "react-native";
import { colors, radius, type } from "../../theme";

type InputProps = TextInputProps & {
  label?: string;
  hint?: string;
  error?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function Input({ label, hint, error, leading, trailing, containerStyle, style, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[{ marginTop: 14 }, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.field, focused && styles.fieldFocused, !!error && styles.fieldError]}>
        {leading ? <View style={styles.affix}>{leading}</View> : null}
        <TextInput
          {...rest}
          onFocus={(event) => {
            setFocused(true);
            rest.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            rest.onBlur?.(event);
          }}
          placeholderTextColor={colors.muted}
          style={[styles.input, style]}
        />
        {trailing ? <View style={styles.affix}>{trailing}</View> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...type.eyebrow, marginBottom: 7 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 54,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fieldFocused: { borderColor: colors.primarySoft, backgroundColor: "#fff" },
  fieldError: { borderColor: colors.danger, backgroundColor: colors.dangerTint },
  affix: { alignItems: "center", justifyContent: "center" },
  input: { flex: 1, fontSize: 15, color: colors.text, paddingVertical: 14 },
  hint: { ...type.caption, marginTop: 6 },
  error: { ...type.caption, color: colors.danger, marginTop: 6, fontWeight: "600" },
});
