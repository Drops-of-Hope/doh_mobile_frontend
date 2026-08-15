import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Icon, useTheme } from "../../../design";
import { SectionHeaderProps } from "../types";

export default function SectionHeader({ icon, tone, title }: SectionHeaderProps) {
  const theme = useTheme();
  return (
    <View style={styles.sectionTitleRow}>
      <Icon icon={icon} size={20} color={theme.color[tone]} />
      <Text variant="h2" style={styles.sectionTitle}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitleRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  sectionTitle: { marginLeft: 8 },
});
