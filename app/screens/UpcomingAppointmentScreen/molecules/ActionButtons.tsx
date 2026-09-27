import React from "react";
import { View, StyleSheet } from "react-native";
import { CalendarClock, X } from "lucide-react-native";
import ActionButton from "../atoms/ActionButton";

interface ActionButtonsProps {
  onReschedule: () => void;
  onCancel: () => void;
}

export default function ActionButtons({ onReschedule, onCancel }: ActionButtonsProps) {
  return (
    <View style={styles.actionButtons}>
      <ActionButton icon={CalendarClock} text="Reschedule" tone="crimson" onPress={onReschedule} />
      <ActionButton icon={X} text="Cancel" tone="danger" onPress={onCancel} />
    </View>
  );
}

const styles = StyleSheet.create({
  actionButtons: { flexDirection: "row", gap: 12 },
});
