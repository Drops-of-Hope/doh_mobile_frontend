import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getStatusColor } from "../utils";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const backgroundColor = getStatusColor(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor }]}>
      <Text style={styles.statusText}>{status.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
