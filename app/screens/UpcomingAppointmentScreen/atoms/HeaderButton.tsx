import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderButtonProps {
  icon: string;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
}

export default function HeaderButton({
  icon,
  color = "#6B7280",
  backgroundColor = "#FFFFFF",
  onPress,
}: HeaderButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={24} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
});
