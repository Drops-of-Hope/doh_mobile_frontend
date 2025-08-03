import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DetailRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  isStatus?: boolean;
}

export default function DetailRow({
  icon,
  iconColor,
  label,
  value,
  isStatus = false,
}: DetailRowProps) {
  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={20} color={iconColor} />
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={[styles.detailValue, isStatus && styles.statusText]}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  detailText: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "500",
  },
  statusText: {
    textTransform: "uppercase",
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
  },
});
