import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface TimeSlotProps {
  time: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function TimeSlot({ time, isSelected, onPress }: TimeSlotProps) {
  return (
    <TouchableOpacity
      style={[styles.timeSlot, isSelected && styles.timeSlotSelected]}
      onPress={onPress}
    >
      <Text
        style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}
      >
        {time}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "white",
    minWidth: 80,
    alignItems: "center",
  },
  timeSlotSelected: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  timeSlotTextSelected: {
    color: "white",
  },
});
