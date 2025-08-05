import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  style?: any;
}

export default function ActionButton({
  title,
  onPress,
  variant = "primary",
  style,
}: ActionButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.actionButton,
        variant === "primary" ? styles.primaryButton : styles.secondaryButton,
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          variant === "primary" ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: "#374151",
  },
});
