import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Copy } from "lucide-react-native";
import { Text, Icon, useTheme } from "../../../design";
import { DetailRowProps } from "../types";

export default function DetailRow({ icon, text, tone = "ink", isPast = false, onCopy, copyValue }: DetailRowProps) {
  const theme = useTheme();
  const isAppointmentId = text.startsWith("ID:");
  const color = isPast ? theme.color.inkMuted : (theme.color[tone] as string);

  const handleCopy = async () => {
    if (onCopy && copyValue) {
      try {
        await Clipboard.setStringAsync(copyValue);
        onCopy("Appointment ID copied to clipboard!");
      } catch {
        onCopy("Failed to copy appointment ID");
      }
    }
  };

  const content = (
    <View style={styles.detailRow}>
      <Icon icon={icon} size={16} color={color} />
      <Text variant="body" style={[styles.detailText, { color }]}>
        {text}
      </Text>
      {isAppointmentId && onCopy ? <Icon icon={Copy} size={14} color={color} /> : null}
    </View>
  );

  if (isAppointmentId && onCopy) {
    return <Pressable onPress={handleCopy}>{content}</Pressable>;
  }

  return content;
}

const styles = StyleSheet.create({
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { flex: 1 },
});
