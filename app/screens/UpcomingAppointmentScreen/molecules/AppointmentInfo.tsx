import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AppointmentInfoProps {
  hospital: string;
  type: string;
}

export default function AppointmentInfo({
  hospital,
  type,
}: AppointmentInfoProps) {
  return (
    <View style={styles.appointmentInfo}>
      <Text style={styles.hospitalName}>{hospital}</Text>
      <Text style={styles.appointmentType}>{type}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentInfo: {
    flex: 1,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
});
