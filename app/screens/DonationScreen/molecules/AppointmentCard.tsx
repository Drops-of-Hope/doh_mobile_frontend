import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

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
  onViewDetails?: (appointment: AppointmentItem) => void;
}

export default function AppointmentCard({ appointment, onViewDetails }: AppointmentCardProps) {
  const getBorderColor = () => {
    switch (appointment.status) {
      case "upcoming":
        return COLORS.INFO;
      case "completed":
        return COLORS.SUCCESS;
      case "cancelled":
        return COLORS.ERROR;
      default:
        return COLORS.INFO;
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
          {onViewDetails && appointment.status === "upcoming" && (
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => onViewDetails(appointment)}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={COLORS.PRIMARY}
              />
              <Text style={styles.detailsText}>Details</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.hospital}>{appointment.hospital}</Text>
          <Text style={styles.location}>{appointment.location}</Text>
          <Text style={[styles.dateTime, { color: getBorderColor() }]}>
            {appointment.date} at {appointment.time}
          </Text>
        </View>
        {!(onViewDetails && appointment.status === "upcoming") && (
          <View style={styles.statusBadgeContainer}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: getBorderColor(),
                },
              ]}
            >
              <Text style={styles.statusText}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.MD,
    marginBottom: SPACING.SM,
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
    color: COLORS.TEXT_PRIMARY,
    fontSize: 16,
    marginBottom: 4,
  },
  location: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    marginBottom: 4,
  },
  dateTime: {
    fontWeight: "600",
    fontSize: 14,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.BACKGROUND,
    paddingVertical: SPACING.XS,
    paddingHorizontal: SPACING.SM,
    borderRadius: BORDER_RADIUS.SM,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    gap: 4,
    alignSelf: "flex-start",
    marginBottom: SPACING.XS,
  },
  detailsText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
  statusBadgeContainer: {
    alignSelf: "flex-start",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: BORDER_RADIUS.SM,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.BACKGROUND,
  },
});
