import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateCardProps {
  title?: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

export default function EmptyStateCard({
  title = "No donation activities yet",
  subtitle = "Your donation history will appear here",
  icon = "heart-outline",
}: EmptyStateCardProps) {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCard}>
        <Ionicons name={icon} size={64} color="#D1D5DB" />
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptySubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
  },
});
