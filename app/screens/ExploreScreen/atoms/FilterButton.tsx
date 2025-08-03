import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FilterButtonProps {
  onPress: () => void;
  hasActiveFilters?: boolean;
}

export default function FilterButton({
  onPress,
  hasActiveFilters = false,
}: FilterButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.filterButton,
        hasActiveFilters && styles.filterButtonActive,
      ]}
      onPress={onPress}
    >
      <Ionicons
        name="filter"
        size={20}
        color={hasActiveFilters ? "white" : "#6B7280"}
      />
      <Text
        style={[styles.filterText, hasActiveFilters && styles.filterTextActive]}
      >
        Filter
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonActive: {
    backgroundColor: "#3B82F6",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 8,
  },
  filterTextActive: {
    color: "white",
  },
});
