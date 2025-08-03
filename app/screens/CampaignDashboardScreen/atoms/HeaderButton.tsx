import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HeaderButtonProps {
  icon: string;
  color?: string;
  onPress?: () => void;
}

export default function HeaderButton({
  icon,
  color = "#333",
  onPress,
}: HeaderButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Ionicons name={icon as any} size={24} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
});
