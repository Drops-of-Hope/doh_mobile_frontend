import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NotesContainerProps {
  notes: string;
}

export default function NotesContainer({ notes }: NotesContainerProps) {
  return (
    <View style={styles.notesContainer}>
      <Ionicons name="information-circle" size={16} color="#6B7280" />
      <Text style={styles.notesText}>{notes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
    lineHeight: 20,
    flex: 1,
  },
});
