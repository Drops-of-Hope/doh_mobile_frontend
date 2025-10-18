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
  hasActiveFilters: boolean;
  campaignStatus: "live" | "upcoming";
  onCampaignStatusChange: (status: "live" | "upcoming") => void;
}

export default function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onSearchPress,
  onFilterPress,
  hasActiveFilters,
  campaignStatus,
  onCampaignStatusChange,
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
      
      {/* Status Toggle Row */}
      <View style={styles.statusToggleRow}>
        <TouchableOpacity 
          style={[
            styles.statusButton, 
            campaignStatus === "live" && styles.statusButtonActive
          ]} 
          onPress={() => onCampaignStatusChange("live")}
        >
          <Ionicons 
            name="radio-button-on" 
            size={18} 
            color={campaignStatus === "live" ? COLORS.BACKGROUND : COLORS.TEXT_SECONDARY} 
          />
          <Text style={[
            styles.statusButtonText,
            campaignStatus === "live" && styles.statusButtonTextActive
          ]}>
            Live
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.statusButton, 
            campaignStatus === "upcoming" && styles.statusButtonActive
          ]} 
          onPress={() => onCampaignStatusChange("upcoming")}
        >
          <Ionicons 
            name="time-outline" 
            size={18} 
            color={campaignStatus === "upcoming" ? COLORS.BACKGROUND : COLORS.TEXT_SECONDARY} 
          />
          <Text style={[
            styles.statusButtonText,
            campaignStatus === "upcoming" && styles.statusButtonTextActive
          ]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
    marginTop: SPACING.MD,
    paddingHorizontal: SPACING.MD,
  },
  searchAndFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  searchContainer: {
    flex: 1,
  },
  filterContainer: {
    // The filter button will have its own styles
  },
  statusToggleRow: {
    flexDirection: "row",
    marginTop: SPACING.MD,
    gap: SPACING.SM,
  },
  statusButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    paddingVertical: SPACING.SM + 2,
    gap: SPACING.XS + 2,
  },
  statusButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
  },
  statusButtonTextActive: {
    color: COLORS.BACKGROUND,
  },
});
