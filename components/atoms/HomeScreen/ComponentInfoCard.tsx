import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ComponentInfoCardProps {
  title: string;
  subtitle: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
}

export default function ComponentInfoCard({
  title,
  subtitle,
  value,
  icon,
  iconColor = "#FF4757",
}: ComponentInfoCardProps) {
  return (
    <View style={styles.componentCard}>
      <View style={[styles.componentIcon, { backgroundColor: iconColor }]}>
        <Ionicons name={icon} size={18} color="white" />
      </View>
      <View style={styles.componentContent}>
        <Text style={styles.componentTitle}>{title}</Text>
        <Text style={styles.componentSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.componentValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  componentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  componentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  componentContent: {
    flex: 1,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  componentSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  componentValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
  },
});
