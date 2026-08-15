import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, useTheme } from "../../../design";

interface ModalActionsProps {
  primaryTitle: string;
  secondaryTitle: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

// Shared footer for the HomeScreen sheets — two design-system Buttons in a row.
export default function ModalActions({
  primaryTitle,
  secondaryTitle,
  onPrimary,
  onSecondary,
}: ModalActionsProps) {
  const theme = useTheme();
  return (
    <View style={[styles.row, { borderTopColor: theme.color.hairline, marginTop: theme.space.lg }]}>
      <View style={styles.flex}>
        <Button title={secondaryTitle} variant="outline" onPress={onSecondary} />
      </View>
      <View style={styles.flex}>
        <Button title={primaryTitle} variant="solid" onPress={onPrimary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12, paddingTop: 16, borderTopWidth: 1.5 },
  flex: { flex: 1 },
});
