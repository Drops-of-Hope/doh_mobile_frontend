import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "../../../design";

interface ActionBadgeProps {
  text?: string;
}

export default function ActionBadge({ text = "Action Required" }: ActionBadgeProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.actionBadge,
        { backgroundColor: theme.color.warningSoft, borderColor: theme.color.warning, borderRadius: theme.radius.md },
      ]}
    >
      <Text variant="caption" tone="warning" style={styles.actionBadgeText}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBadge: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5 },
  actionBadgeText: { fontWeight: "700" },
});
