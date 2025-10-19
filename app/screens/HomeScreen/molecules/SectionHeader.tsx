import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface SectionHeaderProps {
  title: string;
  showViewAll?: boolean;
  onViewAll?: () => void;
}

export default function SectionHeader({
  title,
  showViewAll = true,
  onViewAll,
}: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {showViewAll && (
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllButton}>View All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626", // Red accent
    paddingLeft: 12,
  },
  viewAllButton: {
    color: "#5F27CD",
    fontWeight: "700",
    fontSize: 14,
  },
});
