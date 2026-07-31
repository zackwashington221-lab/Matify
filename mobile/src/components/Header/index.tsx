import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../theme";

export function ScreenHeader({ title, back }: { title: string; back?: boolean }) {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.header}>
      {back ? (
        <Pressable onPress={() => navigation.goBack()} style={styles.button}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      ) : (
        <View style={styles.button} />
      )}
      <Text style={styles.title}>{title}</Text>
      <View style={styles.button} />
    </View>
  );
}

export default ScreenHeader;

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: { width: 38, height: 38, alignItems: "center", justifyContent: "center" },
  title: { color: colors.text, fontSize: 17, fontWeight: "800" },
});
