import React, { useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppointmentCard from "../molecules/AppointmentCard";
import NoticeCard from "../atoms/NoticeCard";
import { Appointment } from "../types";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";
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

export default function AppointmentSection({
  appointments,
  upcomingAppointments = [],
  appointmentHistory = [],
  loading = false,
  onShowBooking,
  onRefresh,
}: AppointmentSectionProps) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [activeTab, setActiveTab] = useState<AppointmentTabType>("upcoming");
  const { t } = useLanguage();

  // Separate appointments by status
  const upcomingAppts = upcomingAppointments.length > 0 ? upcomingAppointments : 
    appointments.filter(apt => apt.status === "upcoming");
  const completedAppts = appointmentHistory.filter(apt => apt.status === "completed");
  const cancelledAppts = appointmentHistory.filter(apt => apt.status === "cancelled");

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
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        <Text style={styles.loadingText}>Loading appointments...</Text>
      </View>
    );
  }

  const renderTabButton = (tabType: AppointmentTabType, label: string, count: number) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tabType && styles.activeTabButton,
      ]}
      onPress={() => setActiveTab(tabType)}
    >
      <Text style={[
        styles.tabButtonText,
        activeTab === tabType && styles.activeTabButtonText,
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.tabCount,
        activeTab === tabType && styles.activeTabCount,
      ]}>
        {count}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{message}</Text>
    </View>
  );

  const getCurrentAppointments = () => {
    switch (activeTab) {
      case "upcoming":
        return upcomingAppts;
      case "completed":
        return completedAppts;
      case "cancelled":
        return cancelledAppts;
      default:
        return [];
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case "upcoming":
        return "There are no upcoming appointments";
      case "completed":
        return "No completed appointments yet";
      case "cancelled":
        return "No cancelled appointments";
      default:
        return "No appointments found";
    }
  };

  return (
    <ScrollView 
      style={styles.appointmentSection}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[COLORS.PRIMARY]}
            tintColor={COLORS.PRIMARY}
          />
        ) : undefined
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Make an Appointment Card */}
      <View style={styles.appointmentCard}>
        <Text style={styles.title}>{t("donation.appointment_tab_title")}</Text>
        <Text style={styles.subtitle}>
          {t("donation.appointment_tab_description")}
        </Text>

        <NoticeCard
          title="Important Notice"
          message="This appointment is purely for blood donation purposes and not for health checkups, medical consultations, or any other medical activities."
          type="warning"
        />

        <TouchableOpacity style={styles.bookButton} onPress={onShowBooking}>
          <Ionicons name="calendar" size={24} color="white" />
          <Text style={styles.buttonText}>{t("donation.book_appointment")}</Text>
        </TouchableOpacity>
      </View>

      {/* Appointment Sections with Tabs */}
      <View style={styles.appointmentSectionsContainer}>
        <Text style={styles.sectionsTitle}>Your Appointments</Text>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {renderTabButton("upcoming", "Upcoming", upcomingAppts.length)}
          {renderTabButton("completed", "Completed", completedAppts.length)}
          {renderTabButton("cancelled", "Cancelled", cancelledAppts.length)}
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {getCurrentAppointments().length > 0 ? (
            getCurrentAppointments().map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
              />
            ))
          ) : (
            renderEmptyState(getEmptyMessage())
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appointmentSection: {
    flex: 1,
    paddingHorizontal: SPACING.MD,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    marginBottom: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.MD,
    lineHeight: 22,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: BORDER_RADIUS.MD,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.SM,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.XS,
  },
  appointmentSectionsContainer: {
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    marginBottom: SPACING.MD,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: SPACING.MD,
    fontSize: 16,
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
  bookingButtonContainer: {
    marginBottom: SPACING.MD,
    paddingHorizontal: SPACING.SM,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.XS,
    marginBottom: SPACING.MD,
  },
  tabButton: {
    flex: 1,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  activeTabButtonText: {
    color: COLORS.BACKGROUND,
  },
  tabCount: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.TEXT_MUTED,
  },
  activeTabCount: {
    color: COLORS.BACKGROUND,
  },
  tabContent: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
  },
});
