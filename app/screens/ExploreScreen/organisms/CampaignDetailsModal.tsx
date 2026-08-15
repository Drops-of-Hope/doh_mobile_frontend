import React from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Calendar, Clock, MapPin, Users } from "lucide-react-native";
import { Sheet, Surface, Text, Icon, Button, ProgressTrack, useTheme } from "../../../design";
import { Campaign } from "../types";

interface CampaignDetailsModalProps {
  visible: boolean;
  campaign: Campaign | null;
  onClose: () => void;
  onJoin: (campaign: Campaign) => void;
  isLiveCampaign?: boolean; // Track if this is a live campaign
}

export default function CampaignDetailsModal({
  visible,
  campaign,
  onClose,
  onJoin,
  isLiveCampaign = false,
}: CampaignDetailsModalProps) {
  const theme = useTheme();

  const handleJoinPress = () => {
    if (!campaign) return;

    const action = campaign.isRegistered ? "Unregister from" : "Join";
    const confirmText = campaign.isRegistered ? "Unregister" : "Join";

    Alert.alert(
      `${action} Campaign`,
      `Are you sure you want to ${action.toLowerCase()} "${campaign.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: confirmText,
          style: campaign.isRegistered ? "destructive" : "default",
          onPress: () => onJoin(campaign),
        },
      ]
    );
  };

  const hasGoal = !!campaign?.expectedDonors && campaign.expectedDonors > 0;
  const progress =
    hasGoal && campaign ? campaign.participants / (campaign.expectedDonors as number) : undefined;

  return (
    <Sheet visible={visible} onClose={onClose} title="Campaign Details">
      {campaign ? (
        <View>
          <Text variant="h2" style={styles.title}>
            {campaign.title}
          </Text>

          {campaign.description ? (
            <Text variant="body" tone="inkMuted" style={styles.description}>
              {campaign.description}
            </Text>
          ) : null}

          <Surface tone="sunken" style={styles.infoSurface}>
            {campaign.location ? (
              <View style={styles.infoRow}>
                <Icon icon={MapPin} size={18} color={theme.color.inkMuted} />
                <View style={styles.infoTextWrap}>
                  <Text variant="caption" tone="inkMuted">
                    Location
                  </Text>
                  <Text variant="bodyBold">{campaign.location}</Text>
                </View>
              </View>
            ) : null}
            {campaign.date ? (
              <View style={styles.infoRow}>
                <Icon icon={Calendar} size={18} color={theme.color.inkMuted} />
                <View style={styles.infoTextWrap}>
                  <Text variant="caption" tone="inkMuted">
                    Date
                  </Text>
                  <Text variant="bodyBold">{campaign.date}</Text>
                </View>
              </View>
            ) : null}
            {campaign.time ? (
              <View style={styles.infoRow}>
                <Icon icon={Clock} size={18} color={theme.color.inkMuted} />
                <View style={styles.infoTextWrap}>
                  <Text variant="caption" tone="inkMuted">
                    Time
                  </Text>
                  <Text variant="bodyBold">{campaign.time}</Text>
                </View>
              </View>
            ) : null}
            <View style={[styles.infoRow, styles.infoRowLast]}>
              <Icon icon={Users} size={18} color={theme.color.inkMuted} />
              <View style={styles.infoTextWrap}>
                <Text variant="caption" tone="inkMuted">
                  Participants
                </Text>
                <Text variant="bodyBold">{campaign.participants} people have joined</Text>
              </View>
            </View>
          </Surface>

          {progress !== undefined ? (
            <View style={styles.progressWrap}>
              <ProgressTrack progress={progress} />
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.buttonRow}>
        <View style={styles.buttonHalf}>
          <Button title="Close" variant="outline" onPress={onClose} />
        </View>
        {!isLiveCampaign ? (
          <View style={styles.buttonHalf}>
            <Button
              title={campaign?.isRegistered ? "Unregister" : "Join Campaign"}
              variant={campaign?.isRegistered ? "danger" : "solid"}
              onPress={handleJoinPress}
            />
          </View>
        ) : null}
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  infoSurface: {
    gap: 0,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  infoRowLast: {
    marginBottom: 0,
  },
  infoTextWrap: {
    flex: 1,
  },
  progressWrap: {
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  buttonHalf: {
    flex: 1,
  },
});
