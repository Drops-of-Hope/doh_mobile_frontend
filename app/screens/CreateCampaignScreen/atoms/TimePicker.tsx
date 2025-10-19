import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface TimePickerProps {
  label: string;
  value: string;
  onChange: (time: string) => void;
  error?: string;
  required?: boolean;
}

export default function TimePicker({
  label,
  value,
  onChange,
  error,
  required = false,
}: TimePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  // Generate time options with 30-minute gaps (00:00 to 23:30)
  const generateTimeOptions = (): string[] => {
    const times: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        times.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setModalVisible(false);
  };

  const formatDisplayTime = (time: string): string => {
    if (!time) return "Select time";
    
    // Convert 24-hour format to 12-hour with AM/PM
    const [hourStr, minuteStr] = time.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, "0");
    
    return `${displayHour}:${displayMinute} ${period}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.pickerButton, error && styles.pickerButtonError]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.pickerContent}>
          <Ionicons name="time-outline" size={20} color={value ? COLORS.PRIMARY : COLORS.TEXT_SECONDARY} />
          <Text style={[styles.pickerText, !value && styles.placeholderText]}>
            {value ? formatDisplayTime(value) : "Select time"}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={COLORS.TEXT_SECONDARY} />
      </TouchableOpacity>

      {value && (
        <Text style={styles.selectedValue}>
          24-hour format: {value}
        </Text>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Time Selection Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.timeList} showsVerticalScrollIndicator={false}>
              {timeOptions.map((time, index) => {
                const isSelected = time === value;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timeOption, isSelected && styles.timeOptionSelected]}
                    onPress={() => handleTimeSelect(time)}
                  >
                    <View style={styles.timeOptionContent}>
                      <Text style={[styles.timeOptionText, isSelected && styles.timeOptionTextSelected]}>
                        {formatDisplayTime(time)}
                      </Text>
                      <Text style={[styles.time24Hour, isSelected && styles.time24HourSelected]}>
                        {time}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.PRIMARY} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.XS,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  required: {
    color: COLORS.ERROR,
    fontSize: 14,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    padding: SPACING.SM + SPACING.XS,
    backgroundColor: COLORS.BACKGROUND,
  },
  pickerButtonError: {
    borderColor: COLORS.ERROR,
  },
  pickerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.SM,
  },
  pickerText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  placeholderText: {
    color: COLORS.TEXT_SECONDARY,
  },
  selectedValue: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.XS,
    marginLeft: SPACING.XS,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
    marginLeft: SPACING.XS,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: COLORS.BACKGROUND,
    borderTopLeftRadius: BORDER_RADIUS.LG,
    borderTopRightRadius: BORDER_RADIUS.LG,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  timeList: {
    padding: SPACING.SM,
  },
  timeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.XS,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
  },
  timeOptionSelected: {
    backgroundColor: `${COLORS.PRIMARY}15`,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
  },
  timeOptionContent: {
    flex: 1,
  },
  timeOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: 2,
  },
  timeOptionTextSelected: {
    color: COLORS.PRIMARY,
    fontWeight: "700",
  },
  time24Hour: {
    fontSize: 12,
    color: COLORS.TEXT_SECONDARY,
  },
  time24HourSelected: {
    color: COLORS.PRIMARY,
  },
});
