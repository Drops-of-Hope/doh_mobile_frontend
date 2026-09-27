import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "../../../design";

export interface FilterOption {
  label: string;
  value: string;
}

interface ActivityFilterBarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  filters: FilterOption[];
}

export default function ActivityFilterBar({
  selectedFilter,
  onFilterChange,
  filters,
}: ActivityFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {filters.map((filter) => (
        <Chip
          key={filter.value}
          label={filter.label}
          selected={selectedFilter === filter.value}
          onPress={() => onFilterChange(filter.value)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingBottom: 12 },
});
