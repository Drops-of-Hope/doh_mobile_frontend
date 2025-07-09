import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

interface QRScannerProps {
  navigation?: any;
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

const QRScannerScreen: React.FC<QRScannerProps> = ({ navigation, route }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { campaignId } = route?.params || {};
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState<AttendanceData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    try {
      // Parse the QR code data
      const parsedData = JSON.parse(data);
      
      // Validate the QR code structure
      if (parsedData.userId && parsedData.userName && parsedData.userEmail) {
        setScanData({
          userId: parsedData.userId,
          userName: parsedData.userName,
          userEmail: parsedData.userEmail,
          bloodType: parsedData.bloodType || 'Unknown',
          isWalkIn: parsedData.isWalkIn || false,
          screeningPassed: false, // Will be updated after confirmation
          timestamp: new Date().toISOString(),
        });
        setShowConfirmModal(true);
      } else {
        Alert.alert(t('campaign.invalid_qr'), t('campaign.invalid_qr_msg'));
        setScanned(false);
      }
    } catch (error) {
      Alert.alert(t('campaign.invalid_qr'), 'Unable to read QR code data.');
      setScanned(false);
    }
  };

  const handleMarkAttendance = async (screeningPassed: boolean) => {
    if (!scanData) return;

    try {
      // Update the attendance data
      const attendanceData = {
        ...scanData,
        screeningPassed,
        campaignId,
        timestamp: new Date().toISOString(),
      };

      // Here you would typically send this data to your backend
      console.log('Marking attendance:', attendanceData);

      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShowConfirmModal(false);
      setScanData(null);
      
      Alert.alert(
        t('campaign.attendance_marked'),
        `${scanData.userName} ${screeningPassed ? t('campaign.screening_passed_msg') : t('campaign.screening_failed_msg')}.`,
        [
          {
            text: t('common.ok'),
            onPress: () => setScanned(false),
          },
        ]
      );
    } catch (error) {
      Alert.alert(t('common.error'), 'Failed to mark attendance. Please try again.');
      setScanned(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setScanData(null);
    setShowConfirmModal(false);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color="#64748B" />
          <Text style={styles.permissionTitle}>{t('campaign.camera_permission')}</Text>
          <Text style={styles.permissionText}>
            {t('campaign.camera_permission_msg')}
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>{t('campaign.grant_permission')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('campaign.scan_qr')}</Text>
        <TouchableOpacity
          onPress={() => setFlashOn(!flashOn)}
          style={styles.flashButton}
        >
          <Ionicons name={flashOn ? "flash" : "flash-off"} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          flash={flashOn ? "on" : "off"}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          {/* Scanner Overlay */}
          <View style={styles.scannerOverlay}>
            <View style={styles.scannerFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </CameraView>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>{t('campaign.position_qr')}</Text>
        <Text style={styles.instructionText}>
          {t('campaign.align_qr')}
        </Text>
        
        {scanned && (
          <TouchableOpacity style={styles.resetButton} onPress={resetScanner}>
            <Ionicons name="refresh" size={20} color="#FF4757" />
            <Text style={styles.resetButtonText}>{t('campaign.scan_again')}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="person-circle-outline" size={48} color="#FF4757" />
              <Text style={styles.modalTitle}>{t('campaign.confirm_attendance')}</Text>
            </View>
            
            {scanData && (
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{scanData.userName}</Text>
                <Text style={styles.userEmail}>{scanData.userEmail}</Text>
                <Text style={styles.userBloodType}>Blood Type: {scanData.bloodType}</Text>
                {scanData.isWalkIn && (
                  <View style={styles.walkInBadge}>
                    <Text style={styles.walkInText}>{t('campaign.walk_in')}</Text>
                  </View>
                )}
              </View>
            )}
            
            <Text style={styles.modalQuestion}>{t('campaign.screening_question')}</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.failButton]}
                onPress={() => handleMarkAttendance(false)}
              >
                <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>{t('campaign.failed')}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.passButton]}
                onPress={() => handleMarkAttendance(true)}
              >
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                <Text style={styles.modalButtonText}>{t('campaign.passed')}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowConfirmModal(false)}
            >
              <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  flashButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FF4757',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  instructions: {
    padding: 20,
    alignItems: 'center',
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF4757',
  },
  resetButtonText: {
    color: '#FF4757',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: width - 40,
    alignItems: 'center',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 12,
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  userBloodType: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  walkInBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  walkInText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalQuestion: {
    fontSize: 16,
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
  },
  failButton: {
    backgroundColor: '#EF4444',
  },
  passButton: {
    backgroundColor: '#10B981',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default QRScannerScreen;
