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

const formatDisplayText = (text: string | undefined, fallback: string): string => {
  if (!text || text.trim() === '') return fallback;
  return text;
};

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

  // Get properly formatted display values
  const displayHospital = formatDisplayText(appointment.hospital, "Unknown Hospital");
  const displayLocation = formatDisplayText(appointment.location, "Location TBD");

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
          {/* Hospital Name */}
          <Text style={styles.hospital}>{displayHospital}</Text>
          
          {/* Location */}
          <View style={styles.locationRow}>
            <Ionicons 
              name="location-outline" 
              size={14} 
              color={COLORS.TEXT_SECONDARY} 
              style={styles.locationIcon}
            />
            <Text style={styles.location}>{displayLocation}</Text>
          </View>
          
          {/* Date and Time */}
          <View style={styles.dateTimeRow}>
            <Ionicons 
              name="calendar-outline" 
              size={14} 
              color={getBorderColor()} 
              style={styles.dateTimeIcon}
            />
            <Text style={[styles.dateTime, { color: getBorderColor() }]}>
              {appointment.date} at {appointment.time}
            </Text>
          </View>
        </View>
        
        {/* View Details Button - Right side for upcoming appointments */}
        {onViewDetails && appointment.status === "upcoming" && (
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => onViewDetails(appointment)}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={COLORS.PRIMARY}
            />
            <Text style={styles.detailsText}>Details</Text>
          </TouchableOpacity>
        )}
        
        {/* Status Badge - Show for completed and cancelled appointments */}
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
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  locationIcon: {
    marginRight: 4,
  },
  location: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 14,
    flex: 1,
  },
  dateTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  dateTimeIcon: {
    marginRight: 4,
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
    marginLeft: SPACING.SM,
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
