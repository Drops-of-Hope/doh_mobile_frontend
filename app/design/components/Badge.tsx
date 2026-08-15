import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { TierMedal } from "../icons/brand";
import { BadgeTier } from "../tokens";

interface BadgeProps {
  tier: BadgeTier;
  label: string;
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({ tier, label, size = "md" }) => {
  const theme = useTheme();
  const color = theme.color.badge[tier];
  const iconSize = size === "sm" ? 13 : 15;
  return (
    <View
      style={[
        styles.wrap,
        { borderColor: color, borderRadius: theme.radius.pill, paddingVertical: size === "sm" ? 4 : 6 },
      ]}
    >
      <TierMedal size={iconSize} color={color} strokeWidth={1.75} />
      <Text variant={size === "sm" ? "caption" : "label"} style={{ color }}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
  },
});

export default Badge;
