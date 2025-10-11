import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
  Share,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";

import { qrService, QRCodeData } from "../../../services/qrService";
import { userService, UserProfile } from "../../../services/userService";
import { useAuth } from "../../../context/AuthContext";
import { useLanguage } from "../../../context/LanguageContext";

interface UserQRModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

export default function UserQRModal({ visible, onClose }: UserQRModalProps) {
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [qrRef, setQrRef] = useState<any>(null);

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (visible && user) {
      loadQRData();
      loadUserProfile();
    }
  }, [visible, user]);

  const loadQRData = async () => {
    try {
      setLoading(true);
      const data = await qrService.generateUserQR();
      setQrData(data);
    } catch (error) {
      console.error("Failed to load QR data:", error);
      Alert.alert(
        t("qr.error_title"),
        t("qr.load_error"),
        [{ text: t("common.ok") }]
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async () => {
    try {
      const profile = await userService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load user profile:", error);
    }
  };

  const refreshQRCode = async () => {
    try {
      setRefreshing(true);
      await loadQRData();
    } catch (error) {
      Alert.alert(
        t("qr.error_title"),
        t("qr.refresh_error"),
        [{ text: t("common.ok") }]
      );
    } finally {
      setRefreshing(false);
    }
  };

  const saveQRCode = async () => {
    try {
      if (!qrRef) {
        Alert.alert(
          t("qr.error_title"),
          t("qr.save_error"),
          [{ text: t("common.ok") }]
        );
        return;
      }

      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          t("qr.permission_required"),
          t("qr.permission_message"),
          [{ text: t("common.ok") }]
        );
        return;
      }

      // Get QR code as base64
      qrRef.toDataURL((dataURL: string) => {
        const filename = `DropsOfHope_QR_${user?.name?.replace(/\s+/g, "_")}_${Date.now()}.png`;
        const documentDir = (FileSystem as any).documentDirectory;
        const path = `${documentDir}${filename}`;

        // Convert base64 to file
        FileSystem.writeAsStringAsync(path, dataURL.split(',')[1], {
          encoding: "base64",
        }).then(() => {
          // Save to media library
          return MediaLibrary.saveToLibraryAsync(path);
        }).then(() => {
          Alert.alert(
            t("qr.save_success_title"),
            t("qr.save_success_message"),
            [{ text: t("common.ok") }]
          );
        }).catch((error) => {
          console.error("Failed to save QR code:", error);
          Alert.alert(
            t("qr.error_title"),
            t("qr.save_error"),
            [{ text: t("common.ok") }]
          );
        });
      });
    } catch (error) {
      console.error("Failed to save QR code:", error);
      Alert.alert(
        t("qr.error_title"),
        t("qr.save_error"),
        [{ text: t("common.ok") }]
      );
    }
  };

  const shareQRCode = async () => {
    try {
      if (!qrRef || !userProfile) return;

      qrRef.toDataURL(async (dataURL: string) => {
        const filename = `DropsOfHope_QR_${userProfile.name.replace(/\s+/g, "_")}.png`;
        const cacheDir = (FileSystem as any).cacheDirectory;
        const path = `${cacheDir}${filename}`;

        await FileSystem.writeAsStringAsync(path, dataURL.split(',')[1], {
          encoding: "base64",
        });

        await Share.share({
          url: path,
          title: t("qr.share_title"),
          message: t("qr.share_message", { name: userProfile.name }),
        });
      });
    } catch (error) {
      console.error("Failed to share QR code:", error);
      Alert.alert(
        t("qr.error_title"),
        t("qr.share_error"),
        [{ text: t("common.ok") }]
      );
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toUpperCase()) {
      case "BRONZE":
        return "#CD7F32";
      case "SILVER":
        return "#C0C0C0";
      case "GOLD":
        return "#FFD700";
      case "PLATINUM":
        return "#E5E4E2";
      case "DIAMOND":
        return "#B9F2FF";
      default:
        return "#CD7F32";
    }
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    const colors: Record<string, string> = {
      "A_POSITIVE": "#FF6B6B",
      "A_NEGATIVE": "#FF8E53",
      "B_POSITIVE": "#4ECDC4",
      "B_NEGATIVE": "#45B7D1",
      "AB_POSITIVE": "#96CEB4",
      "AB_NEGATIVE": "#FFEAA7",
      "O_POSITIVE": "#DDA0DD",
      "O_NEGATIVE": "#98D8C8",
    };
    return colors[bloodGroup] || "#FF6B6B";
  };

  const formatBloodGroup = (bloodGroup: string) => {
    return bloodGroup.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-");
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={["#667eea", "#764ba2"]}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("qr.my_qr_code")}</Text>
          <TouchableOpacity style={styles.refreshButton} onPress={refreshQRCode} disabled={refreshing}>
            <Ionicons 
              name="refresh" 
              size={24} 
              color="#FFFFFF" 
              style={refreshing ? { opacity: 0.5 } : {}}
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>{t("qr.generating")}</Text>
          </View>
        ) : (
          <View style={styles.content}>
            {/* User Info Card */}
            {userProfile && (
              <View style={styles.userCard}>
                <View style={styles.userInfo}>
                  <View style={styles.avatarContainer}>
                    {userProfile.profileImageUrl ? (
                      <Image source={{ uri: userProfile.profileImageUrl }} style={styles.avatar} />
                    ) : (
                      <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarText}>
                          {userProfile.name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View style={[styles.badge, { backgroundColor: getBadgeColor(userProfile.donationBadge) }]}>
                      <Text style={styles.badgeText}>{userProfile.donationBadge}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{userProfile.name}</Text>
                    <View style={styles.bloodGroupContainer}>
                      <View style={[styles.bloodGroupBadge, { backgroundColor: getBloodGroupColor(userProfile.bloodGroup) }]}>
                        <Text style={styles.bloodGroupText}>
                          {formatBloodGroup(userProfile.bloodGroup)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.donationCount}>
                      {t("qr.donations_count", { count: userProfile.totalDonations })}
                    </Text>
                    <Text style={styles.points}>
                      {t("qr.points_count", { points: userProfile.totalPoints })}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* QR Code */}
            {qrData && (
              <View style={styles.qrContainer}>
                <View style={styles.qrCodeWrapper}>
                  <QRCode
                    value={qrData.userId}
                    size={200}
                    color="#000000"
                    backgroundColor="#FFFFFF"
                    logo={require("../../../../assets/logo.png")}
                    logoSize={40}
                    logoBackgroundColor="transparent"
                    getRef={(c) => setQrRef(c)}
                  />
                </View>
                <Text style={styles.qrDescription}>
                  {t("qr.scan_instruction")}
                </Text>
                <Text style={styles.qrId}>
                  ID: {qrData.userId.slice(0, 8)}...
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton} onPress={saveQRCode}>
                <Ionicons name="download-outline" size={24} color="#667eea" />
                <Text style={styles.actionButtonText}>{t("qr.save")}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} onPress={shareQRCode}>
                <Ionicons name="share-outline" size={24} color="#667eea" />
                <Text style={styles.actionButtonText}>{t("qr.share")}</Text>
              </TouchableOpacity>
            </View>

            {/* Instructions */}
            <View style={styles.instructions}>
              <Text style={styles.instructionsTitle}>{t("qr.how_to_use")}</Text>
              <Text style={styles.instructionText}>
                • {t("qr.instruction_1")}
              </Text>
              <Text style={styles.instructionText}>
                • {t("qr.instruction_2")}
              </Text>
              <Text style={styles.instructionText}>
                • {t("qr.instruction_3")}
              </Text>
            </View>
          </View>
        )}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  refreshButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 16,
    fontSize: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  avatarPlaceholder: {
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  badge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  bloodGroupContainer: {
    marginVertical: 4,
  },
  bloodGroupBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bloodGroupText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  donationCount: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  points: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  qrCodeWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  qrDescription: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  qrId: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 100,
  },
  actionButtonText: {
    color: "#667eea",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  instructions: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  instructionsTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  instructionText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});
