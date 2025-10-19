import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

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
        size={18}
        color={hasActiveFilters ? COLORS.BACKGROUND : COLORS.TEXT_SECONDARY}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.MD,
    paddingHorizontal: SPACING.SM + 4,
    paddingVertical: SPACING.SM + 4,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
});
