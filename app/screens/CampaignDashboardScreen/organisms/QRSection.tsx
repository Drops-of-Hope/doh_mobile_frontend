import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QRButton from "../molecules/QRButton";
import { QRSectionProps } from "../types";

export default function QRSection({ onScanQR }: QRSectionProps) {
  return (
    <View style={styles.qrSection}>
      <Text style={styles.sectionTitle}>Scan QR Code</Text>
      <QRButton onScanQR={onScanQR} />
    </View>
  );
}

const styles = StyleSheet.create({
  qrSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
});
