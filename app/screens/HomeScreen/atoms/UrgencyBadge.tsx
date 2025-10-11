import React from "react";
import { View, Text, StyleSheet } from "react-native";

export type UrgencyLevel = "Critical" | "Moderate" | "Low";

interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
}

export default function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const getUrgencyColors = (level: UrgencyLevel) => {
    switch (level) {
      case "Critical":
        return { text: "#FF4757", bg: "#FFF5F5" };
      case "Moderate":
        return { text: "#DC2626", bg: "#FEF2F2" };
      case "Low":
        return { text: "#00D2D3", bg: "#F0FDFA" };
      default:
        return { text: "#DC2626", bg: "#FEF2F2" };
    }
  };

  const urgencyColors = getUrgencyColors(urgency);

  return (
    <View style={[styles.urgencyBadge, { backgroundColor: urgencyColors.bg }]}>
      <Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
        {urgency}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: "700",
  },
});
