import React from "react";
import { Modal, View, ScrollView, Text, StyleSheet } from "react-native";
import ModalHeader from "../molecules/ModalHeader";
import ModalActions from "../molecules/ModalActions";
import DetailRow from "../atoms/DetailRow";
import { Emergency } from "../types";

interface EmergencyDetailsModalProps {
  visible: boolean;
  emergency: Emergency | null;
  onClose: () => void;
  onDonate: () => void;
}

export default function EmergencyDetailsModal({
  visible,
  emergency,
  onClose,
  onDonate,
}: EmergencyDetailsModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ModalHeader title="Emergency Details" onClose={onClose} />

          {emergency && (
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.emergencyInfo}>
                <Text style={styles.emergencyInfoTitle}>
                  Emergency Information
                </Text>
                <Text style={styles.emergencyInfoUrgency}>
                  {emergency.urgency} - {emergency.timeLeft}
                </Text>
              </View>

              <DetailRow
                icon="medical"
                iconColor="#F59E0B"
                label="Hospital"
                value={emergency.hospital}
              />

              <DetailRow
                icon="water"
                iconColor="#DC2626"
                label="Blood Type Needed"
                value={emergency.bloodType}
              />

              <DetailRow
                icon="people"
                iconColor="#8B5CF6"
                label="Donors"
                value={`${emergency.slotsUsed} / ${emergency.totalSlots} slots filled`}
              />

              <DetailRow
                icon="location"
                iconColor="#10B981"
                label="Address"
                value={emergency.address || "Not provided"}
              />

              <DetailRow
                icon="call"
                iconColor="#3B82F6"
                label="Contact"
                value={emergency.contactNumber || "Not provided"}
              />

              {emergency.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>
                    Emergency Description
                  </Text>
                  <Text style={styles.descriptionText}>
                    {emergency.description}
                  </Text>
                </View>
              )}

              {emergency.requirements && (
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>
                    Donation Requirements
                  </Text>
                  <Text style={styles.requirementsText}>
                    {emergency.requirements}
                  </Text>
                </View>
              )}

              <View style={styles.modalBottomPadding} />
            </ScrollView>
          )}

          <ModalActions
            primaryTitle="Close"
            secondaryTitle="Donate Now"
            onPrimary={onClose}
            onSecondary={() => {
              onClose();
              onDonate();
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
  emergencyInfo: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#DC2626",
  },
  emergencyInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 4,
  },
  emergencyInfoUrgency: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DC2626",
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  requirementsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  modalBottomPadding: {
    height: 20,
  },
});
