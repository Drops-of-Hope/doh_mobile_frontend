import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "../../../design";

export type UrgencyLevel = "Critical" | "Moderate" | "Low";

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
}

// Maps urgency to the Ink & Paper semantic tones — crimson for Critical
// (must read as unmissable), warning for Moderate, info for Low.
export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const theme = useTheme();

  const tone =
    urgency === "Critical"
      ? { bg: theme.color.crimsonSoft, border: theme.color.crimson, text: "crimson" as const }
      : urgency === "Moderate"
      ? { bg: theme.color.warningSoft, border: theme.color.warning, text: "warning" as const }
      : { bg: theme.color.infoSoft, border: theme.color.info, text: "info" as const };

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: tone.bg, borderColor: tone.border, borderRadius: theme.radius.pill },
      ]}
    >
      <Text variant="overline" tone={tone.text}>
        {urgency.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
  },
});
