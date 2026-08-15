import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, StyleSheet, Alert, ActivityIndicator, Animated, Share } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import QRCode from "react-native-qrcode-svg";
import { Download, Share2, Droplet } from "lucide-react-native";

import { qrService, QRCodeData } from "../../../services/qrService";
import { userService, UserProfile } from "../../../services/userService";
import { useLanguage } from "../../../context/LanguageContext";
import { Sheet, Surface, Text, Icon, Badge, UserAvatar, DropMark, useTheme } from "../../../design";
import type { BadgeTier } from "../../../design";
import { ageFromNic } from "../../../utils/nic";

import { logger } from "../../../utils/logger";

interface DonorIdCardProps {
  visible: boolean;
  onClose: () => void;
}

const CARD_HEIGHT = 420;

export default function DonorIdCard({ visible, onClose }: DonorIdCardProps) {
  const theme = useTheme();
  const { t } = useLanguage();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [qrRef, setQrRef] = useState<any>(null);

  const flip = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setFlipped(false);
    flip.setValue(0);
    loadData();
  }, [visible]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, qr] = await Promise.all([userService.getUserProfile(), qrService.generateUserQR()]);
      setProfile(profileData);
      setQrData(qr);
    } catch (error) {
      logger.error("Failed to load donor ID card:", error);
      Alert.alert(t("id_card.title"), t("id_card.load_error"), [{ text: t("common.ok") }]);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => {
    Animated.spring(flip, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const formatBloodGroup = (bloodGroup: string) => bloodGroup.replace("_", " ").replace("POSITIVE", "+").replace("NEGATIVE", "-");

  const saveCard = async () => {
    try {
      if (!qrRef) return;
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("id_card.permission_required"), t("id_card.permission_message"), [{ text: t("common.ok") }]);
        return;
      }

      qrRef.toDataURL((dataURL: string) => {
        const filename = `DropsOfHope_ID_${profile?.name?.replace(/\s+/g, "_")}_${Date.now()}.png`;
        const documentDir = (FileSystem as any).documentDirectory;
        const path = `${documentDir}${filename}`;

        FileSystem.writeAsStringAsync(path, dataURL.split(",")[1], { encoding: "base64" })
          .then(() => MediaLibrary.saveToLibraryAsync(path))
          .then(() => {
            Alert.alert(t("id_card.save_success_title"), t("id_card.save_success_message"), [{ text: t("common.ok") }]);
          })
          .catch((error) => {
            logger.error("Failed to save donor ID:", error);
            Alert.alert(t("id_card.title"), t("id_card.save_error"), [{ text: t("common.ok") }]);
          });
      });
    } catch (error) {
      logger.error("Failed to save donor ID:", error);
      Alert.alert(t("id_card.title"), t("id_card.save_error"), [{ text: t("common.ok") }]);
    }
  };

  const shareCard = async () => {
    try {
      if (!qrRef || !qrData) return;
      qrRef.toDataURL(async (dataURL: string) => {
        const filename = `DropsOfHope_ID_${profile?.name?.replace(/\s+/g, "_")}.png`;
        const cacheDir = (FileSystem as any).cacheDirectory;
        const path = `${cacheDir}${filename}`;
        await FileSystem.writeAsStringAsync(path, dataURL.split(",")[1], { encoding: "base64" });
        await Share.share({ url: path, title: t("id_card.title") });
      });
    } catch (error) {
      logger.error("Failed to share donor ID:", error);
      Alert.alert(t("id_card.title"), t("id_card.share_error"), [{ text: t("common.ok") }]);
    }
  };

  const frontRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] });
  const backRotate = flip.interpolate({ inputRange: [0, 1], outputRange: ["180deg", "360deg"] });

  const age = profile ? ageFromNic(profile.nic) : null;
  const badgeTier = (profile?.donationBadge?.toUpperCase() as BadgeTier) || "BRONZE";

  return (
    <Sheet visible={visible} onClose={onClose} title={t("id_card.title")} scroll={false}>
      {loading || !profile ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color={theme.color.crimson} />
        </View>
      ) : (
        <View>
          <Pressable onPress={handleFlip} style={styles.cardWrap}>
            <Animated.View
              style={[
                styles.face,
                { borderColor: theme.color.hairline, backgroundColor: theme.color.surface, transform: [{ rotateY: frontRotate }] },
              ]}
            >
              <View>
                <View style={styles.brandRow}>
                  <DropMark size={16} color={theme.color.crimson} filled />
                  <Text variant="overline" tone="crimson">
                    {t("id_card.brand")}
                  </Text>
                </View>

                <View style={styles.identityRow}>
                  <UserAvatar url={profile.profileImageUrl} name={profile.name} seed={profile.id} size={72} />
                  <View style={styles.identityInfo}>
                    <Text variant="h3" numberOfLines={1}>
                      {profile.name}
                    </Text>
                    <View style={styles.bloodRow}>
                      <Icon icon={Droplet} size={16} color={theme.color.crimson} />
                      <Text variant="h2" tone="crimson">
                        {formatBloodGroup(profile.bloodGroup)}
                      </Text>
                    </View>
                    <Badge tier={badgeTier} label={profile.donationBadge} size="sm" />
                  </View>
                </View>

                <View style={[styles.detailsRow, { borderTopColor: theme.color.hairline }]}>
                  {age !== null ? (
                    <DetailCell label={t("id_card.age")} value={t("id_card.years", { age })} />
                  ) : null}
                  <DetailCell label={t("id_card.nic")} value={profile.nic || "—"} />
                  <DetailCell label={t("id_card.id_number")} value={profile.id.slice(0, 8).toUpperCase()} />
                </View>
              </View>

              <Text variant="caption" tone="inkFaint" align="center" style={styles.hint}>
                {t("id_card.tap_to_flip")}
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.face,
                styles.faceBack,
                { borderColor: theme.color.hairline, backgroundColor: theme.color.surface, transform: [{ rotateY: backRotate }] },
              ]}
            >
              <View style={styles.backContent}>
                {qrData ? (
                  <View style={styles.qrWrap}>
                    <Surface tone="surface" padding="md">
                      <QRCode
                        value={qrData.userId}
                        size={140}
                        color={theme.color.ink}
                        backgroundColor={theme.color.surface}
                        logo={require("../../../../assets/logo.png")}
                        logoSize={26}
                        logoMargin={6}
                        logoBorderRadius={6}
                        logoBackgroundColor={theme.color.surface}
                        getRef={(c) => setQrRef(c)}
                      />
                    </Surface>
                    <Text variant="caption" tone="inkMuted" align="center" style={styles.scanHint}>
                      {t("id_card.scan_instruction")}
                    </Text>
                  </View>
                ) : null}

                <View style={[styles.detailsColumn, { borderTopColor: theme.color.hairline }]}>
                  <View style={styles.detailsRowCompact}>
                    <DetailCell label={t("id_card.nic")} value={profile.nic || "—"} />
                    <DetailCell label={t("id_card.id_number")} value={profile.id.slice(0, 8).toUpperCase()} />
                  </View>
                  <DetailCell
                    label={t("id_card.address")}
                    value={profile.userDetails?.address || "—"}
                    full
                  />
                  <DetailCell
                    label={t("id_card.emergency_contact")}
                    value={profile.userDetails?.emergencyContact || "—"}
                    full
                  />
                </View>
              </View>

              <Text variant="caption" tone="inkFaint" align="center" style={styles.hint}>
                {t("id_card.tap_to_flip")}
              </Text>
            </Animated.View>
          </Pressable>

          <View style={styles.actionRow}>
            <Surface tone="sunken" padding="md" style={styles.actionButton} bordered={false}>
              <ActionItem icon={Download} label={t("id_card.save")} onPress={saveCard} />
            </Surface>
            <Surface tone="sunken" padding="md" style={styles.actionButton} bordered={false}>
              <ActionItem icon={Share2} label={t("id_card.share")} onPress={shareCard} />
            </Surface>
          </View>
        </View>
      )}
    </Sheet>
  );
}

const DetailCell: React.FC<{ label: string; value: string; full?: boolean }> = ({ label, value, full }) => (
  <View style={full ? styles.detailCellFull : styles.detailCell}>
    <Text variant="caption" tone="inkMuted">
      {label}
    </Text>
    <Text variant="label" numberOfLines={full ? 2 : 1}>
      {value}
    </Text>
  </View>
);

const ActionItem: React.FC<{ icon: any; label: string; onPress: () => void }> = ({ icon, label, onPress }) => {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={{ alignItems: "center" }}>
      <Icon icon={icon} size={20} color={theme.color.crimson} />
      <Text variant="caption" tone="crimson" style={{ marginTop: 6 }}>
        {label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  loadingWrap: { alignItems: "center", paddingVertical: 60 },
  cardWrap: { height: CARD_HEIGHT },
  face: {
    position: "absolute",
    width: "100%",
    height: CARD_HEIGHT,
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    backfaceVisibility: "hidden",
    justifyContent: "space-between",
  },
  faceBack: { alignItems: "center" },
  backContent: { width: "100%" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  identityRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
  identityInfo: { flex: 1, gap: 4 },
  bloodRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  detailsRow: { flexDirection: "row", borderTopWidth: 1.5, paddingTop: 12, gap: 16 },
  detailsColumn: { width: "100%", borderTopWidth: 1.5, paddingTop: 12, gap: 10 },
  detailsRowCompact: { flexDirection: "row", gap: 16 },
  detailCell: { flex: 1, gap: 2 },
  detailCellFull: { width: "100%", gap: 2 },
  hint: { marginTop: 10 },
  qrWrap: { alignItems: "center", marginBottom: 12 },
  scanHint: { marginTop: 10, maxWidth: 200 },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 20, marginBottom: 8 },
  actionButton: { flex: 1, alignItems: "center" },
});
