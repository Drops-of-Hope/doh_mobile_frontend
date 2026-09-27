import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Pressable, Alert } from "react-native";
import { CalendarPlus } from "lucide-react-native";
import { Surface, Text, Button, Icon, EmptyState, useTheme } from "../../../design";
import AppointmentCard from "../molecules/AppointmentCard";
import AppointmentDetailsModal from "../organisms/AppointmentDetailsModal";
import NoticeCard from "../atoms/NoticeCard";
import { Appointment } from "../types";
import { useLanguage } from "../../../context/LanguageContext";

type AppointmentTabType = "upcoming" | "completed" | "cancelled";

interface AppointmentSectionProps {
  appointments: Appointment[];
  upcomingAppointments?: Appointment[];
  appointmentHistory?: Appointment[];
  loading?: boolean;
  onShowBooking: () => void;
  onRefresh?: () => Promise<void>;
}

// Rendered inside DonationScreen's own scrolling <Screen>, so this stays a
// plain View — no nested ScrollView/RefreshControl.
export default function AppointmentSection({
  appointments,
  upcomingAppointments = [],
  appointmentHistory = [],
  loading = false,
  onShowBooking,
  onRefresh,
}: AppointmentSectionProps) {
  const theme = useTheme();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<AppointmentTabType>("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const upcomingAppts =
    upcomingAppointments.length > 0 ? upcomingAppointments : appointments.filter((apt) => apt.status === "upcoming");
  const completedAppts = appointmentHistory.filter((apt) => apt.status === "completed");
  const cancelledAppts = appointmentHistory.filter((apt) => apt.status === "cancelled");

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleCancelAppointment = (_appointment: Appointment) => {
    Alert.alert(
      "Cancel Appointment",
      "Cancelling this appointment won't guarantee your next reservation slot availability. Are you sure you want to cancel?",
      [
        { text: "No, Keep It", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => {
            // TODO: Implement actual cancellation logic
            setShowDetailsModal(false);
            Alert.alert("Cancelled", "Your appointment has been cancelled.");
            onRefresh?.();
          },
        },
      ]
    );
  };

  const handleRebookAppointment = (_appointment: Appointment) => {
    Alert.alert(
      "Rebook Appointment",
      "Rebooking this appointment won't guarantee your next reservation slot availability. Do you want to proceed with rebooking?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Rebook",
          onPress: () => {
            setShowDetailsModal(false);
            onShowBooking();
          },
        },
      ]
    );
  };

  if (loading && appointments.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.color.crimson} />
        <Text variant="body" tone="inkMuted" style={styles.loadingText}>
          Loading appointments...
        </Text>
      </View>
    );
  }

  const tabs: { key: AppointmentTabType; label: string; count: number }[] = [
    { key: "upcoming", label: "Upcoming", count: upcomingAppts.length },
    { key: "completed", label: "Completed", count: completedAppts.length },
    { key: "cancelled", label: "Cancelled", count: cancelledAppts.length },
  ];

  const currentAppointments =
    activeTab === "upcoming" ? upcomingAppts : activeTab === "completed" ? completedAppts : cancelledAppts;

  const emptyMessage =
    activeTab === "upcoming"
      ? "There are no upcoming appointments"
      : activeTab === "completed"
      ? "No completed appointments yet"
      : "No cancelled appointments";

  return (
    <>
      {/* Make an Appointment Card */}
      <Surface style={styles.appointmentCard}>
        <Text variant="h2" tone="crimson" style={styles.title}>
          {t("donation.appointment_tab_title")}
        </Text>
        <Text variant="body" tone="inkMuted" style={styles.subtitle}>
          {t("donation.appointment_tab_description")}
        </Text>

        <NoticeCard
          title="Important Notice"
          message="This appointment is purely for blood donation purposes and not for health checkups, medical consultations, or any other medical activities."
          type="warning"
        />

        <Button
          title={t("donation.book_appointment")}
          onPress={onShowBooking}
          icon={<Icon icon={CalendarPlus} size={20} color={theme.color.inverse} />}
        />
      </Surface>

      {/* Appointment Sections with Tabs */}
      <Surface style={styles.sectionsContainer}>
        <Text variant="h2" tone="crimson" style={styles.sectionsTitle}>
          Your Appointments
        </Text>

        <View
          style={[styles.tabContainer, { backgroundColor: theme.color.surfaceSunken, borderRadius: theme.radius.md }]}
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <Pressable
                key={tab.key}
                style={[
                  styles.tabButton,
                  { backgroundColor: active ? theme.color.crimson : "transparent", borderRadius: theme.radius.sm },
                ]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text variant="label" tone={active ? "inverse" : "inkMuted"}>
                  {tab.label}
                </Text>
                <Text variant="caption" tone={active ? "inverse" : "inkFaint"}>
                  {tab.count}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View>
          {currentAppointments.length > 0 ? (
            currentAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onViewDetails={appointment.status === "upcoming" ? handleViewDetails : undefined}
              />
            ))
          ) : (
            <EmptyState icon={CalendarPlus} title={emptyMessage} />
          )}
        </View>
      </Surface>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        visible={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        appointment={selectedAppointment}
        onCancel={handleCancelAppointment}
        onRebook={handleRebookAppointment}
      />
    </>
  );
}

const styles = StyleSheet.create({
  appointmentCard: { marginBottom: 16 },
  title: { marginBottom: 8 },
  subtitle: { marginBottom: 16, lineHeight: 20 },
  sectionsContainer: {},
  sectionsTitle: { marginBottom: 16 },
  loadingContainer: { justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  loadingText: { marginTop: 12 },
  tabContainer: { flexDirection: "row", padding: 4, marginBottom: 16 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: "center", justifyContent: "center", gap: 2 },
});
