import React from "react";
import { View, StyleSheet } from "react-native";
import { Clock } from "lucide-react-native";
import { Surface, Text, Icon, Button, ProgressTrack, useTheme } from "../../../design";
import UrgencyBadge, { UrgencyLevel } from "../atoms/UrgencyBadge";

export interface Emergency {
  id: number;
  hospital: string;
  bloodType: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
  timeLeft: string;
  description?: string;
  contactNumber?: string;
  address?: string;
  requirements?: string;
}

interface EmergencyCardProps {
  emergency: Emergency;
  onDonate: (emergency: Emergency) => void;
  onViewDetails?: (emergency: Emergency) => void;
}

export default function EmergencyCard({ emergency, onDonate, onViewDetails }: EmergencyCardProps) {
  const theme = useTheme();
  const isCritical = emergency.urgency === "Critical";
  const progressColor =
    emergency.urgency === "Critical"
      ? theme.color.crimson
      : emergency.urgency === "Moderate"
      ? theme.color.warning
      : theme.color.info;

  return (
    <Surface
      tone={isCritical ? "crimsonSoft" : "surface"}
      style={isCritical ? { borderColor: theme.color.crimson, borderWidth: 2 } : undefined}
    >
      <View style={styles.header}>
        <UrgencyBadge urgency={emergency.urgency} />
        <View style={styles.timeLeft}>
          <Icon icon={Clock} size={14} color={isCritical ? theme.color.crimson : theme.color.inkMuted} />
          <Text variant="label" tone={isCritical ? "crimson" : "inkMuted"}>
            {emergency.timeLeft}
          </Text>
        </View>
      </View>

      <Text variant="h3" style={styles.hospital}>
        {emergency.hospital}
      </Text>

      <View style={styles.metaRow}>
        <Text variant="bodyBold" tone="crimson">
          {emergency.bloodType}
        </Text>
        <Text variant="caption" tone="inkMuted">
          {emergency.slotsUsed}/{emergency.totalSlots} slots filled
        </Text>
      </View>

      <ProgressTrack
        progress={emergency.totalSlots > 0 ? emergency.slotsUsed / emergency.totalSlots : 0}
        color={progressColor}
      />

      <View style={styles.actions}>
        <View style={styles.actionFlex2}>
          <Button title="Donate Now" variant="solid" onPress={() => onDonate(emergency)} />
        </View>
        <View style={styles.actionFlex1}>
          <Button title="Details" variant="outline" onPress={() => onViewDetails?.(emergency)} />
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  timeLeft: { flexDirection: "row", alignItems: "center", gap: 4 },
  hospital: { marginBottom: 10 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  actions: { flexDirection: "row", gap: 10, marginTop: 14 },
  actionFlex2: { flex: 2 },
  actionFlex1: { flex: 1 },
});
