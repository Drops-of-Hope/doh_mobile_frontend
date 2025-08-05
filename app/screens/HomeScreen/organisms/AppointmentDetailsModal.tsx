import React from "react";
import { Modal, View, ScrollView, StyleSheet } from "react-native";
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
});
