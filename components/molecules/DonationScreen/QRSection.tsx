import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../atoms/Button";

interface QRSectionProps {
  onShowQR: () => void;
}

export default function QRSection({ onShowQR }: QRSectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="qr-code-outline" size={200} color="#000000" />
        </View>
        <Text style={styles.title}>Ready to Donate?</Text>
        <Text style={styles.subtitle}>
          Show your QR code to the camp staff to mark your attendance
        </Text>
        <Button title="Show QR Code" onPress={onShowQR} />
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
    backgroundColor: "white",
    padding: 32,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FECACA",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
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
    lineHeight: 20,
  },
});
