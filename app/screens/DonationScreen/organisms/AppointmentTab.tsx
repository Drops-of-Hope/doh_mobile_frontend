import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NoticeCard from "../atoms/NoticeCard";
import AppointmentCard, {
  AppointmentItem,
} from "../molecules/AppointmentCard";
import { useLanguage } from "../../../context/LanguageContext";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface AppointmentTabProps {
  appointments: AppointmentItem[];
  onBookAppointment: () => void;
}

export default function AppointmentTab({
  appointments,
  onBookAppointment,
}: AppointmentTabProps) {
  const { t } = useLanguage();
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentItem | null>(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "upcoming",
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status === "completed",
  );

  const handleViewDetails = (appointment: AppointmentItem) => {
    setSelectedAppointment(appointment);
    setDetailsModalVisible(true);
  };

  const handleCancelAppointment = () => {
    Alert.alert(
      "Cancel Appointment",
      "Are you sure you want to cancel this appointment?",
      [
        { text: "No", style: "cancel" },
        { 
          text: "Yes, Cancel", 
          style: "destructive",
          onPress: () => {
            // TODO: Implement cancel appointment API call
            setDetailsModalVisible(false);
            Alert.alert("Appointment Cancelled", "Your appointment has been cancelled successfully.");
          }
        },
      ]
    );
  };

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
                  <Ionicons name="calendar" size={20} color={COLORS.INFO} />
                  <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
                </View>
                {upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </View>
            )}

            {completedAppointments.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="clipboard" size={20} color={COLORS.SUCCESS} />
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

      {/* Appointment Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appointment Details</Text>
              <TouchableOpacity onPress={() => setDetailsModalVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.TEXT_SECONDARY} />
              </TouchableOpacity>
            </View>
            
            {selectedAppointment && (
              <ScrollView style={styles.modalContent}>
                <View style={styles.detailRow}>
                  <Ionicons name="business-outline" size={20} color={COLORS.PRIMARY} />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Hospital</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.hospital}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={20} color={COLORS.PRIMARY} />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.location}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.PRIMARY} />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.date}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={20} color={COLORS.PRIMARY} />
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailValue}>{selectedAppointment.time}</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={handleCancelAppointment}
                >
                  <Ionicons name="close-circle-outline" size={20} color={COLORS.BACKGROUND} />
                  <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "white",
    margin: SPACING.MD,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.MD,
    textAlign: "center",
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.LG,
    textAlign: "center",
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: COLORS.PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.LG,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: SPACING.SM,
  },
  appointmentsSection: {
    marginTop: SPACING.LG,
  },
  section: {
    marginBottom: SPACING.MD,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.SM,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    marginLeft: SPACING.SM,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.BACKGROUND,
    borderRadius: BORDER_RADIUS.LG,
    width: "90%",
    maxHeight: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
  },
  modalContent: {
    paddingHorizontal: SPACING.LG,
    paddingVertical: SPACING.MD,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: SPACING.MD,
    paddingBottom: SPACING.MD,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER_LIGHT,
  },
  detailTextContainer: {
    flex: 1,
    marginLeft: SPACING.SM,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.TEXT_PRIMARY,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.ERROR,
    paddingVertical: SPACING.SM + 2,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.MD,
    marginTop: SPACING.MD,
    gap: SPACING.XS,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BACKGROUND,
  },
});
