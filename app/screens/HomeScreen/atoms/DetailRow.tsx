import React from "react";
import { View, StyleSheet } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Text, Icon, useTheme } from "../../../design";

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  isStatus?: boolean;
}

export default function DetailRow({ icon, label, value, isStatus = false }: DetailRowProps) {
  const theme = useTheme();
  return (
    <View style={styles.row}>
      <Icon icon={icon} size={20} color={theme.color.inkMuted} />
      <View style={styles.text}>
        <Text variant="caption" tone="inkMuted">
          {label}
        </Text>
        <Text variant={isStatus ? "overline" : "body"} tone={isStatus ? "crimson" : "ink"}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16, gap: 12 },
  text: { flex: 1 },
});
