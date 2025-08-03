import React from "react";
import { View, StyleSheet } from "react-native";
import { Appointment } from "../types";
import SectionHeader from "../molecules/SectionHeader";
import AppointmentCard from "./AppointmentCard";

interface AppointmentSectionProps {
  title: string;
  icon: string;
  iconColor: string;
  appointments: Appointment[];
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
  isPast?: boolean;
}

export default function AppointmentSection({
  title,
  icon,
  iconColor,
  appointments,
  onCancel,
  onReschedule,
  isPast = false,
}: AppointmentSectionProps) {
  if (appointments.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <SectionHeader icon={icon} iconColor={iconColor} title={title} />

      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onCancel={onCancel}
          onReschedule={onReschedule}
          isPast={isPast}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
});
