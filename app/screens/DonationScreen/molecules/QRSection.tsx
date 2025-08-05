import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ActionButton from "../atoms/ActionButton";
import { UserProfile } from "../types";

interface QRSectionProps {
  userProfile: UserProfile | null;
  attendanceMarked: boolean;
  onShowQR: () => void;
  onShowForm: () => void;
  onMarkAttendance: () => void;
}

export default function QRSection({
  userProfile,
  attendanceMarked,
  onShowQR,
  onShowForm,
  onMarkAttendance,
}: QRSectionProps) {
  return (
    <View style={styles.qrSection}>
      <View style={styles.qrHeader}>
        <Ionicons name="qr-code" size={64} color="#DC2626" />
        <Text style={styles.qrTitle}>Quick Donation</Text>
        <Text style={styles.qrSubtitle}>
          {attendanceMarked
            ? "Your attendance is confirmed. You can now fill the donation form."
            : "Show your QR code to medical staff to mark your attendance"}
        </Text>
      </View>

      <View style={styles.qrActions}>
        {!attendanceMarked ? (
          <>
            <ActionButton
              title="Show QR Code"
              icon="qr-code"
              onPress={onShowQR}
            />

            <ActionButton
              title="Simulate QR Scan"
              icon="scan"
              onPress={onMarkAttendance}
              variant="secondary"
            />
          </>
        ) : (
          <ActionButton
            title="Fill Donation Form"
            icon="document-text"
            onPress={onShowForm}
          />
        )}
      </View>

      {userProfile && (
        <View style={styles.profileInfo}>
          <Text style={styles.profileTitle}>Your Profile</Text>
          <Text style={styles.profileDetail}>Name: {userProfile.name}</Text>
          <Text style={styles.profileDetail}>
            Blood Type: {userProfile.bloodType}
          </Text>
          <Text style={styles.profileDetail}>
            Total Donations: {userProfile.totalDonations}
          </Text>
          <Text
            style={[
              styles.profileDetail,
              {
                color: userProfile.eligibleForDonation ? "#10B981" : "#EF4444",
              },
            ]}
          >
            Status:{" "}
            {userProfile.eligibleForDonation ? "Eligible" : "Not Eligible"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  qrSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40, // Increased top padding
  },
  qrHeader: {
    alignItems: "center",
    paddingVertical: 40, // Increased padding
    marginBottom: 20, // Added margin below header
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20, // Reduced since we added margin to header
  },
  qrActions: {
    gap: 16, // Increased gap between buttons
    marginTop: 20, // Added margin above buttons
  },
  profileInfo: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginTop: 32, // Increased margin
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  profileDetail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
});
