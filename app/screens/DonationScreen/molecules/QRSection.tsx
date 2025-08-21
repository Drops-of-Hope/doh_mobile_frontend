import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ActionButton from "../atoms/ActionButton";
import { UserProfile } from "../types";
import { useLanguage } from "../../../context/LanguageContext";

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
  const { t } = useLanguage();

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
        <View style={styles.profileCardContainer}>
          <LinearGradient
            colors={['#EF4444', '#DC2626', '#B91C1C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBorder}
          >
            <View style={styles.profileInfo}>
              <View style={styles.profileHeader}>
                <Ionicons name="person-circle" size={24} color="#DC2626" />
                <Text style={styles.profileTitle}>{t("donation.donor_eligibility")}</Text>
              </View>
              
              <View style={styles.profileContent}>
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>{t("common.name")}:</Text>
                  <Text style={styles.profileValue}>{userProfile.name}</Text>
                </View>
                
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>{t("home.blood_type")}:</Text>
                  <Text style={styles.profileValue}>{userProfile.bloodType}</Text>
                </View>
                
                <View style={styles.profileRow}>
                  <Text style={styles.profileLabel}>{t("home.total_donations")}:</Text>
                  <Text style={styles.profileValue}>{userProfile.totalDonations}</Text>
                </View>
                
                <View style={styles.statusContainer}>
                  <Ionicons 
                    name={userProfile.eligibleForDonation ? "checkmark-circle" : "close-circle"} 
                    size={16} 
                    color={userProfile.eligibleForDonation ? "#10B981" : "#EF4444"} 
                  />
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: userProfile.eligibleForDonation ? "#10B981" : "#EF4444",
                      },
                    ]}
                  >
                    {userProfile.eligibleForDonation ? t("donation.eligible") : t("donation.not_eligible")}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
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
  profileCardContainer: {
    marginTop: 32,
  },
  gradientBorder: {
    borderRadius: 16,
    padding: 2, // This creates the border effect
  },
  profileInfo: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  profileContent: {
    gap: 12,
  },
  profileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  profileLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    flex: 1,
  },
  profileValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
    textAlign: "right",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  profileDetail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
});
