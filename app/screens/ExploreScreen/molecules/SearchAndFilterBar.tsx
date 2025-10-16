import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "../atoms/SearchBar";
import FilterButton from "../atoms/FilterButton";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface SearchAndFilterBarProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onSearchPress: () => void;
  onFilterPress: () => void;
  onLocationPress: () => void;
  onDateRangePress: () => void;
  hasActiveFilters: boolean;
  locationFilter?: string;
  dateRangeFilter?: string;
}

export default function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onSearchPress,
  onFilterPress,
  onLocationPress,
  onDateRangePress,
  hasActiveFilters,
  locationFilter,
  dateRangeFilter,
}: SearchAndFilterBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.searchAndFilterRow}>
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchText}
            onChangeText={onSearchTextChange}
            onSearchPress={onSearchPress}
            placeholder="Search campaigns..."
          />
        </View>
        <View style={styles.filterContainer}>
          <FilterButton
            onPress={onFilterPress}
            hasActiveFilters={hasActiveFilters}
          />
        </View>
      </View>
      
      {/* Filter Fields Row */}
      <View style={styles.filterFieldsRow}>
        <TouchableOpacity style={styles.filterField} onPress={onLocationPress}>
          <Ionicons name="location-outline" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.filterFieldText}>
            {locationFilter ? `Location: ${locationFilter}` : "Location"}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterField} onPress={onDateRangePress}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.PRIMARY} />
          <Text style={styles.filterFieldText}>
            {dateRangeFilter ? dateRangeFilter : "Date Range"}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.TEXT_SECONDARY} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    marginTop: 20, // Added top margin for spacing
    paddingHorizontal: 20, // Added horizontal padding
  },
  searchAndFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
  },
  filterContainer: {
    // The filter button will have its own styles
  },
  filterFieldsRow: {
    flexDirection: "row",
    marginTop: SPACING.SM,
    gap: SPACING.SM,
  },
  filterField: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingHorizontal: SPACING.SM,
    paddingVertical: SPACING.SM,
    gap: SPACING.XS,
  },
  filterFieldText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.TEXT_PRIMARY,
  },
});
