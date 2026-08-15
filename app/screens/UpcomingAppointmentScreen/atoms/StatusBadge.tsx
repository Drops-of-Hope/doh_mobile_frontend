import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon, useTheme } from "../../../design";
import { StatusBadgeProps } from "../types";
import { getStatusIcon, getStatusTone } from "../utils";

export default function StatusBadge({ status }: StatusBadgeProps) {
  const theme = useTheme();
  const tone = getStatusTone(status);
  const color = tone === "ink" ? theme.color.inkMuted : theme.color[tone];
  const softColor = tone === "ink" ? theme.color.surfaceSunken : theme.color[`${tone}Soft`];
  const IconComp = getStatusIcon(status);

  return (
    <View style={[styles.statusBadge, { backgroundColor: softColor, borderRadius: theme.radius.pill }]}>
      <Icon icon={IconComp} size={14} color={color} />
      <Text variant="caption" style={{ color, fontWeight: "700" }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 4,
  },
});
