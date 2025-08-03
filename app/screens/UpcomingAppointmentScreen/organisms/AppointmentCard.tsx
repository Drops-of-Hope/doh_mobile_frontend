import React from "react";
import { View, StyleSheet } from "react-native";
import { AppointmentCardProps } from "../types";
import { getTypeDisplay } from "../utils";
import StatusBadge from "../atoms/StatusBadge";
import AppointmentInfo from "../molecules/AppointmentInfo";
import AppointmentDetails from "../molecules/AppointmentDetails";
import NotesContainer from "../molecules/NotesContainer";
import ActionButtons from "../molecules/ActionButtons";

export default function AppointmentCard({
  appointment,
  onCancel,
  onReschedule,
  isPast = false,
}: AppointmentCardProps) {
  const handleCancel = () => onCancel(appointment.id);
  const handleReschedule = () => onReschedule(appointment.id);

  return (
    <View style={[styles.appointmentCard, isPast && styles.pastCard]}>
      <View style={styles.appointmentHeader}>
        <AppointmentInfo
          hospital={appointment.hospital}
          type={getTypeDisplay(appointment.type)}
        />

        <StatusBadge status={appointment.status} />
      </View>

      <AppointmentDetails appointment={appointment} isPast={isPast} />

      {appointment.notes && <NotesContainer notes={appointment.notes} />}

      {!isPast && (
        <ActionButtons
          onReschedule={handleReschedule}
          onCancel={handleCancel}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  pastCard: {
    opacity: 0.8,
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
});
