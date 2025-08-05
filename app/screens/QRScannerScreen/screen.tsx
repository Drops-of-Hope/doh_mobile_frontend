import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the param list for the stack navigator
type QRScannerStackParamList = {
  QRScannerScreen: { campaignId: string };
  // Add other screens if needed
};

interface QRScannerScreenProps {
  navigation?: NativeStackNavigationProp<QRScannerStackParamList, 'QRScannerScreen'>;
  route?: {
    params: {
      campaignId: string;
    };
  };
}

interface AttendanceData {
  userId: string;
  userName: string;
  userEmail: string;
  bloodType: string;
  isWalkIn: boolean;
  screeningPassed: boolean;
  timestamp: string;
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

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    setScanned(true);

    try {
      const parsedData = JSON.parse(data);

      if (parsedData.userId && parsedData.userName && parsedData.userEmail) {
        Alert.alert(
          "QR Code Scanned",
          `User: ${parsedData.userName}\nEmail: ${parsedData.userEmail}`,
          [
            {
              text: "Mark Attendance",
              onPress: () => {
                Alert.alert("Success", "Attendance marked successfully");
                setScanned(false);
              },
            },
            {
              text: "Cancel",
              onPress: () => setScanned(false),
              style: "cancel",
            },
          ],
        );
      } else {
        Alert.alert("Invalid QR Code", "Please scan a valid donor QR code");
        setScanned(false);
      }
    } catch (error) {
      Alert.alert("Invalid QR Code", "Could not read QR code data");
      setScanned(false);
    }
  };

  const handleBack = () => navigation?.goBack();

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
        onAdd={() => {}}
      />

      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
  },
});
