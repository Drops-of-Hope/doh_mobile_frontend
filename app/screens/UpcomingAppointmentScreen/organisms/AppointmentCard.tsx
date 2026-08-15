import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Surface, Toast } from "../../../design";
import { AppointmentCardProps } from "../types";
import { getTypeDisplay } from "../utils";
import StatusBadge from "../atoms/StatusBadge";
import AppointmentInfo from "../molecules/AppointmentInfo";
import AppointmentDetails from "../molecules/AppointmentDetails";
import NotesContainer from "../molecules/NotesContainer";
import ActionButtons from "../molecules/ActionButtons";

export default function AppointmentCard({ appointment, onCancel, onReschedule, isPast = false }: AppointmentCardProps) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCopy = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  return (
    <Surface style={[styles.appointmentCard, isPast && styles.pastCard]}>
      <View style={styles.appointmentHeader}>
        <AppointmentInfo hospital={appointment.hospital} type={getTypeDisplay(appointment.type)} />
        <StatusBadge status={appointment.status} />
      </View>

      <AppointmentDetails appointment={appointment} isPast={isPast} onCopy={handleCopy} />

      {appointment.notes && <NotesContainer notes={appointment.notes} />}

      {!isPast && (
        <ActionButtons onReschedule={() => onReschedule(appointment.id)} onCancel={() => onCancel(appointment.id)} />
      )}

      <Toast visible={toastVisible} message={toastMessage} type="success" onHide={() => setToastVisible(false)} />
    </Surface>
  );
}

const styles = StyleSheet.create({
  appointmentCard: { marginBottom: 16 },
  pastCard: { opacity: 0.75 },
  appointmentHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
});
