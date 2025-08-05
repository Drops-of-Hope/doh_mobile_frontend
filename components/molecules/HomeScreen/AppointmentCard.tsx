import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ActionButton from "../../atoms/HomeScreen/ActionButton";

export interface Appointment {
  id: string;
  date: string;
  time: string;
  location: string;
  hospital: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface AppointmentCardProps {
  appointment: Appointment;
  title?: string;
  onViewDetails?: (appointment: Appointment) => void;
  onReschedule?: (appointment: Appointment) => void;
}

export default function AppointmentCard({
  appointment,
  title = "Blood Donation",
  onViewDetails,
  onReschedule,
}: AppointmentCardProps) {
  return (
    <View style={styles.appointmentCard}>
      <View style={styles.appointmentHeader}>
        <View style={styles.appointmentIcon}>
          <Ionicons name="heart" size={20} color="white" />
        </View>
        <View style={styles.appointmentContent}>
          <Text style={styles.appointmentTitle}>{title}</Text>
          <Text style={styles.appointmentDateTime}>
            {appointment.date} at {appointment.time}
          </Text>
          <Text style={styles.appointmentLocation}>{appointment.hospital}</Text>
          <Text style={styles.confirmedText}>
            {appointment.status === "upcoming"
              ? "Confirmed"
              : appointment.status}
          </Text>
        </View>
      </View>

      <View style={styles.appointmentButtons}>
        <ActionButton
          title="View Details"
          onPress={() => onViewDetails?.(appointment)}
          variant="primary"
          style={{ flex: 1 }}
        />
        {appointment.status === "upcoming" && onReschedule && (
          <ActionButton
            title="Reschedule"
            onPress={() => onReschedule(appointment)}
            variant="secondary"
            style={{ flex: 1, marginLeft: 12 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  appointmentIcon: {
    backgroundColor: "#FF4757",
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  appointmentLocation: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  confirmedText: {
    color: "#00D2D3",
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  appointmentButtons: {
    flexDirection: "row",
    gap: 12,
  },
});
