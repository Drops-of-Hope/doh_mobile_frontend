import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text } from "./Text";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, actionLabel, onAction }) => (
  <View style={styles.row}>
    <Text variant="overline" tone="inkMuted">
      {title.toUpperCase()}
    </Text>
    {actionLabel && onAction ? (
      <Pressable onPress={onAction} hitSlop={8}>
        <Text variant="label" tone="crimson">
          {actionLabel}
        </Text>
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
});

export default SectionHeader;
