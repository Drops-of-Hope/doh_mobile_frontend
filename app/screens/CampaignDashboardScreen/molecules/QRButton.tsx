import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { QRSectionProps } from "../types";

export default function QRButton({ onScanQR }: QRSectionProps) {
  return (
    <TouchableOpacity style={styles.qrButton} onPress={onScanQR}>
      <Ionicons name="qr-code-outline" size={48} color="#FF4757" />
      <Text style={styles.qrButtonText}>Scan QR Code</Text>
      <Text style={styles.qrButtonSubtext}>Mark Attendance</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  qrButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 12,
  },
  qrButtonSubtext: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
});
