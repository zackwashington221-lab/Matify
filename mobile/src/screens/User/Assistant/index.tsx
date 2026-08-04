import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import { styles } from "../../styles";
import useAssistantController from "./useAssistantController";

export default function Assistant() {
  const { values, functions } = useAssistantController();
  const navigation = useNavigation<any>();
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Martify AI" back />
      {values.messages.map((message, index) => (
        <View key={index} style={[styles.card, message.role === "user" && styles.hero]}>
          <Text style={message.role === "user" ? styles.heroText : styles.productName}>{message.text}</Text>
          {message.recommendations?.map((recommendation) => (
            <Pressable
              key={recommendation.product._id}
              style={styles.card}
              onPress={() => navigation.navigate("Product", { slug: recommendation.product.slug })}
            >
              <Text style={styles.productName}>{recommendation.product.emoji || "🛍️"} {recommendation.product.name} × {recommendation.qty}</Text>
              <Text style={styles.muted}>{recommendation.reason}</Text>
              <Text style={styles.productPrice}>${(recommendation.product.price * recommendation.qty).toFixed(2)}</Text>
            </Pressable>
          ))}
          {message.recommendations?.length ? <Text style={styles.muted}>Basket total: ${message.total?.toFixed(2)}</Text> : null}
        </View>
      ))}
      {values.isLoading ? <ActivityIndicator style={{ marginVertical: 12 }} /> : null}
      <View style={styles.row}>
        <Input value={values.input} onChangeText={functions.setInput} placeholder="Ask Martify AI…" style={{ flex: 1 }} editable={!values.isLoading} />
        <Pressable onPress={() => void functions.send()} disabled={values.isLoading}><Text style={styles.productName}>Send</Text></Pressable>
      </View>
    </PrimaryLayout>
  );
}
