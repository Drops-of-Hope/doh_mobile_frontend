import React from "react";
import { View, StyleSheet } from "react-native";
import ActionButton from "../atoms/ActionButton";

interface ActionButtonsProps {
  onReschedule: () => void;
  onCancel: () => void;
}

export default function ActionButtons({
  onReschedule,
  onCancel,
}: ActionButtonsProps) {
  return (
    <View style={styles.actionButtons}>
      <ActionButton
        icon="calendar"
        text="Reschedule"
        color="#DC2626"
        backgroundColor="#FEF2F2"
        borderColor="#DC2626"
        onPress={onReschedule}
      />

      <ActionButton
        icon="close"
        text="Cancel"
        color="#EF4444"
        backgroundColor="#FEF2F2"
        borderColor="#EF4444"
        onPress={onCancel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
});
