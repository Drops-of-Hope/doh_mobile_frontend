import React from "react";
import { View, StyleSheet, Text, ActivityIndicator, RefreshControl, ScrollView } from "react-native";
import AppointmentTab from "../organisms/AppointmentTab";
import ActionButton from "../atoms/ActionButton";
import { Appointment } from "../types";

interface AppointmentSectionProps {
  appointments: Appointment[];
  upcomingAppointments?: Appointment[];
  appointmentHistory?: Appointment[];
  loading?: boolean;
  onShowBooking: () => void;
  onRefresh?: () => Promise<void>;
}

export default function AppointmentSection({
  appointments,
  upcomingAppointments = [],
  appointmentHistory = [],
  loading = false,
  onShowBooking,
  onRefresh,
}: AppointmentSectionProps) {
  const [refreshing, setRefreshing] = React.useState(false);

  const handleRefresh = async () => {
    if (onRefresh) {
      setRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
      }
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <View style={[styles.appointmentSection, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.appointmentSection}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#DC2626"]}
            tintColor="#DC2626"
          />
        ) : undefined
      }
    >
      {/* Upcoming Appointments Section */}
      {upcomingAppointments.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
          <AppointmentTab
            appointments={upcomingAppointments}
            onBookAppointment={onShowBooking}
          />
        </View>
      )}

      {/* Appointment History Section */}
      {appointmentHistory.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Appointment History</Text>
          <AppointmentTab
            appointments={appointmentHistory}
            onBookAppointment={onShowBooking}
          />
        </View>
      )}

      {/* Fallback: Show all appointments if specific sections not provided */}
      {(!upcomingAppointments.length && !appointmentHistory.length && appointments.length > 0) && (
        <AppointmentTab
          appointments={appointments}
          onBookAppointment={onShowBooking}
        />
      )}

      {/* No appointments message */}
      {appointments.length === 0 && !loading && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No appointments found</Text>
          <Text style={styles.emptySubtext}>Book your first appointment to get started</Text>
        </View>
      )}

      <View style={styles.appointmentActions}>
        <ActionButton
          title="Book New Appointment"
          icon="calendar-outline"
          onPress={onShowBooking}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appointmentSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  appointmentActions: {
    marginTop: 16,
  },
});
