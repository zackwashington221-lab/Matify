import React, { useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, type } from "../theme";

export default function LoginScreen({ navigation }: any) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("Password123!");
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      if (mode === "signin") await signIn(email.trim(), password);
      else await signUp(name.trim(), email.trim(), password);
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Authentication failed", e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, padding: spacing.xl, justifyContent: "center", gap: spacing.md }}>
        <Text style={type.display}>{mode === "signin" ? "Welcome back" : "Create account"}</Text>
        <Text style={[type.caption, { marginBottom: spacing.md }]}>
          Fresh groceries, planned by AI and delivered in under 30 minutes.
        </Text>

        {mode === "signup" && <Input value={name} onChangeText={setName} placeholder="Full name" />}
        <Input value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" keyboardType="email-address" />
        <Input value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

        <Button label={mode === "signin" ? "Sign in" : "Sign up"} loading={busy} onPress={submit} />
        <Button
          variant="ghost"
          label={mode === "signin" ? "New here? Create an account" : "I already have an account"}
          onPress={() => setMode(mode === "signin" ? "signup" : "signin")}
        />
      </View>
    </SafeAreaView>
  );
}

function Input(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      {...props}
      placeholderTextColor={colors.muted}
      style={{
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        color: colors.text,
      }}
    />
  );
}
