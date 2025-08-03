import React from "react";
import { View, StyleSheet } from "react-native";
import TimeSlot from "../atoms/TimeSlot";

interface TimeSlotGridProps {
  timeSlots: string[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export default function TimeSlotGrid({
  timeSlots,
  selectedTime,
  onTimeSelect,
}: TimeSlotGridProps) {
  return (
    <View style={styles.timeSlotContainer}>
      {timeSlots.map((time) => (
        <TimeSlot
          key={time}
          time={time}
          isSelected={selectedTime === time}
          onPress={() => onTimeSelect(time)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  timeSlotContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});
