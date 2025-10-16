import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../shared/atoms/Button";

interface AttendanceMarkedSectionProps {
  onFillForm: () => void;
}

export default function AttendanceMarkedSection({
  onFillForm,
}: AttendanceMarkedSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Ionicons
          name="checkmark-circle"
          size={60}
          color="#10B981"
          style={styles.checkmark}
        />
        <Text style={styles.title}>Attendance Marked!</Text>
        <Text style={styles.subtitle}>
          Please fill out the health questionnaire to continue
        </Text>
        <Button title="Fill Health Form" onPress={onFillForm} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#F0FDF4",
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    alignItems: "center",
    marginBottom: 32,
  },
  checkmark: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    maxWidth: 280,
  },
});
