import React, { useState } from "react";
import { View, Alert, Linking, Text } from "react-native";
import { Svg, Path } from "react-native-svg";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { initiatePasswordReset } from "../../app/services/auth";

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
const ResetIcon = () => (
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
      d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
    />
  </Svg>
);

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const resetUrl = await initiatePasswordReset(email);

      Alert.alert(
        "Password Reset",
        "You will be redirected to Asgardeo to reset your password. Continue?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 p-5">
      <View className="bg-white rounded-[20px] p-6 shadow-lg">
        {/* Header */}
        <View className="mb-8 items-center">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Reset Password
          </Text>
          <Text className="text-base text-gray-500 text-center leading-6">
            Enter your email address and we'll help you reset your password
          </Text>
        </View>

        {/* Form */}
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
        </View>

        {/* Actions */}
        <View className="gap-4">
          <Button
            title={isLoading ? "Sending Reset Link..." : "Reset Password"}
            onPress={handleForgotPassword}
            disabled={!email.trim() || isLoading}
            size="lg"
            leftIcon={<ResetIcon />}
          />

          <View className="items-center py-3 px-4 bg-gray-50 rounded-xl">
            <Text className="text-xs text-gray-500 text-center">
              Password reset is handled securely by Asgardeo
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
