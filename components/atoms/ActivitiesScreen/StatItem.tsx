import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatItemProps {
  number: number;
  label: string;
}

export default function StatItem({ number, label }: StatItemProps) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 4,
  },
});
