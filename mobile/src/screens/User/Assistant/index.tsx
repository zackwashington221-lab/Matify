import React from "react";
import { Pressable, Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import { styles } from "../../styles";
import useAssistantController from "./useAssistantController";

export default function Assistant() {
  const { values, functions } = useAssistantController();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Freshly AI" back />
      {values.messages.map((message, index) => (
        <View key={index} style={[styles.card, message.role === "user" && styles.hero]}>
          <Text style={message.role === "user" ? styles.heroText : styles.productName}>{message.text}</Text>
        </View>
      ))}
      <View style={styles.row}>
        <Input value={values.input} onChangeText={functions.setInput} placeholder="Ask Freshly AI…" style={{ flex: 1 }} />
        <Pressable onPress={functions.send}><Text style={styles.productName}>Send</Text></Pressable>
      </View>
    </PrimaryLayout>
  );
}
