import React, { useState, useRef } from "react";
import { View, Text, Pressable, Animated, Dimensions } from "react-native";
import CompactLoginForm from "./CompactLoginForm";
import CompactSignupForm from "./CompactSignupForm";

interface AuthTabsProps {
  onAuthSuccess?: () => void;
}

export default function AuthTabs({ onAuthSuccess }: AuthTabsProps) {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [slideAnim] = useState(new Animated.Value(0));
  const [tabContainerWidth, setTabContainerWidth] = useState(0);

  const switchTab = (tab: "login" | "signup") => {
    if (tab === activeTab) return;

    setActiveTab(tab);

    // Animate the tab switch
    Animated.timing(slideAnim, {
      toValue: tab === "login" ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="flex-1">
      {/* Tab Headers */}
      <View className="mb-6">
        <View 
          className="flex-row bg-gray-100 rounded-2xl p-1 mx-1"
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setTabContainerWidth(width);
          }}
        >
          <Pressable
            className={`flex-1 py-3 px-5 rounded-xl items-center justify-center ${
              activeTab === "login" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => switchTab("login")}
          >
            <Text
              className={`text-base font-semibold ${
                activeTab === "login" ? "text-red-600" : "text-gray-500"
              }`}
            >
              Sign In
            </Text>
          </Pressable>

          <Pressable
            className={`flex-1 py-3 px-5 rounded-xl items-center justify-center ${
              activeTab === "signup" ? "bg-white shadow-sm" : ""
            }`}
            onPress={() => switchTab("signup")}
          >
            <Text
              className={`text-base font-semibold ${
                activeTab === "signup" ? "text-red-600" : "text-gray-500"
              }`}
            >
              Create Account
            </Text>
          </Pressable>
        </View>

        {/* Animated Indicator */}
        {tabContainerWidth > 0 && (
          <Animated.View
            className="absolute bottom-0 left-1 h-1 bg-red-600 rounded-sm"
            style={{
              width: (tabContainerWidth - 8) / 2, // Account for padding and split by 2
              transform: [
                {
                  translateX: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [4, (tabContainerWidth / 2) + 4], // Start at 4px offset, move to halfway point + 4px
                  }),
                },
              ],
            }}
          />
        )}
      </View>

      {/* Form Content with Animation */}
      <Animated.View
        className="flex-1"
        style={{
          opacity: slideAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.3, 1],
          }),
        }}
      >
        {activeTab === "login" ? (
          <CompactLoginForm isCompact={true} />
        ) : (
          <CompactSignupForm isCompact={true} />
        )}
      </Animated.View>
    </View>
  );
}
