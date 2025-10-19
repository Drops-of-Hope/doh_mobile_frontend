import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  View,
  ActivityIndicator,
} from "react-native";

// Import refactored components
import AppointmentHeader from "./molecules/AppointmentHeader";
import AppointmentSection from "./organisms/AppointmentSection";
import EmptyState from "./organisms/EmptyState";

// Import types and utilities
import { AppointmentScreenProps, Appointment } from "./types";
import { filterAppointments } from "./utils";
import { appointmentService } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

export default function UpcomingAppointmentScreen({
  navigation,
}: AppointmentScreenProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Load user appointments from backend
  useEffect(() => {
    if (user?.id || user?.sub) {
      loadUserAppointments();
    }
  }, [user]);

  const loadUserAppointments = async () => {
    if (!user?.id && !user?.sub) {
      console.log("⚠️ No user ID available");
      return;
    }
    
    try {
      setLoading(true);
      const userId = user.id || user.sub;
      console.log("🔍 Loading appointments for user:", userId);
      
      const userAppointments = await appointmentService.getUserAppointments(userId);
      console.log("📅 Raw appointments from API:", userAppointments);
      
      if (!userAppointments || userAppointments.length === 0) {
        console.log("📅 No appointments found");
        setAppointments([]);
        return;
      }
      
      // Transform backend appointments to screen format
      const transformedAppointments: Appointment[] = userAppointments.map(apt => {
        console.log("🔄 Transforming appointment:", apt);
        
        return {
          id: apt.id,
          hospital: "Medical Center", // TODO: Get from medical establishment
          date: new Date(apt.appointmentDate).toISOString().split('T')[0],
          time: new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: "Blood Donation Center", // TODO: Get from medical establishment
          confirmationId: apt.id,
          status: apt.scheduled === "PENDING" 
            ? "upcoming" 
            : apt.scheduled === "COMPLETED" 
              ? "completed" 
              : "cancelled",
          type: "blood_donation", // Default type
          notes: `Appointment ID: ${apt.id}` // Include appointment ID for reference
        };
      });
      
      console.log("✅ Transformed appointments:", transformedAppointments);
      setAppointments(transformedAppointments);
    } catch (error) {
      console.error("❌ Failed to load appointments:", error);
      // Set empty array on error - show "No appointments" message
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await appointmentService.cancelAppointment(appointmentId);
              // Reload appointments after cancellation
              await loadUserAppointments();
              Alert.alert("Success", "Appointment cancelled successfully.");
            } catch (error) {
              console.error("Failed to cancel appointment:", error);
              Alert.alert("Error", "Failed to cancel appointment. Please try again.");
            }
          },
        },
      ],
    );
  };

  const handleReschedule = async (appointmentId: string) => {
    Alert.alert(
      "Reschedule Appointment",
      "Contact the hospital to reschedule your appointment or book a new one.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book New",
          onPress: () => {
            // Navigate to booking screen
            navigation?.navigate('DonationScreen');
          }
        }
      ],
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

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <ActivityIndicator size="large" color="#DC2626" />
      </SafeAreaView>
    );
  }

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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 24,
  },
});
