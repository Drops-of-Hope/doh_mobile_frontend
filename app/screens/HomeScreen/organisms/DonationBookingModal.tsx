import React from "react";
import { View, StyleSheet } from "react-native";
import { Info } from "lucide-react-native";
import { Sheet, Surface, Text, Field, Icon, useTheme } from "../../../design";
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
  const theme = useTheme();
  const updateForm = (field: keyof DonationFormData, value: string) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Book Donation">
      {emergency ? (
        <View style={styles.body}>
          <Surface tone="crimsonSoft" style={styles.summary}>
            <Text variant="label" tone="crimson">
              Emergency Information
            </Text>
            <Text variant="bodyBold">
              {emergency.hospital} · {emergency.bloodType}
            </Text>
            <Text variant="caption" tone="crimson">
              {emergency.urgency} · {emergency.timeLeft}
            </Text>
          </Surface>

          <Text variant="h3" style={styles.formTitle}>
            Emergency Response Details
          </Text>

          <Field
            label="Contact Number"
            required
            value={formData.contactNumber}
            onChangeText={(text) => updateForm("contactNumber", text)}
            placeholder="+94 XX XXX XXXX"
            keyboardType="phone-pad"
          />

          <Field
            label="Special Requests"
            value={formData.specialRequests}
            onChangeText={(text) => updateForm("specialRequests", text)}
            placeholder="Any special requirements or notes..."
            multiline
            numberOfLines={3}
          />

          <View style={[styles.note, { backgroundColor: theme.color.infoSoft }]}>
            <Icon icon={Info} size={16} color={theme.color.info} />
            <Text variant="caption" tone="info" style={styles.noteText}>
              This is an emergency donation. We'll contact you immediately with urgent instructions for donation.
            </Text>
          </View>

          <ModalActions
            primaryTitle="Respond to Emergency"
            secondaryTitle="Cancel"
            onPrimary={onSubmit}
            onSecondary={onClose}
          />
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 8 },
  summary: { marginBottom: 20 },
  formTitle: { marginBottom: 14 },
  note: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 10, padding: 12, marginTop: 4 },
  noteText: { flex: 1 },
});
