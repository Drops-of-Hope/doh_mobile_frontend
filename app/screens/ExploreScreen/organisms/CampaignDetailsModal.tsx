import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Campaign } from "../types";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface CampaignDetailsModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onJoin: (campaign: Campaign) => void;
}

export default function CampaignDetailsModal({
  visible,
  campaign,
  onClose,
  onJoin,
}: CampaignDetailsModalProps) {
  const handleJoinPress = () => {
    if (!campaign) return;

    Alert.alert(
      "Join Campaign",
      `Are you sure you want to join "${campaign.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Join",
          onPress: () => onJoin(campaign),
        },
      ],
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Campaign Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {campaign && (
              <View>
                <Text style={styles.campaignTitle}>{campaign.title}</Text>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Description</Text>
                  <Text style={styles.detailText}>{campaign.description}</Text>
                </View>

                {campaign.location && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailText}>{campaign.location}</Text>
                  </View>
                )}

                {campaign.date && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailText}>{campaign.date}</Text>
                  </View>
                )}

                {campaign.time && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailText}>{campaign.time}</Text>
                  </View>
                )}

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Participants</Text>
                  <Text style={styles.detailText}>
                    {campaign.participants} people have joined
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.closeActionButton}
              onPress={onClose}
            >
              <Text style={styles.closeActionText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={handleJoinPress}
            >
              <Text style={styles.joinButtonText}>Join Campaign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxHeight: 400,
  },
  campaignTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  closeActionButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  closeActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  joinButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: "center",
    backgroundColor: COLORS.PRIMARY,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.BACKGROUND,
  },
});
