import React from "react";
import { View, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Text, Icon } from "../../../design";

interface BadgeChipProps {
  icon: LucideIcon;
  label: string;
  color: string;
  size?: "small" | "medium";
}

const BadgeChip: React.FC<BadgeChipProps> = ({ icon, label, color, size = "medium" }) => {
  const isSmall = size === "small";

  return (
    <View style={[styles.container, { backgroundColor: `${color}1A` }, isSmall && styles.containerSmall]}>
      <Icon icon={icon} size={isSmall ? 12 : 14} color={color} />
      <Text variant={isSmall ? "caption" : "label"} style={{ color }} numberOfLines={1}>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
});

export default BadgeChip;
