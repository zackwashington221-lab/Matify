import React from "react";
import { Text, View } from "react-native";
import PrimaryLayout from "../../../layouts/PrimaryLayout";
import Button from "../../../components/Button";
import Header from "../../../components/Header";
import Input from "../../../components/Input";
import { styles } from "../../styles";
import useSignupController from "./useSignupController";

export default function Signup() {
  const { values, functions } = useSignupController();
  const { formik } = values;
  return (
    <PrimaryLayout contentStyle={styles.page}>
      <Header title="Create account" back />
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.title}>Shop smarter.</Text>
        <Text style={styles.muted}>Create your Freshly account to save orders and preferences.</Text>
        <Input value={formik.values.name} onChangeText={formik.handleChange("name")} onBlur={formik.handleBlur("name")} placeholder="Full name" />
        <Input value={formik.values.email} onChangeText={formik.handleChange("email")} onBlur={formik.handleBlur("email")} autoCapitalize="none" keyboardType="email-address" placeholder="Email address" />
        <Input value={formik.values.password} onChangeText={formik.handleChange("password")} onBlur={formik.handleBlur("password")} secureTextEntry placeholder="Password (8+ characters)" />
        <Button label={values.isLoading ? "Creating account…" : "Create account"} onPress={() => void functions.submit()} disabled={values.isLoading} />
      </View>
    </PrimaryLayout>
  );
}
