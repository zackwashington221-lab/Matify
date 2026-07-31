import React from "react";
import { Pressable, Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { styles } from "../../styles";
import useLoginController from "./useLoginController";
import { useNavigation } from "@react-navigation/native";
export default function Login() {
  const { values, functions } = useLoginController();
  const navigation = useNavigation<any>();
  const { formik } = values;
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.muted}>Sign in to continue shopping.</Text>
        <Input
          value={formik.values.email}
          onChangeText={formik.handleChange("email")}
          onBlur={formik.handleBlur("email")}
          placeholder="Email address"
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <Input
          value={formik.values.password}
          onChangeText={formik.handleChange("password")}
          onBlur={formik.handleBlur("password")}
          placeholder="Password"
          secureTextEntry
        />
        <Button
          label={values.isLoading ? "Signing in…" : "Sign in"}
          onPress={() => void functions.submit()}
          disabled={values.isLoading}
        />
        <Pressable onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.muted}>New to Freshly? Create account</Text>
        </Pressable>
      </View>
    </PrimaryLayout>
  );
}
