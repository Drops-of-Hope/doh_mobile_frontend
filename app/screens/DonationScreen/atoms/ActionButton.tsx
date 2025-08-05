import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ActionButtonProps {
  title: string;
  icon: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export default function ActionButton({
  title,
  icon,
  onPress,
  variant = "primary",
  disabled = false,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === "secondary" && styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons
        name={icon as any}
        size={20}
        color={variant === "primary" ? "#FFFFFF" : "#DC2626"}
      />
      <Text
        style={[
          styles.buttonText,
          variant === "secondary" && styles.secondaryButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
    marginVertical: 8,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    borderColor: "#9CA3AF",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#DC2626",
  },
});
