import React from "react";
import { View, StyleSheet } from "react-native";
import { Building2, MapPin, Calendar, Clock, Hourglass, CheckCircle2, XCircle, CalendarClock, Trash2 } from "lucide-react-native";
import { Sheet, Text, Button, Icon, useTheme } from "../../../design";
import { Appointment } from "../types";

interface AppointmentDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  appointment: Appointment | null;
  onCancel?: (appointment: Appointment) => void;
  onRebook?: (appointment: Appointment) => void;
}

export default function AppointmentDetailsModal({
  visible,
  onClose,
  appointment,
  onCancel,
  onRebook,
}: AppointmentDetailsModalProps) {
  const theme = useTheme();
  if (!appointment) return null;

  const isUpcoming = appointment.status === "upcoming";
  const statusIcon =
    appointment.status === "upcoming" ? Hourglass : appointment.status === "completed" ? CheckCircle2 : XCircle;
  const statusColor =
    appointment.status === "completed"
      ? theme.color.success
      : appointment.status === "cancelled"
      ? theme.color.danger
      : theme.color.crimson;

  return (
    <Sheet visible={visible} onClose={onClose} title="Appointment Details">
      <DetailRow icon={Building2} label="Hospital" value={appointment.hospital} />
      <DetailRow icon={MapPin} label="Location" value={appointment.location} />
      <DetailRow icon={Calendar} label="Date" value={appointment.date} />
      <DetailRow icon={Clock} label="Time" value={appointment.time} last={!isUpcoming || (!onCancel && !onRebook)} />
      <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
        <Icon icon={statusIcon} size={20} color={statusColor} />
        <View style={styles.detailTextContainer}>
          <Text variant="overline" tone="inkMuted">
            Status
          </Text>
          <Text variant="bodyBold" style={{ color: statusColor }}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Text>
        </View>
      </View>

      {isUpcoming && (onCancel || onRebook) && (
        <View style={styles.actionButtons}>
          {onRebook && (
            <View style={styles.actionFlex}>
              <Button
                title="Rebook"
                variant="outline"
                onPress={() => onRebook(appointment)}
                icon={<Icon icon={CalendarClock} size={18} color={theme.color.info} />}
              />
            </View>
          )}
          {onCancel && (
            <View style={styles.actionFlex}>
              <Button
                title="Cancel"
                variant="danger"
                onPress={() => onCancel(appointment)}
                icon={<Icon icon={Trash2} size={18} color={theme.color.danger} />}
              />
            </View>
          )}
        </View>
      )}
    </Sheet>
  );
}

function DetailRow({ icon, label, value, last }: { icon: any; label: string; value: string; last?: boolean }) {
  const theme = useTheme();
  return (
    <View style={[styles.detailRow, { borderBottomColor: theme.color.hairline }, last && { borderBottomWidth: 0 }]}>
      <Icon icon={icon} size={20} color={theme.color.crimson} />
      <View style={styles.detailTextContainer}>
        <Text variant="overline" tone="inkMuted">
          {label}
        </Text>
        <Text variant="bodyBold">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  detailTextContainer: { marginLeft: 12, flex: 1, gap: 2 },
  actionButtons: { flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 8 },
  actionFlex: { flex: 1 },
});
