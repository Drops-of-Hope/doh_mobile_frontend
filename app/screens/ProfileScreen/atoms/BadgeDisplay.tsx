import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserData } from "../types";
import { getBadgeColor, getBadgeIcon } from "../utils";

interface BadgeDisplayProps {
  badge: UserData["donationBadge"];
  membershipType: string;
}

export default function BadgeDisplay({
  badge,
  membershipType,
}: BadgeDisplayProps) {
  const badgeColor = getBadgeColor(badge);
  const badgeIcon = getBadgeIcon(badge);

  return (
    <View style={styles.badgeContainer}>
      <View style={[styles.badge, { backgroundColor: badgeColor + "20" }]}>
        <Ionicons name={badgeIcon as any} size={16} color={badgeColor} />
        <Text style={[styles.badgeText, { color: badgeColor }]}>{badge}</Text>
      </View>
      <Text style={styles.membershipText}>{membershipType}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  membershipText: {
    fontSize: 14,
    color: "#DC2626", // Red accent color
    fontWeight: "500",
    backgroundColor: "#FEF2F2", // Light red background
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
