import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../../constants/theme';

export interface FilterOption {
  label: string;
  value: string;
  icon?: string;
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
    <View style={styles.container}>
      <Text style={styles.title}>Filter Activities</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.value}
            style={[
              styles.filterButton,
              selectedFilter === filter.value && styles.activeFilterButton,
            ]}
            onPress={() => onFilterChange(filter.value)}
          >
            {filter.icon && (
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={
                  selectedFilter === filter.value
                    ? COLORS.BACKGROUND
                    : COLORS.TEXT_SECONDARY
                }
                style={styles.filterIcon}
              />
            )}
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.value && styles.activeFilterText,
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.SM,
    paddingHorizontal: SPACING.XS,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.XS,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.MD,
    paddingVertical: SPACING.SM,
    borderRadius: BORDER_RADIUS.LG,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    marginRight: SPACING.SM,
  },
  activeFilterButton: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterIcon: {
    marginRight: SPACING.XS,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.TEXT_SECONDARY,
  },
  activeFilterText: {
    color: COLORS.BACKGROUND,
  },
});