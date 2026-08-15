import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { Calendar, MapPin, Users } from "lucide-react-native";
import { Surface, Text, Icon, ProgressTrack, useTheme } from "../../../design";

interface CampaignCardProps {
  title: string;
  description: string;
  participants: number;
  expectedDonors?: number;
  location?: string;
  date?: string;
  time?: string;
  isRegistered?: boolean;
  onPress: () => void;
}

export default function CampaignCard({
  title,
  description,
  participants,
  expectedDonors,
  location,
  date,
  time,
  isRegistered,
  onPress,
}: CampaignCardProps) {
  const theme = useTheme();
  const hasGoal = typeof expectedDonors === "number" && expectedDonors > 0;
  const progress = hasGoal ? participants / (expectedDonors as number) : undefined;
  const spotsRemaining = hasGoal ? Math.max((expectedDonors as number) - participants, 0) : undefined;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
      <Surface style={styles.card}>
        <View style={styles.headerRow}>
          <Text variant="h3" style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          {isRegistered ? (
            <View style={[styles.badge, { backgroundColor: theme.color.successSoft }]}>
              <Text variant="caption" tone="success">
                Joined
              </Text>
            </View>
          ) : null}
        </View>

        {description ? (
          <Text variant="body" tone="inkMuted" numberOfLines={2} style={styles.description}>
            {description}
          </Text>
        ) : null}

        <View style={styles.detailRows}>
          {date ? (
            <View style={styles.detailRow}>
              <Icon icon={Calendar} size={16} color={theme.color.inkMuted} />
              <Text variant="label" tone="inkMuted">
                {date}
                {time ? ` · ${time}` : ""}
              </Text>
            </View>
          ) : null}
          {location ? (
            <View style={styles.detailRow}>
              <Icon icon={MapPin} size={16} color={theme.color.inkMuted} />
              <Text variant="label" tone="inkMuted" numberOfLines={1} style={styles.flexText}>
                {location}
              </Text>
            </View>
          ) : null}
          <View style={styles.detailRow}>
            <Icon icon={Users} size={16} color={theme.color.inkMuted} />
            <Text variant="label" tone="inkMuted">
              {spotsRemaining !== undefined
                ? `${spotsRemaining} spot${spotsRemaining === 1 ? "" : "s"} remaining`
                : `${participants} joined`}
            </Text>
          </View>
        </View>

        {progress !== undefined ? (
          <View style={styles.progressWrap}>
            <ProgressTrack progress={progress} />
          </View>
        ) : null}
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    flex: 1,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  description: {
    marginTop: 4,
  },
  detailRows: {
    marginTop: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  flexText: {
    flex: 1,
  },
  progressWrap: {
    marginTop: 12,
  },
});
