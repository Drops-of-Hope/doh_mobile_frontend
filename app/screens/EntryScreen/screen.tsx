// app/screens/EntryScreen.tsx
import React, { useState } from "react";
import { View, Alert, Image, StyleSheet } from "react-native";
import { Screen, Text, Button, useTheme } from "../../design";
import { DropMark } from "../../design/icons/brand";
import { useAuth } from "../../context/AuthContext";
import { authenticate } from "../../services/auth";
import DOHLogo from "../../../assets/logo.png";

import { logger } from "../../utils/logger";

export default function EntryScreen() {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  // AuthProvider already performs a silent-auth check (with token refresh) once
  // on app mount, so this screen doesn't need its own copy of that check.
  const { refreshAuthState } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authResult = await authenticate(false);
      if (authResult) {
        await refreshAuthState();
      }
    } catch (error) {
      logger.error("Authentication failed:", error);

      let errorMessage = "Unable to connect to our authentication service. Please try again.";
      let showRetry = true;

      if (error instanceof Error) {
        if (error.message.includes("cancelled")) {
          errorMessage = "Sign-in was cancelled. Please try again when ready.";
          showRetry = false;
        } else if (error.message.includes("network")) {
          errorMessage = "Network connection issue. Please check your internet and try again.";
        } else if (error.message.includes("PKCE")) {
          errorMessage =
            "Technical issue with authentication setup. This usually resolves itself - please try again.";
        } else if (error.message.includes("expired") || error.message.includes("invalid")) {
          errorMessage = "Your session has expired. Please sign in again.";
        } else {
          errorMessage = "Sign-in failed. Please try again.";
        }
      }

      const alertActions = showRetry
        ? [
            { text: "Try Again", onPress: () => handleLogin(), style: "default" as const },
            { text: "Cancel", style: "cancel" as const },
          ]
        : [{ text: "OK", style: "default" as const }];

      Alert.alert("Sign In Required", errorMessage, alertActions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.body}>
        <View style={styles.hero}>
          {DOHLogo ? (
            <Image source={DOHLogo} style={styles.logo} resizeMode="contain" />
          ) : (
            <DropMark size={56} color={theme.color.crimson} filled />
          )}
          <Text variant="h1" align="center" style={styles.title}>
            Drops of Hope
          </Text>
          <Text variant="body" tone="inkMuted" align="center" style={styles.subtitle}>
            Connecting lifelines, one drop at a time
          </Text>
          <Text variant="body" tone="inkMuted" align="center">
            Your contribution makes a difference.
          </Text>
        </View>

        <View style={styles.footer}>
          <Button
            title={isLoading ? "Connecting..." : "Let's Save A Life"}
            onPress={handleLogin}
            disabled={isLoading}
            loading={isLoading}
          />
          <Text variant="caption" tone="inkFaint" align="center" style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text variant="caption" tone="crimson">
              Terms of Service
            </Text>
            {"\n"}and{" "}
            <Text variant="caption" tone="crimson">
              Privacy Policy
            </Text>
            .
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  hero: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: { width: 100, height: 100, marginBottom: 16 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 16 },
  footer: { paddingBottom: 32 },
  terms: { marginTop: 16, lineHeight: 18 },
});
