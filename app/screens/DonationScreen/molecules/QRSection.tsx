import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { QrCode, CheckCircle2, Clock } from "lucide-react-native";
import { Text, Button, Surface, Icon, useTheme } from "../../../design";
import DonationAdviceCarousel from "./DonationAdviceCarousel";
import NICCard from "./NICCard";
import DonationTimerCard from "./DonationTimerCard";
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
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {!attendanceMarked ? (
        <>
          {/* Main QR Card - Always visible until attendance marked */}
          <Surface style={styles.card}>
            <View
              style={[
                styles.iconContainer,
                { borderColor: theme.color.hairlineStrong, borderRadius: theme.radius.pill },
              ]}
            >
              <Icon icon={QrCode} size={72} color={theme.color.crimson} strokeWidth={1.25} />
            </View>
            <Text variant="h2" align="center" style={styles.title}>
              Ready to Donate?
            </Text>
            <Text variant="body" tone="inkMuted" align="center" style={styles.subtitle}>
              Show your QR code to the camp staff to mark your attendance
            </Text>
            <Button title="Show QR Code" onPress={onShowQR} />
          </Surface>

          {/* Verification Status - Shows between QR card and tips */}
          {isPolling && (
            <Surface style={styles.statusCard}>
              <ActivityIndicator size="small" color={theme.color.crimson} style={styles.statusLead} />
              <View style={styles.statusTextContainer}>
                <Text variant="bodyBold">Verifying Attendance...</Text>
                <Text variant="caption" tone="inkMuted">
                  Checking for attendance confirmation (Attempt {pollingAttempts}/3)
                </Text>
              </View>
            </Surface>
          )}

          {pollingComplete && (
            <Surface style={styles.statusCard}>
              <View style={styles.statusLead}>
                <Icon icon={Clock} size={32} color={theme.color.warning} />
              </View>
              <View style={styles.statusTextContainer}>
                <Text variant="bodyBold">Attendance Not Confirmed Yet</Text>
                <Text variant="caption" tone="inkMuted">
                  Please ensure the staff has scanned your QR code
                </Text>
                <View style={styles.statusButtonGroup}>
                  {canRetry ? (
                    <Button title="Retry Verification" size="sm" onPress={onRetryPolling || (() => {})} />
                  ) : (
                    <Button title={`Retry in ${retryCountdown}s`} size="sm" onPress={() => {}} disabled />
                  )}

                  {/* Testing: Allow skipping for development */}
                  <Button title="Skip (Testing)" size="sm" variant="ghost" onPress={onShowForm} />
                </View>
              </View>
            </Surface>
          )}

          {/* Donation Advice Carousel - Always visible */}
          <View style={styles.adviceSection}>
            <Text variant="h3" align="center" style={styles.adviceTitle}>
              Tips for a Successful Donation
            </Text>
            <DonationAdviceCarousel />
          </View>
        </>
      ) : (
        <>
          {/* QR Marked Successfully */}
          <Surface style={styles.card}>
            <View
              style={[
                styles.iconContainer,
                { borderColor: theme.color.success, borderRadius: theme.radius.pill },
              ]}
            >
              <Icon icon={CheckCircle2} size={72} color={theme.color.success} strokeWidth={1.25} />
            </View>
            <Text variant="h2" align="center" style={styles.title}>
              Attendance Marked!
            </Text>
            <Text variant="body" tone="inkMuted" align="center" style={styles.subtitle}>
              Your attendance has been successfully verified. You can now complete the donation form.
            </Text>
          </Surface>

          {/* Post-QR Cards */}
          {qrScanned && (
            <View style={styles.postQRContainer}>
              <NICCard nicNumber={userProfile?.id || ""} />

              <Button title="Complete Donation Form" onPress={onShowForm} />

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
    width: "100%",
  },
  card: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    marginBottom: 16,
    padding: 20,
    borderWidth: 1.5,
  },
  title: {
    marginBottom: 6,
  },
  subtitle: {
    marginBottom: 20,
    maxWidth: 280,
  },
  adviceSection: {
    width: "100%",
    marginTop: 12,
  },
  adviceTitle: {
    marginBottom: 12,
  },
  postQRContainer: {
    width: "100%",
    marginBottom: 16,
    gap: 12,
  },
  statusCard: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statusLead: {
    marginRight: 12,
  },
  statusTextContainer: {
    flex: 1,
    gap: 2,
  },
  statusButtonGroup: {
    marginTop: 10,
    gap: 6,
  },
});
