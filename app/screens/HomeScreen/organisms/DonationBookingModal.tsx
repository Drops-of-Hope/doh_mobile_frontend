import React from "react";
import {
  Modal,
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ModalHeader from "../molecules/ModalHeader";
import ModalActions from "../molecules/ModalActions";
import { Emergency, DonationFormData } from "../types";

interface DonationBookingModalProps {
  visible: boolean;
  emergency: Emergency | null;
  formData: DonationFormData;
  onFormChange: (data: DonationFormData) => void;
  onClose: () => void;
  onSubmit: () => void;
}

export default function DonationBookingModal({
  visible,
  emergency,
  formData,
  onFormChange,
  onClose,
  onSubmit,
}: DonationBookingModalProps) {
  const updateForm = (field: keyof DonationFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
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
          <ModalHeader title="Book Donation" onClose={onClose} />

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            {emergency && (
              <>
                <View style={styles.emergencyInfo}>
                  <Text style={styles.emergencyInfoTitle}>
                    Emergency Information
                  </Text>
                  <Text style={styles.emergencyInfoText}>
                    {emergency.hospital} - {emergency.bloodType}
                  </Text>
                  <Text style={styles.emergencyInfoUrgency}>
                    {emergency.urgency} - {emergency.timeLeft}
                  </Text>
                </View>

                <View style={styles.formContainer}>
                  <Text style={styles.formTitle}>
                    Emergency Response Details
                  </Text>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Contact Number *</Text>
                    <TextInput
                      style={styles.textInput}
                      value={formData.contactNumber}
                      onChangeText={(text) => updateForm("contactNumber", text)}
                      placeholder="+94 XX XXX XXXX"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Special Requests</Text>
                    <TextInput
                      style={[styles.textInput, styles.textArea]}
                      value={formData.specialRequests}
                      onChangeText={(text) =>
                        updateForm("specialRequests", text)
                      }
                      placeholder="Any special requirements or notes..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.noteContainer}>
                    <Ionicons
                      name="information-circle"
                      size={16}
                      color="#6B7280"
                    />
                    <Text style={styles.noteText}>
                      This is an emergency donation. We'll contact you
                      immediately with urgent instructions for donation.
                    </Text>
                  </View>
                </View>

                <View style={styles.modalBottomPadding} />
              </>
            )}
          </ScrollView>

          <ModalActions
            primaryTitle="Respond to Emergency"
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
  emergencyInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  emergencyInfoUrgency: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
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
