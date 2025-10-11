import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabButtonProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function TabButton({
  title,
  icon,
  isActive,
  onPress,
  style,
}: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { backgroundColor: isActive ? "#dc2626" : "white" },
        style,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.tabText, { color: isActive ? "white" : "#dc2626" }]}>
        <Ionicons
          name={icon}
          size={18}
          color={isActive ? "white" : "#dc2626"}
        />{" "}
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  tabText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
