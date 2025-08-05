import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Campaign } from "../types";
import { formatCampaignDate, getUrgencyColor } from "../utils";

interface CampaignModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onJoin: (campaign: Campaign) => void;
}

export default function CampaignModal({
  visible,
  campaign,
  onClose,
  onJoin,
}: CampaignModalProps) {
  if (!campaign) return null;

  const handleJoin = () => {
    onJoin(campaign);
    onClose();
  };

  const availableSlots = campaign.totalSlots - campaign.slotsUsed;
  const progressPercentage = (campaign.slotsUsed / campaign.totalSlots) * 100;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Campaign Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.campaignDetails}>
            {/* Urgency Badge */}
            <View
              style={[
                styles.urgencyBadge,
                { backgroundColor: getUrgencyColor(campaign.urgency) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.urgencyText,
                  { color: getUrgencyColor(campaign.urgency) },
                ]}
              >
                {campaign.urgency} Priority
              </Text>
            </View>

            {/* Campaign Title */}
            <Text style={styles.campaignTitle}>{campaign.title}</Text>

            {/* Campaign Details */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>
                {formatCampaignDate(campaign.date)}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{campaign.location}</Text>
            </View>

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Available Slots:</Text>
              <Text style={styles.detailValue}>
                {availableSlots} of {campaign.totalSlots}
              </Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressLabel}>Registration Progress</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progressPercentage}%`,
                      backgroundColor: getUrgencyColor(campaign.urgency),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {campaign.slotsUsed} / {campaign.totalSlots} registered
              </Text>
            </View>

            {/* Additional Information */}
            <View style={styles.infoSection}>
              <Text style={styles.infoTitle}>Campaign Information</Text>
              <Text style={styles.infoText}>
                This blood donation campaign is organized to help maintain
                adequate blood supply at medical facilities. Your participation
                will make a significant difference in saving lives.
              </Text>
              <Text style={styles.infoText}>
                Please arrive 15 minutes before your scheduled time and bring a
                valid ID.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <TouchableOpacity
            style={[
              styles.joinButton,
              availableSlots === 0 && styles.disabledButton,
            ]}
            onPress={handleJoin}
            disabled={availableSlots === 0}
          >
            <Ionicons name="heart" size={20} color="#FFFFFF" />
            <Text style={styles.joinButtonText}>
              {availableSlots === 0 ? "Campaign Full" : "Join Campaign"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  campaignDetails: {
    flex: 1,
  },
  urgencyBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  campaignTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  progressContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  infoSection: {
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  modalActions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
  },
  joinButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
