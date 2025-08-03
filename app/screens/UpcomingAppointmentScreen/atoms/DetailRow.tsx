import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DetailRowProps } from "../types";

export default function DetailRow({
  icon,
  text,
  color = "#4B5563",
  isPast = false,
}: DetailRowProps) {
  const textColor = isPast ? "#6B7280" : color;

  return (
    <View style={styles.detailRow}>
      <Ionicons
        name={icon as any}
        size={16}
        color={isPast ? "#6B7280" : color}
      />
      <Text style={[styles.detailText, { color: textColor }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
