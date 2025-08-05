import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TabButtonProps {
  title: string;
  icon: string;
  isActive: boolean;
  onPress: () => void;
}

export default function TabButton({
  title,
  icon,
  isActive,
  onPress,
}: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={24}
        color={isActive ? "#DC2626" : "#6B7280"}
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#FEE2E2",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#DC2626",
    fontWeight: "600",
  },
});
