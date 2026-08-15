import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, Clock, MapPin, FileText } from "lucide-react-native";
import DetailRow from "../atoms/DetailRow";
import { Appointment } from "../types";
import { formatAppointmentDate } from "../utils";

interface AppointmentDetailsProps {
  appointment: Appointment;
  isPast?: boolean;
  onCopy?: (message: string) => void;
}

export default function AppointmentDetails({ appointment, isPast = false, onCopy }: AppointmentDetailsProps) {
  return (
    <View style={styles.appointmentDetails}>
      <DetailRow
        icon={Calendar}
        text={formatAppointmentDate(appointment.date, isPast)}
        tone={isPast ? "ink" : "crimson"}
        isPast={isPast}
      />

      {!isPast && <DetailRow icon={Clock} text={appointment.time} tone="warning" />}

      {!isPast && <DetailRow icon={MapPin} text={appointment.location} tone="danger" />}

      <DetailRow
        icon={FileText}
        text={`ID: ${appointment.confirmationId}`}
        tone={isPast ? "ink" : "success"}
        isPast={isPast}
        onCopy={onCopy}
        copyValue={appointment.confirmationId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentDetails: { gap: 8, marginBottom: 16 },
});
