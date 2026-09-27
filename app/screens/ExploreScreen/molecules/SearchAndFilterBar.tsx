import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Search, SlidersHorizontal, Radio, Clock } from "lucide-react-native";
import { Field, Chip, Icon, useTheme } from "../../../design";

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
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <Field
            value={searchText}
            onChangeText={onSearchTextChange}
            onSubmitEditing={onSearchPress}
            placeholder="Search campaigns..."
            leftIcon={<Icon icon={Search} size={18} color={theme.color.inkFaint} />}
            returnKeyType="search"
          />
        </View>
        <Pressable
          onPress={onFilterPress}
          style={[
            styles.filterButton,
            {
              backgroundColor: hasActiveFilters ? theme.color.crimson : theme.color.surface,
              borderColor: hasActiveFilters ? theme.color.crimson : theme.color.hairline,
              borderRadius: theme.radius.md,
            },
          ]}
        >
          <Icon icon={SlidersHorizontal} size={18} color={hasActiveFilters ? theme.color.inverse : theme.color.ink} />
        </Pressable>
      </View>

      <View style={styles.chipRow}>
        <Chip
          label="Live"
          selected={campaignStatus === "live"}
          onPress={() => onCampaignStatusChange("live")}
          icon={<Icon icon={Radio} size={14} color={campaignStatus === "live" ? theme.color.crimson : theme.color.inkMuted} />}
        />
        <Chip
          label="Upcoming"
          selected={campaignStatus === "upcoming"}
          onPress={() => onCampaignStatusChange("upcoming")}
          icon={<Icon icon={Clock} size={14} color={campaignStatus === "upcoming" ? theme.color.crimson : theme.color.inkMuted} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  searchField: {
    flex: 1,
  },
  filterButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
});
