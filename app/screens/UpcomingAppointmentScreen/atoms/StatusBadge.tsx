import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadgeProps } from "../types";
import { getStatusColor, getStatusIcon } from "../utils";

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <View
      style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}
    >
      <Ionicons name={getStatusIcon(status) as any} size={16} color="white" />
      <Text style={styles.statusText}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
});
