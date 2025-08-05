import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface CalendarWeekHeaderProps {}

export default function CalendarWeekHeader() {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View style={styles.calendarWeekHeader}>
      {daysOfWeek.map((day) => (
        <Text key={day} style={styles.calendarWeekDay}>
          {day}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  calendarWeekHeader: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  calendarWeekDay: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
});
