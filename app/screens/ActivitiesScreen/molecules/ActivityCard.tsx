import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatusBadge from "../atoms/StatusBadge";
import InfoRow from "../atoms/InfoRow";
import DetailRow from "../atoms/DetailRow";

export interface DonationActivity {
  id: string;
  campaignTitle: string;
  campaignLocation: string;
  donationDate: string;
  type: "donation" | "checkup";
  status: "completed";
  details?: {
    bloodType?: string;
    volume?: number;
    notes?: string;
    hemoglobin?: number;
    bloodPressure?: string;
    weight?: number;
  };
}

interface ActivityCardProps {
  activity: DonationActivity;
  onViewDetails: (activity: DonationActivity) => void;
}

export default function ActivityCard({
  activity,
  onViewDetails,
}: ActivityCardProps) {
  return (
    <View style={styles.activityCard}>
      <View style={styles.activityHeader}>
        <StatusBadge type={activity.type} />
        <Text style={styles.completedText}>Completed</Text>
      </View>

      <Text style={styles.campaignTitle}>{activity.campaignTitle}</Text>

      <InfoRow icon="location-outline" text={activity.campaignLocation} />

      <InfoRow icon="calendar-outline" text={activity.donationDate} />

      {activity.details && (
        <View style={styles.detailsContainer}>
          {activity.details.bloodType != null && activity.details.bloodType !== '' && (
            <DetailRow
              icon="water"
              text={`Blood Type: ${activity.details.bloodType}`}
              iconColor="#FF4757"
            />
          )}
          {activity.details.volume != null && (
            <DetailRow
              icon="beaker-outline"
              text={`Volume: ${activity.details.volume}ml`}
              iconColor="#3B82F6"
            />
          )}
          {activity.details.hemoglobin != null && (
            <DetailRow
              icon="pulse"
              text={`Hemoglobin: ${activity.details.hemoglobin} g/dL`}
              iconColor="#00D2D3"
            />
          )}
          {activity.details.bloodPressure != null && activity.details.bloodPressure !== '' && (
            <DetailRow
              icon="heart-outline"
              text={`BP: ${activity.details.bloodPressure} mmHg`}
              iconColor="#5F27CD"
            />
          )}
        </View>
      )}

      <TouchableOpacity
        style={styles.detailsButton}
        onPress={() => onViewDetails(activity)}
      >
        <Text style={styles.detailsButtonText}>View Details</Text>
        <Ionicons name="chevron-forward" size={16} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  completedText: {
    fontSize: 12,
    color: "#00D2D3",
    fontWeight: "700",
    backgroundColor: "#F0FDFA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  detailsContainer: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
  },
});
