import React from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "../atoms/SearchBar";
import FilterButton from "../atoms/FilterButton";

interface SearchAndFilterBarProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onFilterPress: () => void;
  hasActiveFilters: boolean;
}

export default function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onFilterPress,
  hasActiveFilters,
}: SearchAndFilterBarProps) {
  return (
    <View style={styles.container}>
      <SearchBar
        value={searchText}
        onChangeText={onSearchTextChange}
        placeholder="Search campaigns..."
      />
      <View style={styles.filterContainer}>
        <FilterButton
          onPress={onFilterPress}
          hasActiveFilters={hasActiveFilters}
        />
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
  filterContainer: {
    alignItems: "flex-end",
    marginTop: 12,
  },
});
