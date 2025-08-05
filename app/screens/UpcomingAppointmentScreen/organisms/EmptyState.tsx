import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EmptyStateProps } from "../types";

export default function EmptyState({ onBookAppointment }: EmptyStateProps) {
  return (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#9CA3AF" />
      <Text style={styles.emptyTitle}>No Appointments</Text>
      <Text style={styles.emptyMessage}>
        You don't have any appointments scheduled.{"\n"}
        Book your first appointment to get started!
      </Text>

      {onBookAppointment && (
        <TouchableOpacity style={styles.bookButton} onPress={onBookAppointment}>
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: "#5F27CD",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
