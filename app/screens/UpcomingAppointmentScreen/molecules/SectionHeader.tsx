import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SectionHeaderProps } from "../types";

export default function SectionHeader({
  icon,
  iconColor,
  title,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionTitleRow}>
      <Ionicons name={icon as any} size={20} color={iconColor} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },
});
