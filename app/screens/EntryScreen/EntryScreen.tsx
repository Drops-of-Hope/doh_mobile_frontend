// app/screens/EntryScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, Alert } from "react-native";
import Button from "../../../components/atoms/Button";
import TitlePage from "../../../components/molecules/TitlePage";
import { useAuth } from "../../context/AuthContext";
import { authenticate } from "../../services/auth";

export default function EntryScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshAuthState, isAuthenticated } = useAuth();

  // Check if we can silently authenticate when component mounts
  useEffect(() => {
    const checkSilentAuth = async () => {
      if (!isAuthenticated) {
        console.log("Checking for existing valid authentication...");
        // This will automatically handle token refresh if possible
        await refreshAuthState();
      }
    };

    checkSilentAuth();
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Starting authentication...");

      const authResult = await authenticate(false);
      if (authResult) {
        console.log("Authentication successful, refreshing state...");
        await refreshAuthState();
        console.log("Auth state refreshed successfully");
      }
    } catch (error) {
      console.error("Authentication failed:", error);

      // More user-friendly error handling
      let errorMessage =
        "Unable to connect to our authentication service. Please try again.";
      let showRetry = true;

      if (error instanceof Error) {
        if (error.message.includes("cancelled")) {
          errorMessage = "Sign-in was cancelled. Please try again when ready.";
          showRetry = false; // Don't auto-retry for cancellation
        } else if (error.message.includes("network")) {
          errorMessage =
            "Network connection issue. Please check your internet and try again.";
        } else if (error.message.includes("PKCE")) {
          errorMessage =
            "Technical issue with authentication setup. This usually resolves itself - please try again.";
        } else if (
          error.message.includes("expired") ||
          error.message.includes("invalid")
        ) {
          errorMessage = "Your session has expired. Please sign in again.";
        } else {
          errorMessage = "Sign-in failed. Please try again.";
        }
      }

      const alertActions = showRetry
        ? [
            {
              text: "Try Again",
              onPress: () => handleLogin(),
              style: "default" as const,
            },
            {
              text: "Cancel",
              style: "cancel" as const,
            },
          ]
        : [
            {
              text: "OK",
              style: "default" as const,
            },
          ];

      Alert.alert("Sign In Required", errorMessage, alertActions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Main content */}
      <View className="flex-1 px-6 relative z-10">
        {/* Top section - Logo, Title, Subtitle */}
        <View className="flex-1 justify-center items-center">
          <TitlePage showWelcomeMessage={true} />
        </View>

        {/* Bottom section - Login Button and Terms */}
        <View className="pb-12">
          {/* Login button */}
          <View className="w-full mb-8">
            <Button
              title={isLoading ? "Connecting..." : "Let's Save A Life"}
              onPress={handleLogin}
              disabled={isLoading}
            />
          </View>

          {/* Info text
          <Text className="text-sm text-gray-600 text-center px-8 leading-5 mb-4">
            New user? Don't worry! You can create an account during the login process.
          </Text> */}

          {/* Terms and Privacy */}
          <Text className="text-sm text-gray-500 text-center px-8 leading-5">
            By continuing, you agree to our{" "}
            <Text className="text-red-600">Terms of Service</Text>
            {"\n"}and <Text className="text-red-600">Privacy Policy</Text>.
          </Text>
        </View>
      </View>
    </View>
  );
}
