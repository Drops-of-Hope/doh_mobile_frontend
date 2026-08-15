import React from "react";
import { View, StyleSheet } from "react-native";
import { Heart } from "lucide-react-native";
import { Sheet, Text, Button, ProgressTrack, Icon, useTheme } from "../../../design";
import UrgencyBadge from "../../HomeScreen/atoms/UrgencyBadge";
import { Campaign } from "../types";
import { formatCampaignDate } from "../utils";

interface CampaignModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onJoin: (campaign: Campaign) => void;
}

export default function CampaignModal({ visible, campaign, onClose, onJoin }: CampaignModalProps) {
  const theme = useTheme();
  if (!campaign) return null;

  const handleJoin = () => {
    onJoin(campaign);
    onClose();
  };

  const availableSlots = campaign.totalSlots - campaign.slotsUsed;
  const progress = campaign.totalSlots > 0 ? campaign.slotsUsed / campaign.totalSlots : 0;
  const progressColor =
    campaign.urgency === "Critical"
      ? theme.color.crimson
      : campaign.urgency === "Moderate"
      ? theme.color.warning
      : theme.color.info;

  return (
    <Sheet visible={visible} onClose={onClose} title="Campaign Details">
      <UrgencyBadge urgency={campaign.urgency} />

      <Text variant="h1" style={styles.title}>
        {campaign.title}
      </Text>

      <View style={[styles.detailItem, { borderBottomColor: theme.color.hairline }]}>
        <Text variant="body" tone="inkMuted">
          Date
        </Text>
        <Text variant="bodyBold">{formatCampaignDate(campaign.date)}</Text>
      </View>
      <View style={[styles.detailItem, { borderBottomColor: theme.color.hairline }]}>
        <Text variant="body" tone="inkMuted">
          Location
        </Text>
        <Text variant="bodyBold">{campaign.location}</Text>
      </View>
      <View style={[styles.detailItem, { borderBottomColor: theme.color.hairline }]}>
        <Text variant="body" tone="inkMuted">
          Available Slots
        </Text>
        <Text variant="bodyBold">
          {availableSlots} of {campaign.totalSlots}
        </Text>
      </View>

      <View style={styles.progressSection}>
        <Text variant="label" tone="inkMuted" style={styles.progressLabel}>
          Registration Progress
        </Text>
        <ProgressTrack progress={progress} color={progressColor} />
        <Text variant="caption" tone="inkMuted" align="center" style={styles.progressText}>
          {campaign.slotsUsed} / {campaign.totalSlots} registered
        </Text>
      </View>

      <View style={styles.infoSection}>
        <Text variant="h3" style={styles.infoTitle}>
          Campaign Information
        </Text>
        <Text variant="body" tone="inkMuted" style={styles.infoText}>
          This blood donation campaign is organized to help maintain adequate blood supply at medical
          facilities. Your participation will make a significant difference in saving lives.
        </Text>
        <Text variant="body" tone="inkMuted">
          Please arrive 15 minutes before your scheduled time and bring a valid ID.
        </Text>
      </View>

      <Button
        title={availableSlots === 0 ? "Campaign Full" : "Join Campaign"}
        onPress={handleJoin}
        disabled={availableSlots === 0}
        icon={<Icon icon={Heart} size={18} color={theme.color.inverse} />}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: { marginTop: 16, marginBottom: 12 },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  progressSection: { marginTop: 20, marginBottom: 20 },
  progressLabel: { marginBottom: 8 },
  progressText: { marginTop: 8 },
  infoSection: { marginBottom: 24 },
  infoTitle: { marginBottom: 10 },
  infoText: { marginBottom: 8, lineHeight: 20 },
});
