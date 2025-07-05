import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NoticeCard from '../../atoms/DonationScreen/NoticeCard';
import AppointmentCard, { AppointmentItem } from '../../molecules/DonationScreen/AppointmentCard';

interface AppointmentTabProps {
  appointments: AppointmentItem[];
  onBookAppointment: () => void;
}

export default function AppointmentTab({ appointments, onBookAppointment }: AppointmentTabProps) {
  const upcomingAppointments = appointments.filter(apt => apt.status === 'upcoming');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Make an Appointment</Text>
        <Text style={styles.subtitle}>
          Schedule your blood donation appointment at a hospital or blood bank
        </Text>

        <NoticeCard
          title="Important Notice"
          message="This appointment is purely for blood donation purposes and not for health checkups, medical consultations, or any other medical activities."
          type="warning"
        />

        <TouchableOpacity style={styles.bookButton} onPress={onBookAppointment}>
          <Ionicons name="calendar" size={24} color="white" />
          <Text style={styles.buttonText}>Book Appointment</Text>
        </TouchableOpacity>

        {appointments.length > 0 && (
          <View style={styles.appointmentsSection}>
            {upcomingAppointments.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📅 Upcoming Appointments</Text>
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </View>
            )}

            {completedAppointments.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>📋 Donation History</Text>
                {completedAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  appointmentsSection: {
    marginTop: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
});
