import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { X, Zap, ZapOff, Camera } from "lucide-react-native";

import { qrService, QRScanResult, AttendanceMarkResult } from "../../../services/qrService";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";
import { Text, Button, Icon, useTheme } from "../../../design";

import { logger } from "../../../utils/logger";

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  campaignId?: string;
  scanType?: "CAMPAIGN_ATTENDANCE" | "DONATION_VERIFICATION" | "CHECK_IN" | "CHECK_OUT";
  onScanSuccess?: (result: QRScanResult) => void;
}

export default function QRScannerModal({
  visible,
  onClose,
  campaignId,
  scanType = "CAMPAIGN_ATTENDANCE",
  onScanSuccess,
}: QRScannerModalProps) {
  const theme = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(true);

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (visible) {
      if (!permission?.granted) {
        requestPermission();
      }
      setScanned(false);
      setScannerEnabled(true);
    }
  }, [visible, permission]);

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || processing) return;

    setScanned(true);
    setProcessing(true);
    setScannerEnabled(false);
    Vibration.vibrate(100);

    try {
      let userId: string;
      let donorData: any = null;

      // Try to parse as JSON first (new format)
      try {
        const parsedData = JSON.parse(data);

        // Check if it's the expected donor format: {name, email, uid, timestamp}
        if (parsedData.uid && parsedData.name && parsedData.email) {
          userId = parsedData.uid;
          donorData = {
            name: parsedData.name,
            email: parsedData.email,
            uid: parsedData.uid,
            timestamp: parsedData.timestamp,
          };
        } else {
          throw new Error("Invalid QR format");
        }
      } catch (jsonError: any) {
        // Fallback to old format - direct UUID string
        if (data && data.length >= 36) {
          userId = data;
        } else {
          throw new Error(t("qr_scanner.invalid_qr"));
        }
      }

      // Validate userId
      if (!userId) {
        throw new Error(t("qr_scanner.invalid_qr"));
      }

      const scanRequest = {
        qrData: userId, // Send only the user ID, not the full JSON
        campaignId,
        scanType,
        metadata: {
          scannerUserId: user?.id,
          scanLocation: "QR_SCANNER",
          timestamp: new Date().toISOString(),
          donorInfo: donorData, // Include donor data in metadata if available
        },
      };

      const scanResult = await qrService.scanQR(scanRequest);

      if (scanResult.success) {
        // Show success message
        Alert.alert(
          "QR Code Scanned Successfully",
          getScanSuccessMessage(scanResult, donorData),
          [
            {
              text: "Mark Attendance",
              onPress: () => markAttendance(userId, donorData),
              style: "default",
            },
            {
              text: "Close",
              onPress: () => {
                onScanSuccess?.(scanResult);
                resetScanner();
              },
              style: "cancel",
            },
          ]
        );
      } else {
        throw new Error(scanResult.message || t("qr_scanner.scan_failed"));
      }
    } catch (error: any) {
      logger.error("QR Scan error:", error);
      Alert.alert(
        t("qr_scanner.scan_error"),
        error.message || t("qr_scanner.unknown_error"),
        [
          {
            text: t("qr_scanner.try_again"),
            onPress: resetScanner,
          },
          {
            text: t("common.close"),
            onPress: onClose,
          },
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  const markAttendance = async (userId: string, donorData?: any) => {
    if (!campaignId) {
      Alert.alert(t("qr_scanner.error"), t("qr_scanner.no_campaign"));
      return;
    }

    try {
      setProcessing(true);

      const result = await qrService.markAttendance({
        userId,
        campaignId,
        scanType: "CHECK_IN",
        notes: donorData ? `Donor: ${donorData.name} (${donorData.email})` : undefined,
        autoRegister: true, // Allow automatic registration if not already registered
      });

      if (result.success) {
        Alert.alert(
          t("qr_scanner.attendance_marked"),
          getAttendanceSuccessMessage(result, donorData),
          [
            {
              text: t("common.ok"),
              onPress: () => {
                onScanSuccess?.(result as any);
                resetScanner();
              },
            },
          ]
        );
      } else {
        throw new Error(result.message || t("qr_scanner.attendance_failed"));
      }
    } catch (error: any) {
      logger.error("Mark attendance error:", error);

      // Handle the case where participation doesn't exist - offer to auto-register
      if (error.message?.includes("Participation not found") || error.message?.includes("not registered")) {
        const userName = donorData?.name || "This user";
        Alert.alert(
          "Auto-Register for Campaign",
          `${userName} is not registered for this campaign. Would you like to automatically register them and mark attendance?`,
          [
            {
              text: "Cancel",
              onPress: resetScanner,
              style: "cancel",
            },
            {
              text: "Register & Mark Attendance",
              onPress: async () => {
                try {
                  // Try to auto-register and mark attendance
                  const autoRegisterResult = await qrService.autoRegisterAndMarkAttendance({
                    userId,
                    campaignId,
                    scanType: "CHECK_IN",
                    notes: donorData ? `Auto-registered: ${donorData.name} (${donorData.email})` : "Auto-registered participant",
                  });

                  if (autoRegisterResult.success) {
                    Alert.alert(
                      "Success",
                      `${userName} has been registered for the campaign and attendance has been marked.`,
                      [
                        {
                          text: t("common.ok"),
                          onPress: () => {
                            onScanSuccess?.(autoRegisterResult as any);
                            resetScanner();
                          },
                        },
                      ]
                    );
                  } else {
                    throw new Error(autoRegisterResult.message || "Auto-registration failed");
                  }
                } catch (autoRegError: any) {
                  Alert.alert(
                    "Registration Failed",
                    autoRegError.message || "Failed to auto-register participant. Please register manually.",
                    [{ text: t("common.ok"), onPress: resetScanner }]
                  );
                }
              },
              style: "default",
            },
          ]
        );
        return;
      }

      // Handle other errors
      let errorMessage = error.message || t("qr_scanner.attendance_failed");
      let errorTitle = t("qr_scanner.error");

      if (error.message?.includes("404")) {
        errorTitle = "User Not Found";
        errorMessage = "This user could not be found in the system. Please verify the QR code.";
      }

      Alert.alert(errorTitle, errorMessage, [{ text: t("common.ok"), onPress: resetScanner }]);
    } finally {
      setProcessing(false);
    }
  };

  const getScanSuccessMessage = (result: QRScanResult, donorData?: any): string => {
    const { scannedUser } = result;

    // Format the basic user information
    let message = `User Identified:\nName: ${scannedUser.name}\nBlood Group: ${formatBloodGroup(scannedUser.bloodGroup)}`;

    // Add additional user info if available
    if (scannedUser.totalDonations !== undefined) {
      message += `\nTotal Donations: ${scannedUser.totalDonations}`;
    }

    if (scannedUser.donationBadge) {
      message += `\nBadge: ${scannedUser.donationBadge}`;
    }

    // Add donor-specific information if available from QR code
    if (donorData) {
      message += `\n\nQR Code Details:\nEmail: ${donorData.email}\nScanned at: ${
        donorData.timestamp ? new Date(donorData.timestamp).toLocaleString() : "Unknown"
      }`;
    }

    return message;
  };

  const getAttendanceSuccessMessage = (result: AttendanceMarkResult, donorData?: any): string => {
    let message = t("qr_scanner.attendance_success", {
      status: result.status,
      points: result.pointsEarned || 0,
    });

    // Add donor-specific information if available
    if (donorData) {
      message += `\n\nAttendance marked for: ${donorData.name} (${donorData.email})`;
    }

    return message;
  };

  const formatBloodGroup = (bloodGroup: string): string => {
    return bloodGroup.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-");
  };

  const resetScanner = () => {
    setScanned(false);
    setProcessing(false);
    setScannerEnabled(true);
  };

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled);
  };

  const handleClose = () => {
    setScanned(false);
    setProcessing(false);
    setScannerEnabled(true);
    onClose();
  };

  if (!visible) return null;

  if (!permission) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.permissionContainer, { backgroundColor: theme.color.paper }]}>
          <ActivityIndicator size="large" color={theme.color.crimson} />
          <Text variant="body" tone="inkMuted" style={{ marginTop: 16 }}>
            {t("qr_scanner.requesting_permission")}
          </Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={[styles.permissionContainer, { backgroundColor: theme.color.paper }]}>
          <Icon icon={Camera} size={64} color={theme.color.inkFaint} />
          <Text variant="h2" align="center" style={{ marginTop: 20, marginBottom: 8 }}>
            {t("qr_scanner.camera_permission_required")}
          </Text>
          <Text variant="body" tone="inkMuted" align="center" style={{ marginBottom: 24 }}>
            {t("qr_scanner.camera_permission_message")}
          </Text>
          <Button title={t("qr_scanner.grant_permission")} onPress={requestPermission} />
          <View style={{ marginTop: 12 }}>
            <Button title={t("common.close")} onPress={handleClose} variant="ghost" />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        {/* Camera View */}
        {scannerEnabled && (
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            style={styles.camera}
          />
        )}

        {/* Overlay */}
        <View style={styles.overlay}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable style={styles.headerButton} onPress={handleClose} hitSlop={12}>
              <Icon icon={X} size={24} color="#FFFFFF" />
            </Pressable>
            <Text variant="h3" tone="inverse">
              {t("qr_scanner.scan_qr_code")}
            </Text>
            <Pressable style={styles.headerButton} onPress={toggleFlash} hitSlop={12}>
              <Icon icon={flashEnabled ? Zap : ZapOff} size={24} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* Scanning Frame */}
          <View style={styles.scanningContainer}>
            <View style={styles.scanningFrame}>
              <View style={[styles.corner, styles.topLeft, { borderColor: theme.color.crimson }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: theme.color.crimson }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.color.crimson }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: theme.color.crimson }]} />
            </View>

            <Text variant="body" tone="inverse" align="center" style={styles.scanInstruction}>
              {processing ? t("qr_scanner.processing") : t("qr_scanner.align_qr_code")}
            </Text>

            {campaignId && (
              <View style={[styles.campaignInfo, { backgroundColor: theme.color.crimson }]}>
                <Text variant="label" tone="inverse">
                  {t("qr_scanner.campaign_mode")}
                </Text>
              </View>
            )}
          </View>

          {/* Processing Indicator */}
          {processing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text variant="body" tone="inverse" style={{ marginTop: 16 }}>
                {t("qr_scanner.processing")}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <View style={styles.footerContent}>
              <Text variant="caption" tone="inverse" align="center" style={styles.footerText}>
                {t("qr_scanner.scan_instruction")}
              </Text>

              {scanned && !processing && (
                <Pressable
                  style={[styles.retryButton, { backgroundColor: theme.color.crimson }]}
                  onPress={resetScanner}
                >
                  <Text variant="label" tone="inverse">
                    {t("qr_scanner.scan_again")}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerButton: {
    padding: 8,
  },
  scanningContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanningFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanInstruction: {
    marginTop: 30,
    marginHorizontal: 40,
  },
  campaignInfo: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  footerContent: {
    alignItems: "center",
  },
  footerText: {
    opacity: 0.9,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
});
