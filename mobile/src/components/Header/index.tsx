import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { colors, radius, type } from "../../theme";

export function ScreenHeader({
  title,
  subtitle,
  back,
  right,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: React.ReactNode;
}) {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable onPress={() => navigation.goBack()} style={styles.circle} hitSlop={10}>
          <ChevronLeft size={20} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text numberOfLines={1} style={type.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[type.caption, { marginTop: 2 }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

export default ScreenHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    minHeight: 48,
    marginBottom: 6,
  },
  circle: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
