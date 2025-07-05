import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppointmentCard, { Appointment } from '../../molecules/HomeScreen/AppointmentCard';

interface AppointmentSectionProps {
  appointment: Appointment | null;
  title?: string;
  onViewDetails?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
}

export default function AppointmentSection({ 
  appointment, 
  title,
  onViewDetails,
  onReschedule 
}: AppointmentSectionProps) {
  if (!appointment) {
    return null;
  }

  return (
    <View style={styles.section}>
      <AppointmentCard
        appointment={appointment}
        title={title}
        onViewDetails={onViewDetails}
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
