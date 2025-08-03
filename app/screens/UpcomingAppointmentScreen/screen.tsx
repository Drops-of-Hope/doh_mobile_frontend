import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  View,
} from "react-native";

// Import refactored components
import AppointmentHeader from "./molecules/AppointmentHeader";
import AppointmentSection from "./organisms/AppointmentSection";
import EmptyState from "./organisms/EmptyState";

// Import types and utilities
import { AppointmentScreenProps, Appointment } from "./types";
import { getMockAppointments, filterAppointments } from "./utils";

export default function UpcomingAppointmentScreen({
  navigation,
}: AppointmentScreenProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(
    getMockAppointments(),
  );

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            setAppointments((prev) =>
              prev.map((apt) =>
                apt.id === appointmentId
                  ? { ...apt, status: "cancelled" as const }
                  : apt,
              ),
            );
          },
        },
      ],
    );
  };

  const handleReschedule = (appointmentId: string) => {
    Alert.alert(
      "Reschedule Appointment",
      "Contact the hospital to reschedule your appointment.",
      [{ text: "OK" }],
    );
  };

  const handleBookAppointment = () => {
    // Navigate to booking screen or show booking modal
    console.log("Book appointment pressed");
  };

  const handleBack = () => {
    navigation?.goBack();
  };

  const handleAdd = () => {
    // Navigate to add appointment screen
    console.log("Add appointment pressed");
  };

  const { upcomingAppointments, pastAppointments } =
    filterAppointments(appointments);
  const hasNoAppointments =
    upcomingAppointments.length === 0 && pastAppointments.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <AppointmentHeader
        title="My Appointments"
        onBack={handleBack}
        onAdd={handleAdd}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <AppointmentSection
          title="Upcoming Appointments"
          icon="calendar"
          iconColor="#DC2626"
          appointments={upcomingAppointments}
          onCancel={handleCancelAppointment}
          onReschedule={handleReschedule}
          isPast={false}
        />

        <AppointmentSection
          title="Past Appointments"
          icon="clipboard"
          iconColor="#10B981"
          appointments={pastAppointments}
          onCancel={() => {}} // No actions for past appointments
          onReschedule={() => {}}
          isPast={true}
        />

        {hasNoAppointments && (
          <EmptyState onBookAppointment={handleBookAppointment} />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 24,
  },
});
