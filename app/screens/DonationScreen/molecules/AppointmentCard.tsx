import React from "react";
import { View, StyleSheet } from "react-native";
import { MapPin, Calendar, Info } from "lucide-react-native";
import { Surface, Text, Button, Icon, useTheme } from "../../../design";

export interface AppointmentItem {
  id: string;
  date: string;
  time: string;
  location: string;
  hospital: string;
  status: "upcoming" | "completed" | "cancelled";
}

interface AppointmentCardProps {
  appointment: AppointmentItem;
  onViewDetails?: (appointment: AppointmentItem) => void;
}

const formatDisplayText = (text: string | undefined, fallback: string): string =>
  !text || text.trim() === "" ? fallback : text;

export default function AppointmentCard({ appointment, onViewDetails }: AppointmentCardProps) {
  const theme = useTheme();

  const tone =
    appointment.status === "upcoming" ? "info" : appointment.status === "completed" ? "success" : "danger";
  const accentColor = theme.color[tone];

  const displayHospital = formatDisplayText(appointment.hospital, "Unknown Hospital");
  const displayLocation = formatDisplayText(appointment.location, "Location TBD");

  const showDetailsButton = onViewDetails && appointment.status === "upcoming";

  return (
    <Surface style={[styles.container, { borderLeftColor: accentColor, borderLeftWidth: 4 }]}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text variant="bodyBold">{displayHospital}</Text>

          <View style={styles.metaRow}>
            <Icon icon={MapPin} size={14} color={theme.color.inkMuted} />
            <Text variant="caption" tone="inkMuted" style={styles.metaText}>
              {displayLocation}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Icon icon={Calendar} size={14} color={accentColor} />
            <Text variant="caption" style={{ color: accentColor, fontWeight: "600" }}>
              {appointment.time ? `${appointment.date} at ${appointment.time}` : appointment.date}
            </Text>
          </View>
        </View>

        {showDetailsButton ? (
          <Button
            title="Details"
            variant="outline"
            size="sm"
            fullWidth={false}
            onPress={() => onViewDetails!(appointment)}
            icon={<Icon icon={Info} size={16} color={theme.color.crimson} />}
          />
        ) : (
          <View
            style={[styles.statusBadge, { backgroundColor: `${accentColor}1A`, borderRadius: theme.radius.sm }]}
          >
            <Text variant="caption" style={{ color: accentColor, fontWeight: "700" }}>
              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  content: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 },
  info: { flex: 1, gap: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { flex: 1 },
  statusBadge: { paddingVertical: 4, paddingHorizontal: 8 },
});
