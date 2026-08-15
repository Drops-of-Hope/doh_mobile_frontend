import React from "react";
import { View, StyleSheet } from "react-native";
import { Hospital, Droplet, Users, MapPin, Phone } from "lucide-react-native";
import { Sheet, Surface, Text } from "../../../design";
import ModalActions from "../molecules/ModalActions";
import DetailRow from "../atoms/DetailRow";
import { Emergency } from "../types";

interface EmergencyDetailsModalProps {
  visible: boolean;
  emergency: Emergency | null;
  onClose: () => void;
  onDonate: () => void;
}

export default function EmergencyDetailsModal({ visible, emergency, onClose, onDonate }: EmergencyDetailsModalProps) {
  return (
    <Sheet visible={visible} onClose={onClose} title="Emergency Details">
      {emergency ? (
        <View style={styles.body}>
          <Surface tone="crimsonSoft" style={styles.summary}>
            <Text variant="overline" tone="crimson">
              {emergency.urgency.toUpperCase()}
            </Text>
            <Text variant="h3" tone="crimson">
              {emergency.timeLeft}
            </Text>
          </Surface>

          <DetailRow icon={Hospital} label="Hospital" value={emergency.hospital} />
          <DetailRow icon={Droplet} label="Blood Type Needed" value={emergency.bloodType} />
          <DetailRow
            icon={Users}
            label="Donors"
            value={`${emergency.slotsUsed} / ${emergency.totalSlots} slots filled`}
          />
          <DetailRow icon={MapPin} label="Address" value={emergency.address || "Not provided"} />
          <DetailRow icon={Phone} label="Contact" value={emergency.contactNumber || "Not provided"} />

          {emergency.description ? (
            <View style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>
                Emergency Description
              </Text>
              <Text variant="body" tone="inkMuted">
                {emergency.description}
              </Text>
            </View>
          ) : null}

          {emergency.requirements ? (
            <View style={styles.section}>
              <Text variant="label" style={styles.sectionTitle}>
                Donation Requirements
              </Text>
              <Text variant="body" tone="inkMuted">
                {emergency.requirements}
              </Text>
            </View>
          ) : null}

          <ModalActions
            primaryTitle="Donate Now"
            secondaryTitle="Close"
            onPrimary={() => {
              onClose();
              onDonate();
            }}
            onSecondary={onClose}
          />
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 8 },
  summary: { marginBottom: 16 },
  section: { marginTop: 8, marginBottom: 16 },
  sectionTitle: { marginBottom: 6 },
});
