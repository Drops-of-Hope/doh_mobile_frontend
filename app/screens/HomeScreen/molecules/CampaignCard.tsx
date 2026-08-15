import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { MapPin, Info, Plus } from "lucide-react-native";
import { Surface, Text, Icon, Button, ProgressTrack, useTheme } from "../../../design";
import UrgencyBadge, { UrgencyLevel } from "../atoms/UrgencyBadge";

export interface Campaign {
  id: number;
  title: string;
  date: string;
  location: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
}

interface CampaignCardProps {
  campaign: Campaign;
  onPress?: (campaign: Campaign) => void;
  showActions?: boolean;
  onDetails?: (campaign: Campaign) => void;
  onJoin?: (campaign: Campaign) => void;
}

export default function CampaignCard({
  campaign,
  onPress,
  showActions = false,
  onDetails,
  onJoin,
}: CampaignCardProps) {
  const theme = useTheme();
  const progressColor =
    campaign.urgency === "Critical"
      ? theme.color.crimson
      : campaign.urgency === "Moderate"
      ? theme.color.warning
      : theme.color.info;

  const Wrapper = onPress ? Pressable : View;

  return (
    <Wrapper onPress={onPress ? () => onPress(campaign) : undefined}>
    <Surface>
      <View style={styles.header}>
        <UrgencyBadge urgency={campaign.urgency} />
        <Text variant="caption" tone="inkMuted">
          {campaign.date}
        </Text>
      </View>

      <Text variant="h3" style={styles.title}>
        {campaign.title}
      </Text>

      <View style={styles.locationRow}>
        <Icon icon={MapPin} size={16} color={theme.color.inkMuted} />
        <Text variant="body" tone="inkMuted" style={styles.locationText}>
          {campaign.location}
        </Text>
      </View>

      <Text variant="caption" tone="inkMuted" style={styles.slotsText}>
        {campaign.slotsUsed}/{campaign.totalSlots} slots filled
      </Text>

      <ProgressTrack
        progress={campaign.totalSlots > 0 ? campaign.slotsUsed / campaign.totalSlots : 0}
        color={progressColor}
      />

      {showActions && (
        <View style={styles.actions}>
          <View style={styles.actionFlex1}>
            <Button
              title="Details"
              variant="outline"
              size="sm"
              icon={<Icon icon={Info} size={16} color={theme.color.crimson} />}
              onPress={() => onDetails?.(campaign)}
            />
          </View>
          <View style={styles.actionFlex1}>
            <Button
              title="Join"
              variant="solid"
              size="sm"
              icon={<Icon icon={Plus} size={16} color={theme.color.inverse} />}
              onPress={() => onJoin?.(campaign)}
            />
          </View>
        </View>
      )}
    </Surface>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title: { marginBottom: 8 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  locationText: { flex: 1 },
  slotsText: { marginBottom: 8 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  actionFlex1: { flex: 1 },
});
