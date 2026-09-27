import React from "react";
import { View, StyleSheet } from "react-native";
import { Surface, SectionHeader, Badge, ProgressTrack, Text, useTheme, BadgeTier } from "../../../design";
import { EMERGENCY_RESPONDER_BADGE_DISPLAY } from "../../../../constants/badgeDisplay";
import BadgeChip from "../../shared/atoms/BadgeChip";

export interface BadgeProgressInfo {
  progress: number; // 0..1
  nextTierLabel: string | null;
  donationsNeeded: number;
}

interface AchievementsSectionProps {
  tier: BadgeTier;
  tierLabel: string;
  progress: BadgeProgressInfo | null;
  showEmergencyBadge: boolean;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({
  tier,
  tierLabel,
  progress,
  showEmergencyBadge,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <SectionHeader title="Achievements" />
      <Surface>
        <View style={styles.row}>
          <Badge tier={tier} label={tierLabel} />
          {showEmergencyBadge ? (
            <BadgeChip
              icon={EMERGENCY_RESPONDER_BADGE_DISPLAY.icon}
              label={EMERGENCY_RESPONDER_BADGE_DISPLAY.label}
              color={EMERGENCY_RESPONDER_BADGE_DISPLAY.color}
              size="small"
            />
          ) : null}
        </View>

        {progress ? (
          <View style={styles.progressWrap}>
            <ProgressTrack progress={progress.progress} color={theme.color.crimson} />
            <Text variant="caption" tone="inkMuted" style={styles.progressLabel}>
              {progress.nextTierLabel
                ? `${progress.donationsNeeded} more donation${progress.donationsNeeded === 1 ? "" : "s"} to ${progress.nextTierLabel}`
                : "Highest tier reached"}
            </Text>
          </View>
        ) : null}
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  progressWrap: {
    marginTop: 14,
  },
  progressLabel: {
    marginTop: 8,
  },
});

export default AchievementsSection;
