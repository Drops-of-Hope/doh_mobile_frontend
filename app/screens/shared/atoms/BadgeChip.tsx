import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface BadgeChipProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  size?: "small" | "medium";
}

const BadgeChip: React.FC<BadgeChipProps> = ({ icon, label, color, size = "medium" }) => {
  const isSmall = size === "small";

  return (
    <View style={[styles.container, { backgroundColor: `${color}1A` }, isSmall && styles.containerSmall]}>
      <Ionicons name={icon} size={isSmall ? 12 : 14} color={color} />
      <Text style={[styles.label, { color }, isSmall && styles.labelSmall]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.SM,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.FULL,
    gap: 4,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
  },
  labelSmall: {
    fontSize: 11,
  },
});

export default BadgeChip;
