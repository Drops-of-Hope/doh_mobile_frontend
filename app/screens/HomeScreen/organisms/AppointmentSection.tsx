import React from "react";
import { View, StyleSheet } from "react-native";
import ExpandableAppointmentCard, {
  Appointment,
} from "../molecules/ExpandableAppointmentCard";

interface AppointmentSectionProps {
  appointment: Appointment | null;
  title?: string;
  onReschedule?: (appointment: Appointment) => void;
}

export default function AppointmentSection({
  appointment,
  title,
  onReschedule,
}: AppointmentSectionProps) {
  if (!appointment) {
    return null;
  }

  return (
    <View style={styles.section}>
      <ExpandableAppointmentCard
        appointment={appointment}
        title={title}
        onReschedule={onReschedule}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
});
