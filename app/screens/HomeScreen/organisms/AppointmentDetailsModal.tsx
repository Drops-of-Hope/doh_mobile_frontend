import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { FileText, Calendar, MapPin, Hospital, CheckCircle2, Info, Copy } from "lucide-react-native";
import { Sheet, Text, Icon, Surface, useTheme } from "../../../design";
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
  const theme = useTheme();

  const copyAppointmentId = () => {
    if (!appointment?.id) return;
    Alert.alert("Appointment ID", `ID: ${appointment.id}`, [{ text: "OK" }]);
  };

  return (
    <Sheet visible={visible} onClose={onClose} title="Appointment Details">
      {appointment ? (
        <View style={styles.body}>
          <View style={styles.idRow}>
            <View style={styles.idText}>
              <DetailRow icon={FileText} label="Appointment ID" value={appointment.id} />
            </View>
            <Surface
              tone="surface"
              padding="sm"
              radius="sm"
              style={[styles.copyButton, { borderColor: theme.color.crimson }]}
              onTouchEnd={copyAppointmentId}
            >
              <Icon icon={Copy} size={14} color={theme.color.crimson} />
              <Text variant="caption" tone="crimson">
                Copy
              </Text>
            </Surface>
          </View>

          <DetailRow icon={Calendar} label="Date & Time" value={`${appointment.date} at ${appointment.time}`} />
          <DetailRow icon={MapPin} label="Location" value={appointment.location} />
          <DetailRow icon={Hospital} label="Hospital" value={appointment.hospital} />
          <DetailRow icon={CheckCircle2} label="Status" value={appointment.status.toUpperCase()} isStatus />

          <View style={[styles.instructions, { backgroundColor: theme.color.infoSoft }]}>
            <View style={styles.instructionsHeader}>
              <Icon icon={Info} size={16} color={theme.color.info} />
              <Text variant="label" tone="info">
                Preparation Instructions
              </Text>
            </View>
            <Text variant="caption" tone="inkMuted" style={styles.instructionLine}>
              • Eat a healthy meal before donating
            </Text>
            <Text variant="caption" tone="inkMuted" style={styles.instructionLine}>
              • Drink plenty of water
            </Text>
            <Text variant="caption" tone="inkMuted" style={styles.instructionLine}>
              • Bring a valid ID
            </Text>
            <Text variant="caption" tone="inkMuted" style={styles.instructionLine}>
              • Avoid alcohol 24 hours before donation
            </Text>
            <Text variant="caption" tone="inkMuted" style={styles.instructionLine}>
              • Get a good night's sleep
            </Text>
          </View>

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
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  body: { paddingBottom: 8 },
  idRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  idText: { flex: 1 },
  copyButton: { flexDirection: "row", alignItems: "center", gap: 4, borderWidth: 1.5, marginBottom: 16 },
  instructions: { borderRadius: 12, padding: 14, marginTop: 8, marginBottom: 16 },
  instructionsHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  instructionLine: { marginBottom: 4, lineHeight: 16 },
});
