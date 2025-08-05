import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StatusBadge from "../../atoms/DonationScreen/StatusBadge";

export interface AppointmentItem {
  id: string;
  date: string;
  time: string;
  location: string;
  hospital: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface AppointmentCardProps {
  appointment: AppointmentItem;
}

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const getBorderColor = () => {
    switch (appointment.status) {
      case "upcoming":
        return "#3B82F6";
      case "completed":
        return "#10B981";
      case "cancelled":
        return "#EF4444";
      default:
        return "#3B82F6";
    }
  };

  const getBackgroundColor = () => {
    switch (appointment.status) {
      case "upcoming":
        return "#EBF8FF";
      case "completed":
        return "#F0FDF4";
      case "cancelled":
        return "#FEF2F2";
      default:
        return "#EBF8FF";
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderLeftColor: getBorderColor(),
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.hospital}>{appointment.hospital}</Text>
          <Text style={styles.location}>{appointment.location}</Text>
          <Text style={[styles.dateTime, { color: getBorderColor() }]}>
            {appointment.date} at {appointment.time}
          </Text>
        </View>
        <StatusBadge status={appointment.status} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  info: {
    flex: 1,
  },
  hospital: {
    fontWeight: "700",
    color: "#1F2937",
    fontSize: 16,
    marginBottom: 4,
  },
  location: {
    color: "#6B7280",
    fontSize: 14,
    marginBottom: 4,
  },
  dateTime: {
    fontWeight: "600",
    fontSize: 14,
  },
});
