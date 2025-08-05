import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
}

export default function StatCard({
  label,
  value,
  color = "#1F2937",
}: StatCardProps) {
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
