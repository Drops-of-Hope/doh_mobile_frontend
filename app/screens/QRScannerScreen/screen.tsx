import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import Svg, { Path } from "react-native-svg";
import { Search, Droplet, CheckCircle2, XCircle } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { qrService, QRScanRequest } from "../../services/qrService";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppBar, Sheet, Surface, Text, Button, Icon, useTheme } from "../../design";

import { logger } from "../../utils/logger";
// Define the param list for the stack navigator
type QRScannerStackParamList = {
  QRScannerScreen: { campaignId: string };
  ManualSearch: { campaignId: string };
  CampaignDashboard: undefined;
};

interface QRScannerScreenProps {
  navigation?: NativeStackNavigationProp<QRScannerStackParamList, 'QRScannerScreen'>;
  route?: {
    params: {
      campaignId: string;
    };
  };
}

interface ScannedUser {
  id: string;
  name: string;
  bloodGroup: string;
  totalDonations: number;
  donationBadge: string;
  eligibleToDonate: boolean;
}

// Ink-colored corner-bracket reticle — crisp lines, no gradients/shadows.
const ScanReticle: React.FC<{ size: number; color: string }> = ({ size, color }) => {
  const bracket = size * 0.16;
  const stroke = 3;
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* top-left */}
      <Path
        d={`M ${stroke / 2} ${bracket} V ${stroke / 2} H ${bracket}`}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      {/* top-right */}
      <Path
        d={`M ${size - bracket} ${stroke / 2} H ${size - stroke / 2} V ${bracket}`}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      {/* bottom-left */}
      <Path
        d={`M ${stroke / 2} ${size - bracket} V ${size - stroke / 2} H ${bracket}`}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
      {/* bottom-right */}
      <Path
        d={`M ${size - bracket} ${size - stroke / 2} H ${size - stroke / 2} V ${size - bracket}`}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        fill="none"
      />
    </Svg>
  );
};

export default function QRScannerScreen({
  navigation,
  route,
}: QRScannerScreenProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { campaignId } = route?.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);
  const [sheetVisible, setSheetVisible] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      let userId: string;
      let donorData: any = null;

      // Try to parse as JSON first (new donor format)
      try {
        const parsedData = JSON.parse(data);

        // Check if it's the expected donor format: {name, email, uid, timestamp}
        if (parsedData.uid && parsedData.name && parsedData.email) {
          userId = parsedData.uid;
          donorData = {
            name: parsedData.name,
            email: parsedData.email,
            uid: parsedData.uid,
            timestamp: parsedData.timestamp
          };
        } else {
          throw new Error("Invalid JSON format - missing required fields");
        }
      } catch (jsonError: any) {
        // Fallback to old format - direct UUID string
        if (data && data.length >= 36) {
          userId = data;
        } else {
          throw new Error("Invalid QR data format");
        }
      }

      if (!userId) {
        throw new Error("Could not extract user ID from QR code");
      }

      // Try to scan the QR code through the backend
      const scanRequest: QRScanRequest = {
        qrData: userId, // Send the extracted user ID, not the raw data
        campaignId: campaignId,
        scanType: "CAMPAIGN_ATTENDANCE",
        metadata: {
          scannerUserId: user?.sub,
          scanLocation: "QR_SCANNER",
          timestamp: new Date().toISOString(),
          donorInfo: donorData, // Include parsed donor data if available
        },
      };

      const scanResult = await qrService.scanQR(scanRequest);

      if (scanResult.success) {
        setScannedUser(scanResult.scannedUser);
        setSheetVisible(true);
      } else {
        Alert.alert("Scan Failed", scanResult.message || "Could not verify donor");
        resetScanner();
      }
    } catch (error) {
      logger.error("QR Scan error:", error);
      Alert.alert("Error", "Failed to process QR code. Please try again.");
      resetScanner();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkAttendance = async (userId: string) => {
    try {
      setIsProcessing(true);

      // Use QR attendance endpoint: backend needs only campaignId + qrData (raw UUID is recommended)
      await qrService.markAttendance({
        campaignId: campaignId!,
        userId: userId,
        notes: `QR scan by ${user?.sub || "unknown"}`,
        // Send raw userId as qrData; backend accepts raw UUID or JSON string with uid/userId/scannedUserId
        qrData: userId,
      });

      setSheetVisible(false);
      Alert.alert(
        "Success",
        "Attendance marked successfully!",
        [
          {
            text: "OK",
            onPress: () => resetScanner(),
          },
        ],
      );
    } catch (error) {
      logger.error("Mark attendance error:", error);
      Alert.alert("Error", "Failed to mark attendance. Please try again.");
      setSheetVisible(false);
      resetScanner();
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScannedUser(null);
    setIsProcessing(false);
  };

  const handleCloseSheet = () => {
    setSheetVisible(false);
    resetScanner();
  };

  const handleBack = () => navigation?.goBack();

  const handleManualSearch = () => {
    if (campaignId) {
      navigation?.navigate("ManualSearch", { campaignId });
    } else {
      Alert.alert("Error", "Campaign ID not available");
    }
  };

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.color.paper }} edges={["top"]}>
        <AppBar title="QR Scanner" onBack={handleBack} />
        <View style={styles.permissionWrap}>
          <Text variant="body" tone="inkMuted" align="center">
            Camera access is required to scan donor QR codes.
          </Text>
          <View style={{ marginTop: theme.space.lg, width: "60%" }}>
            <Button title="Grant Permission" onPress={requestPermission} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }} edges={["top"]}>
      <AppBar title="QR Scanner" onBack={handleBack} transparent />

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />

        {/* Overlay with scanning frame */}
        <View style={styles.overlay} pointerEvents="box-none">
          <ScanReticle size={250} color={theme.color.paper} />
          <Text variant="body" tone="inverse" align="center" style={styles.instructionText}>
            Point camera at donor's QR code
          </Text>

          {/* Manual search button */}
          <Pressable style={styles.manualSearchButton} onPress={handleManualSearch}>
            <Icon icon={Search} size={16} color={theme.color.inverse} />
            <Text variant="bodyBold" tone="inverse">
              Manual Search
            </Text>
          </Pressable>

          {/* Processing overlay */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={theme.color.paper} />
              <Text variant="body" tone="inverse" style={{ marginTop: 16 }}>
                Processing QR Code...
              </Text>
            </View>
          )}
        </View>
      </View>

      <Sheet visible={sheetVisible} onClose={handleCloseSheet} title="Donor Identified">
        {scannedUser ? (
          <View>
            <Surface style={{ marginBottom: theme.space.lg }}>
              <Text variant="h3" style={{ marginBottom: theme.space.sm }}>
                {scannedUser.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.space.sm, marginBottom: 6 }}>
                <Icon icon={Droplet} size={16} color={theme.color.crimson} />
                <Text variant="body" tone="inkMuted">
                  {scannedUser.bloodGroup} · {scannedUser.totalDonations} donations · {scannedUser.donationBadge}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: theme.space.sm }}>
                <Icon
                  icon={scannedUser.eligibleToDonate ? CheckCircle2 : XCircle}
                  size={16}
                  color={scannedUser.eligibleToDonate ? theme.color.success : theme.color.danger}
                />
                <Text variant="body" tone={scannedUser.eligibleToDonate ? "success" : "danger"}>
                  {scannedUser.eligibleToDonate ? "Eligible to donate" : "Not eligible to donate"}
                </Text>
              </View>
            </Surface>

            <Button
              title="Mark Attendance"
              variant={scannedUser.eligibleToDonate ? "solid" : "danger"}
              onPress={() => handleMarkAttendance(scannedUser.id)}
              loading={isProcessing}
            />
            <View style={{ marginTop: theme.space.md }}>
              <Button title="Cancel" variant="ghost" onPress={handleCloseSheet} />
            </View>
          </View>
        ) : null}
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  permissionWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  instructionText: {
    position: "absolute",
    bottom: 100,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  manualSearchButton: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#C0362C",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
