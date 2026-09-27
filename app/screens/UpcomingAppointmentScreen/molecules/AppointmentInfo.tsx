import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "../../../design";

interface AppointmentInfoProps {
  hospital: string;
  type: string;
}

export default function AppointmentInfo({ hospital, type }: AppointmentInfoProps) {
  return (
    <View style={styles.appointmentInfo}>
      <Text variant="h3">{hospital}</Text>
      <Text variant="caption" tone="inkMuted">
        {type}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentInfo: { flex: 1, gap: 2 },
});
