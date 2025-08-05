import React from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ModalHeader from "../molecules/ModalHeader";
import ModalActions from "../molecules/ModalActions";
import CalendarWidget from "./CalendarWidget";
import TimeSlotGrid from "../molecules/TimeSlotGrid";
import { RescheduleFormData, CalendarData } from "../types";

interface RescheduleModalProps {
  visible: boolean;
  formData: RescheduleFormData;
  onFormChange: (data: RescheduleFormData) => void;
  showCalendar: boolean;
  onToggleCalendar: () => void;
  selectedMonth: number;
  selectedYear: number;
  calendarDays: CalendarData[];
  monthName: string;
  canNavigatePrevious: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onDateSelect: (date: Date) => void;
  availableTimeSlots: string[];
  onClose: () => void;
  onSubmit: () => void;
}

export default function RescheduleModal({
  visible,
  formData,
  onFormChange,
  showCalendar,
  onToggleCalendar,
  selectedMonth,
  selectedYear,
  calendarDays,
  monthName,
  canNavigatePrevious,
  onPreviousMonth,
  onNextMonth,
  onDateSelect,
  availableTimeSlots,
  onClose,
  onSubmit,
}: RescheduleModalProps) {
  const updateForm = (field: keyof RescheduleFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  const selectTime = (time: string) => {
    updateForm("preferredTime", time);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ModalHeader title="Reschedule Appointment" onClose={onClose} />

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Select New Date & Time</Text>

              <TouchableOpacity
                style={styles.inputContainer}
                activeOpacity={1}
                onPress={() => {
                  if (showCalendar) {
                    onToggleCalendar();
                  }
                }}
              >
                <Text style={styles.inputLabel}>Preferred Date *</Text>
                <TouchableOpacity
                  style={styles.textInput}
                  onPress={onToggleCalendar}
                >
                  <View style={styles.datePickerContainer}>
                    <Text
                      style={
                        formData.preferredDate
                          ? styles.datePickerText
                          : styles.datePickerPlaceholder
                      }
                    >
                      {formData.preferredDate || "Select a date"}
                    </Text>
                    <Ionicons name="calendar" size={20} color="#6B7280" />
                  </View>
                </TouchableOpacity>

                {showCalendar && (
                  <CalendarWidget
                    selectedMonth={selectedMonth}
                    selectedYear={selectedYear}
                    selectedDate={formData.preferredDate}
                    calendarDays={calendarDays}
                    monthName={monthName}
                    canNavigatePrevious={canNavigatePrevious}
                    onPreviousMonth={onPreviousMonth}
                    onNextMonth={onNextMonth}
                    onDateSelect={onDateSelect}
                  />
                )}
              </TouchableOpacity>

              {formData.preferredDate && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Preferred Time *</Text>
                  <TimeSlotGrid
                    timeSlots={availableTimeSlots}
                    selectedTime={formData.preferredTime}
                    onTimeSelect={selectTime}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Reason for Rescheduling</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.reason}
                  onChangeText={(text) => updateForm("reason", text)}
                  placeholder="Optional: Let us know why you need to reschedule..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.noteContainer}>
                <Ionicons name="information-circle" size={16} color="#6B7280" />
                <Text style={styles.noteText}>
                  Your new appointment will be confirmed within 24 hours. You'll
                  receive a confirmation message once approved.
                </Text>
              </View>
            </View>

            <View style={styles.modalBottomPadding} />
          </ScrollView>

          <ModalActions
            primaryTitle="Reschedule"
            secondaryTitle="Cancel"
            onPrimary={onSubmit}
            onSecondary={onClose}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    maxHeight: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxHeight: 500,
  },
  formContainer: {
    marginBottom: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  datePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  datePickerText: {
    fontSize: 16,
    color: "#1F2937",
  },
  datePickerPlaceholder: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F0F9FF",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  noteText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  modalBottomPadding: {
    height: 20,
  },
});
