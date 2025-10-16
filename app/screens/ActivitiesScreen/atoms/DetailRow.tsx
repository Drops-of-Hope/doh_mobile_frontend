import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  iconColor?: string;
}

export default function DetailRow({
  icon,
  text,
  iconColor = "#6B7280",
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={16} color={iconColor} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#1F2937",
    marginLeft: 8,
    fontWeight: "600",
  },
});
