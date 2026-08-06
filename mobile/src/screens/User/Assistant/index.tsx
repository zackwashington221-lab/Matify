import React from "react";
import { Pressable, Text, View } from "react-native";
import { Send, Sparkles } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import { Badge, Card, Divider, Loading, ProductImage } from "../../../components/ui";
import { colors, money, radius, spacing, type } from "../../../theme";
import { styles } from "../../styles";
import useAssistantController from "./useAssistantController";

export default function Assistant() {
  const { values, functions } = useAssistantController();
  const navigation = useNavigation<any>();

  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Martify AI" subtitle="Budget-aware baskets and swaps" back />

      {values.messages.map((message, index) =>
        message.role === "user" ? (
          <View key={index} style={bubbleUser}>
            <Text style={{ color: colors.onPrimary, fontSize: 14, lineHeight: 20 }}>{message.text}</Text>
          </View>
        ) : (
          <Card key={index} style={{ marginTop: spacing.md, alignSelf: "flex-start", maxWidth: "94%" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Sparkles size={13} color={colors.primary} />
              <Text style={type.eyebrow}>MARTIFY AI</Text>
            </View>
            <Text style={[type.body, { marginTop: 8 }]}>{message.text}</Text>

            {message.recommendations?.length ? (
              <View style={{ marginTop: spacing.md }}>
                {message.recommendations.map((recommendation, position) => (
                  <View key={recommendation.product._id}>
                    {position > 0 ? <Divider style={{ marginVertical: spacing.sm }} /> : null}
                    <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
                      <Pressable onPress={() => navigation.navigate("Product", { slug: recommendation.product.slug })} style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: spacing.md, minWidth: 0 }}>
                        <ProductImage
                          uri={recommendation.product.imageUrl}
                          emoji={recommendation.product.emoji}
                          height={52}
                          glyphSize={24}
                          style={{ width: 52 }}
                        />
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Text numberOfLines={1} style={type.label}>
                            {recommendation.product.name} × {recommendation.qty}
                          </Text>
                          <Text numberOfLines={2} style={[type.caption, { marginTop: 2 }]}>
                            {recommendation.reason}
                          </Text>
                        </View>
                      </Pressable>
                      <Text style={type.label}>
                        {money(recommendation.product.price * recommendation.qty)}
                      </Text>
                      <Pressable onPress={() => functions.addRecommendation(recommendation)} style={addButton}>
                        <Text style={addButtonText}>Add</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.lg }}>
                  <Badge label="Basket ready" tone="sage" />
                  <Text style={[type.subtitle, { fontSize: 16 }]}>{money(message.total || 0)}</Text>
                </View>
                <Pressable onPress={() => functions.addBasket(message.recommendations || [])} style={basketButton}>
                  <Text style={basketButtonText}>Add basket to cart</Text>
                </Pressable>
              </View>
            ) : null}
          </Card>
        ),
      )}

      {values.isLoading ? <Loading label="Thinking through your basket…" /> : null}

      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.lg }}>
        <Input
          value={values.input}
          onChangeText={functions.setInput}
          placeholder="Ask for a healthy week under $60…"
          containerStyle={{ flex: 1, marginTop: 0 }}
          editable={!values.isLoading}
          onSubmitEditing={() => void functions.send()}
        />
        <Pressable
          onPress={() => void functions.send()}
          disabled={values.isLoading}
          style={({ pressed }) => [sendButton, pressed && { opacity: 0.85 }]}
        >
          <Send size={18} color={colors.onPrimary} />
        </Pressable>
      </View>
    </PrimaryLayout>
  );
}

const bubbleUser = {
  alignSelf: "flex-end" as const,
  maxWidth: "88%" as const,
  marginTop: spacing.md,
  paddingHorizontal: spacing.lg,
  paddingVertical: spacing.md,
  borderRadius: radius.lg,
  backgroundColor: colors.primary,
};

const sendButton = {
  width: 54,
  height: 54,
  borderRadius: radius.pill,
  backgroundColor: colors.primary,
  alignItems: "center" as const,
  justifyContent: "center" as const,
};

const addButton = { paddingHorizontal: 11, paddingVertical: 7, borderRadius: radius.pill, backgroundColor: colors.primary };
const addButtonText = { color: colors.onPrimary, fontSize: 12, fontWeight: "700" as const };
const basketButton = { marginTop: spacing.md, alignItems: "center" as const, paddingVertical: 11, borderRadius: radius.md, backgroundColor: colors.primary };
const basketButtonText = { color: colors.onPrimary, fontSize: 13, fontWeight: "700" as const };
