import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, ActivityIndicator, StyleSheet } from "react-native";
import { Calendar, ClipboardCheck } from "lucide-react-native";

import { Screen, AppBar, useTheme } from "../../design";
import AppointmentSection from "./organisms/AppointmentSection";
import EmptyState from "./organisms/EmptyState";

import { AppointmentScreenProps, Appointment } from "./types";
import { filterAppointments } from "./utils";
import { appointmentService } from "../../services/appointmentService";
import { useAuth } from "../../context/AuthContext";

import { logger } from "../../utils/logger";
import { useFocusRefresh } from "../../hooks/useFocusRefresh";

export default function UpcomingAppointmentScreen({ navigation }: AppointmentScreenProps) {
  const theme = useTheme();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const loadUserAppointments = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!user?.id && !user?.sub) {
      return;
    }

    try {
      if (!silent) setLoading(true);
      const userId = user.id || user.sub;

      const userAppointments = await appointmentService.getUserAppointments(userId);

      if (!userAppointments || userAppointments.length === 0) {
        setAppointments([]);
        return;
      }

      const transformedAppointments: Appointment[] = userAppointments.map((apt) => ({
        id: apt.id,
        hospital: apt.medicalEstablishment?.name || "",
        date: new Date(apt.appointmentDate).toISOString().split("T")[0],
        // appointmentDate is stored at UTC midnight, so its clock time is
        // meaningless — the slot carries the real window.
        time: apt.slot?.startTime
          ? `${apt.slot.startTime} - ${apt.slot.endTime}`
          : new Date(apt.appointmentDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        location: apt.medicalEstablishment?.address || apt.medicalEstablishment?.district || "",
        confirmationId: apt.id,
        status:
          apt.scheduled === "PENDING" ? "upcoming" : apt.scheduled === "COMPLETED" ? "completed" : "cancelled",
        type: "blood_donation", // Default type
        notes: `Appointment ID: ${apt.id}`,
      }));

      setAppointments(transformedAppointments);
    } catch (error) {
      logger.error("❌ Failed to load appointments:", error);
      setAppointments([]);

      // 404/not found means the user genuinely has no appointments yet;
      // anything else is a real failure worth surfacing.
      if (!silent &&
          error instanceof Error &&
          !error.message.includes("404") &&
          !error.message.includes("not found")) {
        Alert.alert(
          "Error",
          "Failed to load appointments. Please try again later.",
          [{ text: "OK" }]
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id || user?.sub) {
      loadUserAppointments();
    }
  }, [user, loadUserAppointments]);

  useFocusRefresh(useCallback(() => loadUserAppointments({ silent: true }), [loadUserAppointments]));

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUserAppointments();
    setRefreshing(false);
  }, [loadUserAppointments]);

  const handleCancelAppointment = async (appointmentId: string) => {
    Alert.alert("Cancel Appointment", "Are you sure you want to cancel this appointment?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await appointmentService.cancelAppointment(appointmentId);
            await loadUserAppointments();
            Alert.alert("Success", "Appointment cancelled successfully.");
          } catch (error) {
            logger.error("Failed to cancel appointment:", error);
            Alert.alert("Error", "Failed to cancel appointment. Please try again.");
          }
        },
      },
    ]);
  };

  const handleReschedule = async () => {
    Alert.alert(
      "Reschedule Appointment",
      "Contact the hospital to reschedule your appointment or book a new one.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Book New",
          onPress: () => navigation?.navigate("Donate"),
        },
      ]
    );
  };

  const handleBookAppointment = () => {
    navigation?.navigate("Donate");
  };

  const { upcomingAppointments, pastAppointments } = filterAppointments(appointments);
  const hasNoAppointments = upcomingAppointments.length === 0 && pastAppointments.length === 0;

  if (loading) {
    return (
      <Screen>
        <AppBar title="My Appointments" onBack={() => navigation?.goBack()} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.color.crimson} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll refreshing={refreshing} onRefresh={handleRefresh}>
      <AppBar title="My Appointments" onBack={() => navigation?.goBack()} />

      <AppointmentSection
        title="Upcoming Appointments"
        icon={Calendar}
        tone="crimson"
        appointments={upcomingAppointments}
        onCancel={handleCancelAppointment}
        onReschedule={handleReschedule}
        isPast={false}
      />

      <AppointmentSection
        title="Past Appointments"
        icon={ClipboardCheck}
        tone="success"
        appointments={pastAppointments}
        onCancel={() => {}}
        onReschedule={() => {}}
        isPast={true}
      />

      {hasNoAppointments && <EmptyState onBookAppointment={handleBookAppointment} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});
