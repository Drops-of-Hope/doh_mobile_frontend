import React from "react";
import { View, StyleSheet } from "react-native";
import DetailRow from "../atoms/DetailRow";
import { Appointment } from "../types";
import { formatAppointmentDate } from "../utils";

interface AppointmentDetailsProps {
  appointment: Appointment;
  isPast?: boolean;
  onCopy?: (message: string) => void;
}

export default function AppointmentDetails({
  appointment,
  isPast = false,
  onCopy,
}: AppointmentDetailsProps) {
  return (
    <View style={styles.appointmentDetails}>
      <DetailRow
        icon="calendar"
        text={formatAppointmentDate(appointment.date, isPast)}
        color={isPast ? "#6B7280" : "#DC2626"}
        isPast={isPast}
      />

      {!isPast && (
        <DetailRow icon="time" text={appointment.time} color="#F59E0B" />
      )}

      {!isPast && (
        <DetailRow
          icon="location"
          text={appointment.location}
          color="#EF4444"
        />
      )}

      <DetailRow
        icon="document-text"
        text={`ID: ${appointment.confirmationId}`}
        color={isPast ? "#6B7280" : "#10B981"}
        isPast={isPast}
        onCopy={onCopy}
        copyValue={appointment.confirmationId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentDetails: {
    gap: 8,
    marginBottom: 16,
  },
});
