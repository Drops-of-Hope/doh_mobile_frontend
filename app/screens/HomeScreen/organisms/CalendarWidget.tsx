import React from "react";
import { View, StyleSheet } from "react-native";
import CalendarHeader from "../molecules/CalendarHeader";
import CalendarWeekHeader from "../molecules/CalendarWeekHeader";
import CalendarDay from "../atoms/CalendarDay";

interface CalendarData {
  day: number | null;
  isAvailable?: boolean;
  isPast?: boolean;
  isWeekend?: boolean;
  isToday?: boolean;
  date?: Date;
}

interface CalendarWidgetProps {
  selectedMonth: number;
  selectedYear: number;
  selectedDate: string;
  calendarDays: CalendarData[];
  monthName: string;
  canNavigatePrevious: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
}

export default function CalendarWidget({
  selectedMonth,
  selectedYear,
  selectedDate,
  calendarDays,
  monthName,
  canNavigatePrevious,
  onPreviousMonth,
  onNextMonth,
  onDateSelect,
}: CalendarWidgetProps) {
  return (
    <View style={styles.calendarContainer}>
      <CalendarHeader
        monthName={monthName}
        year={selectedYear}
        canNavigatePrevious={canNavigatePrevious}
        onPreviousMonth={onPreviousMonth}
        onNextMonth={onNextMonth}
      />

      <CalendarWeekHeader />

      <View style={styles.calendarGrid}>
        {calendarDays.map((dayData, index) => (
          <CalendarDay
            key={index}
            day={dayData.day}
            isAvailable={dayData.isAvailable}
            isPast={dayData.isPast}
            isWeekend={dayData.isWeekend}
            isToday={dayData.isToday}
            isSelected={selectedDate === dayData.date?.toLocaleDateString()}
            onPress={() => {
              if (dayData.isAvailable && dayData.date) {
                onDateSelect(dayData.date);
              }
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
