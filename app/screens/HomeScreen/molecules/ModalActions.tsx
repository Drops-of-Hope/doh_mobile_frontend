import React from "react";
import { View, StyleSheet } from "react-native";
import ActionButton from "../atoms/ActionButton";

interface ModalActionsProps {
  primaryTitle: string;
  secondaryTitle: string;
  onPrimary: () => void;
  onSecondary: () => void;
}

export default function ModalActions({
  primaryTitle,
  secondaryTitle,
  onPrimary,
  onSecondary,
}: ModalActionsProps) {
  return (
    <View style={styles.modalActions}>
      <ActionButton
        title={secondaryTitle}
        onPress={onSecondary}
        variant="secondary"
        style={styles.actionButtonSpacing}
      />
      <ActionButton
        title={primaryTitle}
        onPress={onPrimary}
        variant="primary"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  modalActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  actionButtonSpacing: {
    marginRight: 8,
  },
});
