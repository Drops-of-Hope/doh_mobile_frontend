import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../shared/atoms/Button";
import DonationAdviceCarousel from "./DonationAdviceCarousel";
import NICCard from "./NICCard";
import DonationTimerCard from "./DonationTimerCard";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";
import { UserProfile } from "../types";

interface QRSectionProps {
  userProfile: UserProfile | null;
  attendanceMarked: boolean;
  onShowQR: () => void;
  onShowForm: () => void;
  qrScanned?: boolean;
  onStartTimer?: () => void;
  isTimerStarted?: boolean;
  isPolling?: boolean;
  pollingAttempts?: number;
  pollingComplete?: boolean;
  canRetry?: boolean;
  retryCountdown?: number;
  onRetryPolling?: () => void;
}

export default function QRSection({ 
  userProfile,
  attendanceMarked,
  onShowQR,
  onShowForm,
  qrScanned = false,
  onStartTimer,
  isTimerStarted = false,
  isPolling = false,
  pollingAttempts = 0,
  pollingComplete = false,
  canRetry = false,
  retryCountdown = 0,
  onRetryPolling,
}: QRSectionProps) {
  // Debug log to see state
  console.log("🎯 QRSection render state:", {
    attendanceMarked,
    isPolling,
    pollingComplete,
    pollingAttempts,
    qrScanned,
    canRetry,
    retryCountdown
  });

  return (
    <View style={styles.container}>
      {!attendanceMarked ? (
        <>
          {/* Main QR Card - Always visible until attendance marked */}
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

          {/* Verification Status - Shows between QR card and tips */}
          {isPolling && (
            <View style={styles.statusCard}>
              <ActivityIndicator size="small" color={COLORS.PRIMARY} style={styles.statusSpinner} />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>Verifying Attendance...</Text>
                <Text style={styles.statusSubtitle}>
                  Checking for attendance confirmation (Attempt {pollingAttempts}/3)
                </Text>
              </View>
            </View>
          )}

          {pollingComplete && (
            <View style={styles.statusCard}>
              <Ionicons name="time-outline" size={40} color={COLORS.WARNING} style={styles.statusIcon} />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>Attendance Not Confirmed Yet</Text>
                <Text style={styles.statusSubtitle}>
                  Please ensure the staff has scanned your QR code
                </Text>
                <View style={styles.statusButtonGroup}>
                  {canRetry ? (
                    <Button 
                      title="Retry Verification" 
                      onPress={onRetryPolling || (() => {})}
                    />
                  ) : (
                    <View style={styles.disabledButtonContainer}>
                      <Button 
                        title={`Retry in ${retryCountdown}s`}
                        onPress={() => {}}
                        disabled={true}
                      />
                    </View>
                  )}
                  
                  {/* Testing: Allow skipping for development */}
                  <View style={styles.skipButtonContainer}>
                    <Button 
                      title="Skip (Testing)" 
                      onPress={onShowForm}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Donation Advice Carousel - Always visible */}
          <View style={styles.adviceSection}>
            <Text style={styles.adviceTitle}>Tips for a Successful Donation</Text>
            <DonationAdviceCarousel />
          </View>
        </>
      ) : (
        <>
          {/* QR Marked Successfully */}
          <View style={styles.card}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={120} color={COLORS.SUCCESS} />
            </View>
            <Text style={styles.title}>Attendance Marked!</Text>
            <Text style={styles.subtitle}>
              Your attendance has been successfully verified. You can now complete the donation form.
            </Text>
          </View>

          {/* Post-QR Cards */}
          {qrScanned && (
            <View style={styles.postQRContainer}>
              <NICCard nicNumber={userProfile?.id || ""} />
              
              {/* Complete Donation Form Button - Between NIC and Timer */}
              <View style={styles.formButtonContainer}>
                <Button 
                  title="Complete Donation Form" 
                  onPress={onShowForm}
                />
              </View>
              
              <DonationTimerCard 
                onStartTimer={onStartTimer || (() => {})}
                isTimerStarted={isTimerStarted}
              />
            </View>
          )}
        </>
      )}
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
  postQRContainer: {
    width: "100%",
    marginBottom: SPACING.LG,
    gap: SPACING.MD,
  },
  formButtonContainer: {
    width: "100%",
    paddingVertical: SPACING.SM, // Makes button vertically fatter
  },
  formButton: {
    marginTop: SPACING.MD,
  },
  spinner: {
    marginBottom: SPACING.MD,
  },
  pollingStatus: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.SM,
    fontWeight: "600",
  },
  // Status card - appears between QR card and tips
  statusCard: {
    backgroundColor: COLORS.BACKGROUND,
    padding: SPACING.MD,
    borderRadius: BORDER_RADIUS.LG,
    borderWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    marginBottom: SPACING.LG,
    width: "100%",
    maxWidth: 320,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statusSpinner: {
    marginRight: SPACING.SM,
  },
  statusIcon: {
    marginRight: SPACING.SM,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  statusSubtitle: {
    fontSize: 13,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 18,
  },
  statusButtonGroup: {
    marginTop: SPACING.SM,
    gap: SPACING.XS,
  },
  disabledButtonContainer: {
    opacity: 0.6,
  },
  buttonGroup: {
    width: "100%",
    gap: SPACING.SM,
  },
  skipButtonContainer: {
    marginTop: SPACING.XS,
    opacity: 0.7,
  },
});
