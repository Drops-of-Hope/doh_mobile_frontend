import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CalendarDayProps {
  day: number | null;
  isAvailable?: boolean;
  isPast?: boolean;
  isWeekend?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function CalendarDay({
  day,
  isAvailable = false,
  isPast = false,
  isWeekend = false,
  isToday = false,
  isSelected = false,
  onPress,
}: CalendarDayProps) {
  if (!day) {
    return <TouchableOpacity style={styles.calendarDay} disabled />;
  }

  return (
    <TouchableOpacity
      style={[
        styles.calendarDay,
        isAvailable && styles.calendarDayAvailable,
        isPast && styles.calendarDayPast,
        isWeekend && styles.calendarDayWeekend,
        isToday && styles.calendarDayToday,
        isSelected && styles.calendarDaySelected,
      ]}
      onPress={onPress}
      disabled={!isAvailable}
    >
      <Text
        style={[
          styles.calendarDayText,
          isAvailable && styles.calendarDayTextAvailable,
          isPast && styles.calendarDayTextPast,
          isWeekend && styles.calendarDayTextWeekend,
          isToday && styles.calendarDayTextToday,
          isSelected && styles.calendarDayTextSelected,
        ]}
      >
        {day}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  calendarDayAvailable: {
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    margin: 2,
  },
  calendarDayPast: {
    backgroundColor: "transparent",
  },
  calendarDayWeekend: {
    backgroundColor: "#FEF2F2",
    borderRadius: 8,
    margin: 2,
  },
  calendarDayToday: {
    backgroundColor: "#DBEAFE",
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: 8,
    margin: 2,
  },
  calendarDaySelected: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    margin: 2,
  },
  calendarDayText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  calendarDayTextAvailable: {
    color: "#1F2937",
    fontWeight: "500",
  },
  calendarDayTextPast: {
    color: "#D1D5DB",
  },
  calendarDayTextWeekend: {
    color: "#DC2626",
  },
  calendarDayTextToday: {
    color: "#3B82F6",
    fontWeight: "600",
  },
  calendarDayTextSelected: {
    color: "white",
    fontWeight: "600",
  },
});
