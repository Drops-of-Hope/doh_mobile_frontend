import React from "react";
import { View, StyleSheet } from "react-native";
import { Info } from "lucide-react-native";
import { Text, Icon, useTheme } from "../../../design";

interface NotesContainerProps {
  notes: string;
}

export default function NotesContainer({ notes }: NotesContainerProps) {
  const theme = useTheme();
  return (
    <View
      style={[styles.notesContainer, { backgroundColor: theme.color.surfaceSunken, borderRadius: theme.radius.md }]}
    >
      <Icon icon={Info} size={16} color={theme.color.inkMuted} />
      <Text variant="caption" tone="inkMuted" style={styles.notesText}>
        {notes}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notesContainer: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, marginBottom: 16 },
  notesText: { flex: 1 },
});
