import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ActionButtonProps } from "../types";

export default function ActionButton({
  icon,
  text,
  color,
  backgroundColor,
  borderColor,
  onPress,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor, borderColor }]}
      onPress={onPress}
    >
      <Ionicons name={icon as any} size={16} color={color} />
      <Text style={[styles.actionText, { color }]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
