import React from "react";
import { View, StyleSheet } from "react-native";
import AppointmentTab from "../../../../components/organisms/DonationScreen/AppointmentTab";
import ActionButton from "../atoms/ActionButton";
import { Appointment } from "../types";

interface AppointmentSectionProps {
  appointments: Appointment[];
  onShowBooking: () => void;
}

export default function AppointmentSection({
  appointments,
  onShowBooking,
}: AppointmentSectionProps) {
  return (
    <View style={styles.appointmentSection}>
      <AppointmentTab
        appointments={appointments}
        onBookAppointment={onShowBooking}
      />

      <View style={styles.appointmentActions}>
        <ActionButton
          title="Book New Appointment"
          icon="calendar-outline"
          onPress={onShowBooking}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  appointmentActions: {
    marginTop: 16,
  },
});
