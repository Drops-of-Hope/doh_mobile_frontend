import {
  View,
  TouchableOpacity,
  Alert,
  Linking,
  Text,
  Pressable,
} from "react-native";
import { useState } from "react";
import { Svg, Path } from "react-native-svg";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import * as SecureStore from "expo-secure-store";

import { authorize, refresh } from "react-native-app-auth";
import { authConfig, initiatePasswordReset } from "../../app/services/auth";

// SVG Icon Placeholders
const EmailIcon = () => (
  <Svg
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25"
    />
  </Svg>
);
const LockIcon = () => (
  <Svg
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </Svg>
);
const AsgardeoIcon = () => (
  <Svg
    width={18}
    height={18}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <Path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z"
    />
  </Svg>
);

export async function login() {
  try {
    const authState = await authorize(authConfig);
    console.log("Access Token:", authState.accessToken);
    console.log("ID Token:", authState.idToken);
    await SecureStore.setItemAsync("authState", JSON.stringify(authState));
    return authState;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
}

export async function refreshToken(refreshToken: string) {
  try {
    const newAuthState = await refresh(authConfig, { refreshToken });
    await SecureStore.setItemAsync("authState", JSON.stringify(newAuthState));
    return newAuthState;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
}

interface CompactLoginFormProps {
  isCompact?: boolean;
}

export default function CompactLoginForm({
  isCompact = true,
}: CompactLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authState = await login();
      console.log("Login successful:", authState);
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert(
        "Login Failed",
        "Please try again or check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const resetUrl = await initiatePasswordReset();

      Alert.alert(
        "Reset Password",
        "You will be redirected to Asgardeo to reset your password. Continue?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Continue",
            onPress: () => {
              Linking.openURL(resetUrl).catch((err) => {
                console.error("Failed to open password reset URL:", err);
                Alert.alert("Error", "Could not open password reset page");
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error("Password reset failed:", error);
      Alert.alert("Error", "Failed to initiate password reset");
    }
  };

  if (!isCompact) {
    // Return the original full LoginForm
    return (
      <View className="flex-1 p-5">
        <View className="bg-white rounded-[20px] p-6 shadow-lg">
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6">
              Sign in to continue saving lives
            </Text>
          </View>

          <View className="mb-8">
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<EmailIcon />}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<LockIcon />}
            />

            <Pressable
              onPress={handleForgotPassword}
              className="items-end mt-2"
            >
              <Text className="text-red-600 text-sm font-semibold">
                Forgot Password?
              </Text>
            </Pressable>
          </View>

          <View className="gap-4">
            <Button
              title={isLoading ? "Signing In..." : "Continue with Asgardeo"}
              onPress={handleLogin}
              disabled={isLoading}
              size="lg"
              leftIcon={<AsgardeoIcon />}
            />

            <View className="items-center py-3 px-4 bg-gray-50 rounded-xl">
              <Text className="text-xs text-gray-500 text-center">
                Powered by Asgardeo for maximum security
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Compact version for tabs
  return (
    <View className="flex-1">
      <View className="gap-3">
        <Input
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<EmailIcon />}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          leftIcon={<LockIcon />}
        />

        <Pressable onPress={handleForgotPassword} className="items-end mb-2">
          <Text className="text-red-600 text-sm font-semibold">
            Forgot Password?
          </Text>
        </Pressable>

        <Button
          title={isLoading ? "Signing In..." : "Sign In with Asgardeo"}
          onPress={handleLogin}
          disabled={isLoading}
          size="md"
          leftIcon={<AsgardeoIcon />}
        />

        <View className="items-center py-2 px-3 bg-gray-50 rounded-lg mt-2">
          <Text className="text-xs text-gray-500 text-center">
            Secure authentication powered by Asgardeo
          </Text>
        </View>
      </View>
    </View>
  );
}
