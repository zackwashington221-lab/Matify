import React from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Card } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, type } from "../theme";

export default function ProfileScreen({ navigation }: any) {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <Text style={type.display}>Profile</Text>

        <Card>
          {user ? (
            <>
              <Text style={type.title}>{user.name}</Text>
              <Text style={type.caption}>{user.email}</Text>
              <Text style={[type.caption, { marginTop: 4 }]}>Role: {user.role}</Text>
            </>
          ) : (
            <>
              <Text style={type.title}>You're browsing as a guest</Text>
              <Text style={[type.caption, { marginTop: 4 }]}>Sign in to place orders and track deliveries.</Text>
            </>
          )}
        </Card>

        {["Addresses", "Payment methods", "Dietary preferences", "Notifications", "Help centre"].map((row) => (
          <Card key={row}>
            <Text style={type.label}>{row}</Text>
          </Card>
        ))}

        <View style={{ height: spacing.sm }} />
        {user ? (
          <Button label="Sign out" variant="secondary" onPress={signOut} />
        ) : (
          <Button label="Sign in" onPress={() => navigation.navigate("Login")} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
