import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NoticeCard from "../../atoms/DonationScreen/NoticeCard";
import AppointmentCard, {
  AppointmentItem,
} from "../../molecules/DonationScreen/AppointmentCard";
import { useLanguage } from "../../../app/context/LanguageContext";

interface AppointmentTabProps {
  appointments: AppointmentItem[];
  onBookAppointment: () => void;
}

export default function AppointmentTab({
  appointments,
  onBookAppointment,
}: AppointmentTabProps) {
  const { t } = useLanguage();
  
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming",
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{t("donation.appointment_tab_title")}</Text>
        <Text style={styles.subtitle}>
          {t("donation.appointment_tab_description")}
        </Text>

        <NoticeCard
          title="Important Notice"
          message="This appointment is purely for blood donation purposes and not for health checkups, medical consultations, or any other medical activities."
          type="warning"
        />

        <TouchableOpacity style={styles.bookButton} onPress={onBookAppointment}>
          <Ionicons name="calendar" size={24} color="white" />
          <Text style={styles.buttonText}>{t("donation.book_appointment")}</Text>
        </TouchableOpacity>

        {appointments.length > 0 && (
          <View style={styles.appointmentsSection}>
            {upcomingAppointments.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="calendar" size={20} color="#3B82F6" />
                  <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                </View>
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
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="clipboard" size={20} color="#10B981" />
                  <Text style={styles.sectionTitle}>Donation History</Text>
                </View>
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
    backgroundColor: "white",
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  appointmentsSection: {
    marginTop: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginLeft: 8,
  },
});
