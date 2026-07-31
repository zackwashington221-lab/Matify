import React from "react";
import { Pressable, Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import { styles } from "../../styles";
import useProfileController from "./useProfileController";

export default function Profile() {
  const { values, functions } = useProfileController();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="You" />
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>{values.user?.name || "Guest shopper"}</Text>
        <Text style={styles.heroText}>{values.user?.email || "Sign in to personalise Freshly"}</Text>
      </View>
      {values.profileLinks.map((item) => (
        <Pressable key={item.route} style={styles.card} onPress={() => functions.openLink(item.route)}>
          <Text style={styles.productName}>{item.label}</Text>
        </Pressable>
      ))}
      <Button label={values.user ? "Sign out" : "Sign in"} onPress={values.user ? functions.signOut : functions.signIn} />
    </PrimaryLayout>
  );
}
