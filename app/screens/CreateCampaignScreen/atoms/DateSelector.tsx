import React from "react";
import { View, Text, StyleSheet } from "react-native";
import DropdownField from "./DropdownField";
import { DateSelectorProps } from "../types";

export default function DateSelector({
  day,
  month,
  year,
  onDayChange,
  onMonthChange,
  onYearChange,
  error,
}: DateSelectorProps) {
  // Generate future dates (at least 4 weeks ahead)
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + 28); // 4 weeks ahead

  // Generate years (current year + next 2 years)
  const currentYear = today.getFullYear();
  const years = [
    { label: currentYear.toString(), value: currentYear.toString() },
    { label: (currentYear + 1).toString(), value: (currentYear + 1).toString() },
    { label: (currentYear + 2).toString(), value: (currentYear + 2).toString() },
  ];

  // Generate months
  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  // Generate days based on selected month and year
  const getDaysInMonth = (monthValue: string, yearValue: string) => {
    if (!monthValue || !yearValue) return 31;
    return new Date(parseInt(yearValue), parseInt(monthValue), 0).getDate();
  };

  const generateDays = () => {
    const daysInMonth = getDaysInMonth(month, year);
    const days = [];
    
    for (let i = 1; i <= daysInMonth; i++) {
      const dayStr = i.toString().padStart(2, '0');
      
      // Check if this date is at least 4 weeks in the future
      if (year && month) {
        const checkDate = new Date(parseInt(year), parseInt(month) - 1, i);
        if (checkDate >= minDate) {
          days.push({ label: dayStr, value: dayStr });
        }
      } else {
        // If year or month not selected, show all possible days but they will be validated later
        days.push({ label: dayStr, value: dayStr });
      }
    }
    
    return days;
  };

  // If day is selected but becomes invalid after month/year change, clear it
  React.useEffect(() => {
    if (day && month && year) {
      const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const daysInSelectedMonth = getDaysInMonth(month, year);
      
      // Clear day if it's invalid for the selected month or if date is too early
      if (parseInt(day) > daysInSelectedMonth || selectedDate < minDate) {
        onDayChange('');
      }
    }
  }, [month, year, day, onDayChange, minDate]);

  const days = generateDays();

  // Filter months based on selected year
  const getAvailableMonths = () => {
    if (!year) return months;
    
    const selectedYear = parseInt(year);
    if (selectedYear === currentYear) {
      // For current year, only show months where the minimum date can be achieved
      return months.filter(monthOption => {
        const monthIndex = parseInt(monthOption.value) - 1;
        const lastDayOfMonth = new Date(selectedYear, monthIndex + 1, 0);
        return lastDayOfMonth >= minDate;
      });
    }
    
    return months;
  };

  const availableMonths = getAvailableMonths();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        Campaign Date <Text style={styles.required}>*</Text>
      </Text>
      <Text style={styles.note}>
        Select a date at least 4 weeks from today
      </Text>
      
      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <DropdownField
            label=""
            value={year}
            onValueChange={onYearChange}
            options={years}
            placeholder="Year"
            required
          />
        </View>
        
        <View style={styles.dateField}>
          <DropdownField
            label=""
            value={month}
            onValueChange={onMonthChange}
            options={availableMonths}
            placeholder="Month"
            required
          />
        </View>
        
        <View style={styles.dateField}>
          <DropdownField
            label=""
            value={day}
            onValueChange={onDayChange}
            options={days}
            placeholder="Day"
            required
          />
        </View>
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  required: {
    color: "#DC2626",
  },
  note: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: "row",
    gap: 8,
  },
  dateField: {
    flex: 1,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginTop: 4,
  },
});