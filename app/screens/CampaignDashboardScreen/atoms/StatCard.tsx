import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatCardProps } from "../types";

export default function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardHeader}>
          <Ionicons name={icon as any} size={24} color={color} />
          <Text style={styles.statCardTitle}>{title}</Text>
        </View>
        <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statCardTitle: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "700",
  },
});
