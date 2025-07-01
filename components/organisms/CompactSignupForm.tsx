import { View, Text, Alert, Pressable } from "react-native";
import { useState } from "react";
import { Svg, Path } from "react-native-svg";
import Input from "../atoms/Input";
import Button from "../atoms/Button";
import { signup } from "../../app/services/auth";

// SVG Icon Placeholders
const UserIcon = () => (
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
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </Svg>
);
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

interface CompactSignupFormProps {
  isCompact?: boolean;
}

export default function CompactSignupForm({
  isCompact = true,
}: CompactSignupFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    setIsLoading(true);
    try {
      await signup();
      console.log("Signup initiated - redirecting to Asgardeo...");
    } catch (error) {
      console.error("Signup failed:", error);
      Alert.alert(
        "Signup Failed",
        "Please try again or check your information."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isCompact) {
    // Return the original full SignupForm
    return (
      <View className="flex-1 p-5">
        <View className="bg-white rounded-[20px] p-6 shadow-lg">
          <View className="mb-8 items-center">
            <Text className="text-3xl font-bold text-gray-800 mb-2">
              Join Our Mission
            </Text>
            <Text className="text-base text-gray-500 text-center leading-6">
              Create an account to start saving lives
            </Text>
          </View>

          <View className="mb-8">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              leftIcon={<UserIcon />}
            />

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
              placeholder="Create a strong password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon={<LockIcon />}
            />
          </View>

          <View className="gap-4">
            <Button
              title={
                isLoading ? "Creating Account..." : "Sign Up with Asgardeo"
              }
              onPress={handleSignup}
              disabled={isLoading}
              size="lg"
              leftIcon={<AsgardeoIcon />}
            />

            <View className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200">
              <Text className="text-base font-semibold text-red-600 text-center mb-3">
                Why Join Drops of Hope?
              </Text>
              <View className="gap-2">
                <Text className="text-sm text-red-800 leading-5">
                  • Connect with donation centers
                </Text>
                <Text className="text-sm text-red-800 leading-5">
                  • Track donation history
                </Text>
                <Text className="text-sm text-red-800 leading-5">
                  • Earn recognition
                </Text>
                <Text className="text-sm text-red-800 leading-5">
                  • Help save lives
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Compact version for tabs
  return (
    <View className="flex-1 ">
      <View className="gap-3">
        <Input
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          leftIcon={<UserIcon />}
        />

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

        <Button
          title={isLoading ? "Creating Account..." : "Create Account"}
          onPress={handleSignup}
          disabled={isLoading}
          size="md"
          leftIcon={<AsgardeoIcon />}
        />

        <View className="bg-red-50 rounded-lg p-3 mt-2 border border-red-200">
          <Text className="text-sm font-semibold text-red-600 text-center mb-1">
            Join the lifesaving community
          </Text>
          <Text className="text-xs text-red-800 text-center leading-4">
            Track donations • Earn rewards • Save lives
          </Text>
        </View>

        <View className="items-center py-2 px-3 bg-gray-50 rounded-lg mt-2">
          <Text className="text-xs text-gray-500 text-center">
            Secure registration powered by Asgardeo
          </Text>
        </View>
      </View>
    </View>
  );
}
