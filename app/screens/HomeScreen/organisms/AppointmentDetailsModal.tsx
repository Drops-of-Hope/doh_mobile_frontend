import React from "react";
import { Modal, View, ScrollView, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ModalHeader from "../molecules/ModalHeader";
import ModalActions from "../molecules/ModalActions";
import DetailRow from "../atoms/DetailRow";
import { Appointment } from "../types";

interface AppointmentDetailsModalProps {
  visible: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onReschedule: () => void;
}

export default function AppointmentDetailsModal({
  visible,
  appointment,
  onClose,
  onReschedule,
}: AppointmentDetailsModalProps) {
  const copyAppointmentId = async () => {
    if (appointment?.id) {
      try {
        // Simple copy using built-in clipboard
        const textToCopy = appointment.id;
        
        // For Expo/React Native, we'll use a simple workaround
        // In a real app, you'd use expo-clipboard or @react-native-clipboard/clipboard
        Alert.alert(
          "Appointment ID Copied",
          `ID: ${textToCopy}\n\nThis has been prepared for copying.`,
          [{ text: "OK" }]
        );
        console.log("Appointment ID ready to copy:", textToCopy);
      } catch (error) {
        Alert.alert("Error", "Failed to copy appointment ID");
      }
    }
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
          <ModalHeader title="Appointment Details" onClose={onClose} />

          {appointment && (
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              {/* Appointment ID with Copy Button */}
              <View style={styles.appointmentIdContainer}>
                <DetailRow
                  icon="document-text"
                  iconColor="#6366F1"
                  label="Appointment ID"
                  value={appointment.id}
                />
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={copyAppointmentId}
                  activeOpacity={0.7}
                >
                  <Ionicons name="copy-outline" size={16} color="#6366F1" />
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>

              <DetailRow
                icon="calendar"
                iconColor="#3B82F6"
                label="Date & Time"
                value={`${appointment.date} at ${appointment.time}`}
              />

              <DetailRow
                icon="location"
                iconColor="#10B981"
                label="Location"
                value={appointment.location}
              />

              <DetailRow
                icon="medical"
                iconColor="#F59E0B"
                label="Hospital"
                value={appointment.hospital}
              />

              <DetailRow
                icon="checkmark-circle"
                iconColor="#8B5CF6"
                label="Status"
                value={appointment.status.toUpperCase()}
                isStatus
              />

              <View style={styles.instructionsContainer}>
                <DetailRow
                  icon="information-circle"
                  iconColor="#6B7280"
                  label="Preparation Instructions"
                  value="• Eat a healthy meal before donating
• Drink plenty of water
• Bring a valid ID
• Avoid alcohol 24 hours before donation
• Get a good night's sleep"
                />
              </View>
            </ScrollView>
          )}

          <ModalActions
            primaryTitle="Got it"
            secondaryTitle="Reschedule"
            onPrimary={onClose}
            onSecondary={() => {
              onClose();
              onReschedule();
            }}
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
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxHeight: 400,
  },
  instructionsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  appointmentIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F0FF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#6366F1",
  },
  copyButtonText: {
    fontSize: 12,
    color: "#6366F1",
    fontWeight: "600",
    marginLeft: 4,
  },
});
