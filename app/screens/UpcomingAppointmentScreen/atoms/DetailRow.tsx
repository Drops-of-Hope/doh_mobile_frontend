import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from 'expo-clipboard';
import { DetailRowProps } from "../types";

export default function DetailRow({
  icon,
  text,
  color = "#4B5563",
  isPast = false,
  onCopy,
  copyValue,
}: DetailRowProps) {
  const textColor = isPast ? "#6B7280" : color;
  const isAppointmentId = text.startsWith('ID:');

  const handleCopy = async () => {
    if (onCopy && copyValue) {
      try {
        await Clipboard.setStringAsync(copyValue);
        onCopy('Appointment ID copied to clipboard!');
      } catch (error) {
        onCopy('Failed to copy appointment ID');
      }
    }
  };

  const content = (
    <View style={styles.detailRow}>
      <Ionicons
        name={icon as any}
        size={16}
        color={isPast ? "#6B7280" : color}
      />
      <Text style={[styles.detailText, { color: textColor }]}>{text}</Text>
      {isAppointmentId && onCopy && (
        <Ionicons
          name="copy-outline"
          size={14}
          color={textColor}
          style={styles.copyIcon}
        />
      )}
    </View>
  );

  if (isAppointmentId && onCopy) {
    return (
      <TouchableOpacity onPress={handleCopy} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  copyIcon: {
    marginLeft: 4,
  },
});
