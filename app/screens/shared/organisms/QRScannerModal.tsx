import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Vibration,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { qrService, QRScanResult, AttendanceMarkResult } from "../../../services/qrService";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  campaignId?: string;
  scanType?: "CAMPAIGN_ATTENDANCE" | "DONATION_VERIFICATION" | "CHECK_IN" | "CHECK_OUT";
  onScanSuccess?: (result: QRScanResult) => void;
}

const { width, height } = Dimensions.get("window");

export default function QRScannerModal({
  visible,
  onClose,
  campaignId,
  scanType = "CAMPAIGN_ATTENDANCE",
  onScanSuccess,
}: QRScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [scannerEnabled, setScannerEnabled] = useState(true);

  const { user, hasRole } = useAuth();
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

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || processing) return;

    setScanned(true);
    setProcessing(true);
    setScannerEnabled(false);
    Vibration.vibrate(100);

    try {
      // Validate scanned data (should be a user ID)
      if (!data || data.length < 36) { // UUID should be 36 characters
        throw new Error(t("qr_scanner.invalid_qr"));
      }

      const scanResult = await qrService.scanQR({
        qrData: data,
        campaignId,
        scanType,
      });

      if (scanResult.success) {
        // Show success message
        Alert.alert(
          t("qr_scanner.scan_success"),
          getScanSuccessMessage(scanResult),
          [
            {
              text: t("qr_scanner.mark_attendance"),
              onPress: () => markAttendance(data),
            },
            {
              text: t("common.close"),
              onPress: () => {
                onScanSuccess?.(scanResult);
                resetScanner();
              },
            },
          ]
        );
      } else {
        throw new Error(scanResult.message || t("qr_scanner.scan_failed"));
      }
    } catch (error: any) {
      console.error("QR Scan error:", error);
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

  const markAttendance = async (userId: string) => {
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
      });

      if (result.success) {
        Alert.alert(
          t("qr_scanner.attendance_marked"),
          getAttendanceSuccessMessage(result),
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
      console.error("Mark attendance error:", error);
      Alert.alert(
        t("qr_scanner.error"),
        error.message || t("qr_scanner.attendance_failed"),
        [{ text: t("common.ok"), onPress: resetScanner }]
      );
    } finally {
      setProcessing(false);
    }
  };

  const getScanSuccessMessage = (result: QRScanResult): string => {
    const { scannedUser } = result;
    return t("qr_scanner.user_scanned", {
      name: scannedUser.name,
      bloodGroup: formatBloodGroup(scannedUser.bloodGroup),
      donations: scannedUser.totalDonations,
      badge: scannedUser.donationBadge,
    });
  };

  const getAttendanceSuccessMessage = (result: AttendanceMarkResult): string => {
    return t("qr_scanner.attendance_success", {
      status: result.status,
      points: result.pointsEarned || 0,
    });
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
        <View style={styles.permissionContainer}>
          <ActivityIndicator size="large" color="#667eea" />
          <Text style={styles.permissionText}>{t("qr_scanner.requesting_permission")}</Text>
        </View>
      </Modal>
    );
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#999" />
          <Text style={styles.permissionTitle}>{t("qr_scanner.camera_permission_required")}</Text>
          <Text style={styles.permissionText}>{t("qr_scanner.camera_permission_message")}</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>{t("qr_scanner.grant_permission")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeButtonText}>{t("common.close")}</Text>
          </TouchableOpacity>
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
          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "transparent"]}
            style={styles.header}
          >
            <TouchableOpacity style={styles.headerButton} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t("qr_scanner.scan_qr_code")}</Text>
            <TouchableOpacity style={styles.headerButton} onPress={toggleFlash}>
              <Ionicons 
                name={flashEnabled ? "flash" : "flash-off"} 
                size={24} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </LinearGradient>

          {/* Scanning Frame */}
          <View style={styles.scanningContainer}>
            <View style={styles.scanningFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            
            <Text style={styles.scanInstruction}>
              {processing ? t("qr_scanner.processing") : t("qr_scanner.align_qr_code")}
            </Text>

            {campaignId && (
              <View style={styles.campaignInfo}>
                <Text style={styles.campaignInfoText}>
                  {t("qr_scanner.campaign_mode")}
                </Text>
              </View>
            )}
          </View>

          {/* Processing Indicator */}
          {processing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.processingText}>{t("qr_scanner.processing")}</Text>
            </View>
          )}

          {/* Footer */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.footer}
          >
            <View style={styles.footerContent}>
              <Text style={styles.footerText}>
                {t("qr_scanner.scan_instruction")}
              </Text>
              
              {scanned && !processing && (
                <TouchableOpacity style={styles.retryButton} onPress={resetScanner}>
                  <Text style={styles.retryButtonText}>{t("qr_scanner.scan_again")}</Text>
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
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
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
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
    borderColor: "#667eea",
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
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    marginHorizontal: 40,
  },
  campaignInfo: {
    backgroundColor: "rgba(102, 126, 234, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 20,
  },
  campaignInfoText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  processingText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  footerContent: {
    alignItems: "center",
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    opacity: 0.8,
  },
  retryButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 16,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  closeButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "600",
  },
});
