import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../shared/atoms/Button";
import DonationAdviceCarousel from "./DonationAdviceCarousel";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";
import { UserProfile } from "../types";

interface QRSectionProps {
  userProfile: UserProfile | null;
  attendanceMarked: boolean;
  onShowQR: () => void;
  onShowForm: () => void;
}

export default function QRSection({ 
  userProfile,
  attendanceMarked,
  onShowQR,
  onShowForm
}: QRSectionProps) {
  return (
    <View style={styles.container}>
      {/* Main QR Card */}
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons name="qr-code-outline" size={120} color={COLORS.PRIMARY} />
        </View>
        <Text style={styles.title}>Ready to Donate?</Text>
        <Text style={styles.subtitle}>
          Show your QR code to the camp staff to mark your attendance
        </Text>
        <Button title="Show QR Code" onPress={onShowQR} />
      </View>

      {/* Donation Advice Carousel */}
      <View style={styles.adviceSection}>
        <Text style={styles.adviceTitle}>Tips for a Successful Donation</Text>
        <DonationAdviceCarousel />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.MD,
  },
  card: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.LG,
    borderRadius: BORDER_RADIUS.XL,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    alignItems: "center",
    marginBottom: SPACING.LG,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: "100%",
    maxWidth: 320,
  },
  iconContainer: {
    marginBottom: SPACING.MD,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.FULL,
    backgroundColor: `${COLORS.PRIMARY}10`, // 10% opacity
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.XS,
  },
  subtitle: {
    color: COLORS.TEXT_SECONDARY,
    textAlign: "center",
    marginBottom: SPACING.LG,
    maxWidth: 280,
    lineHeight: 20,
    fontSize: 14,
  },
  adviceSection: {
    width: "100%",
    marginTop: SPACING.MD,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
});
