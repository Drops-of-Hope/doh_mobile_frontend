import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CalendarHeaderProps {
  monthName: string;
  year: number;
  canNavigatePrevious: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export default function CalendarHeader({
  monthName,
  year,
  canNavigatePrevious,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  return (
    <View style={styles.calendarHeader}>
      <TouchableOpacity
        style={[
          styles.calendarNavButton,
          !canNavigatePrevious && styles.calendarNavButtonDisabled,
        ]}
        onPress={onPreviousMonth}
        disabled={!canNavigatePrevious}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={canNavigatePrevious ? "#374151" : "#D1D5DB"}
        />
      </TouchableOpacity>

      <Text style={styles.calendarMonthYear}>
        {monthName} {year}
      </Text>

      <TouchableOpacity style={styles.calendarNavButton} onPress={onNextMonth}>
        <Ionicons name="chevron-forward" size={20} color="#374151" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  calendarNavButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  calendarNavButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
  calendarMonthYear: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
});
