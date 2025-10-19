import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Alert, View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";
import { qrService, QRScanRequest } from "../../services/qrService";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

export default function QRScannerScreen({
  navigation,
  route,
}: QRScannerScreenProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { campaignId } = route?.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedUser, setScannedUser] = useState<ScannedUser | null>(null);

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
      console.log("🔍 QR SCAN DEBUG: Raw scanned data:", data);
      
      let userId: string;
      let donorData: any = null;

      // Try to parse as JSON first (new donor format)
      try {
        const parsedData = JSON.parse(data);
        console.log("🔍 QR SCAN DEBUG: Successfully parsed as JSON:", parsedData);
        
        // Check if it's the expected donor format: {name, email, uid, timestamp}
        if (parsedData.uid && parsedData.name && parsedData.email) {
          userId = parsedData.uid;
          donorData = {
            name: parsedData.name,
            email: parsedData.email,
            uid: parsedData.uid,
            timestamp: parsedData.timestamp
          };
          console.log("🔍 QR SCAN DEBUG: Extracted userId from donor QR:", userId);
        } else {
          throw new Error("Invalid JSON format - missing required fields");
        }
      } catch (jsonError: any) {
        console.log("🔍 QR SCAN DEBUG: JSON parse failed, trying legacy UUID format:", jsonError.message);
        // Fallback to old format - direct UUID string
        if (data && data.length >= 36) {
          userId = data;
          console.log("🔍 QR SCAN DEBUG: Using legacy UUID format:", userId);
        } else {
          throw new Error("Invalid QR data format");
        }
      }

      if (!userId) {
        throw new Error("Could not extract user ID from QR code");
      }

      console.log("🔍 QR SCAN DEBUG: Final userId to send to API:", userId);

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

      console.log("🔍 QR SCAN DEBUG: Full request payload:", scanRequest);

      const scanResult = await qrService.scanQR(scanRequest);

      if (scanResult.success) {
        setScannedUser(scanResult.scannedUser);
        
        // Show confirmation dialog with user information
        Alert.alert(
          "Donor Identified",
          `Name: ${scanResult.scannedUser.name}\n` +
          `Blood Group: ${scanResult.scannedUser.bloodGroup}\n` +
          `Total Donations: ${scanResult.scannedUser.totalDonations}\n` +
          `Badge: ${scanResult.scannedUser.donationBadge}\n` +
          `Eligible: ${scanResult.scannedUser.eligibleToDonate ? 'Yes' : 'No'}`,
          [
            {
              text: "Mark Attendance",
              onPress: () => handleMarkAttendance(scanResult.scannedUser.id),
              style: scanResult.scannedUser.eligibleToDonate ? "default" : "destructive",
            },
            {
              text: "Cancel",
              onPress: () => resetScanner(),
              style: "cancel",
            },
          ],
        );
      } else {
        Alert.alert("Scan Failed", scanResult.message || "Could not verify donor");
        resetScanner();
      }
    } catch (error) {
      console.error("QR Scan error:", error);
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
      console.error("Mark attendance error:", error);
      Alert.alert("Error", "Failed to mark attendance. Please try again.");
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
      <SafeAreaView style={styles.container}>
        <DashboardHeader
          title="QR Scanner"
          onBack={handleBack}
          onAdd={() => {}}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <DashboardHeader
        title="QR Scanner"
        onBack={handleBack}
        onAdd={undefined}
      />

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        
        {/* Overlay with scanning frame */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.instructionText}>
            Point camera at donor's QR code
          </Text>
          
          {/* Manual search button */}
          <TouchableOpacity style={styles.manualSearchButton} onPress={handleManualSearch}>
            <Text style={styles.manualSearchText}>Manual Search</Text>
          </TouchableOpacity>
          
          {/* Processing overlay */}
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.processingText}>Processing QR Code...</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
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
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#fff",
    borderRadius: 20,
    backgroundColor: "transparent",
  },
  instructionText: {
    position: "absolute",
    bottom: 100,
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
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
  processingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "500",
  },
  manualSearchButton: {
    position: "absolute",
    bottom: 40,
    backgroundColor: "#DC2626",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  manualSearchText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
