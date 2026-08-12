import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

// Import components
import CampaignStatsComponent from "../shared/organisms/CampaignStatsComponent";
import QRScannerModal from "../shared/organisms/QRScannerModal";

// Import services
import { campaignService } from "../../services/campaignService";
import { qrService, QRScanResult } from "../../services/qrService";
import { badgeService } from "../../services/badgeService";

// Import context
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

// Import utilities
import { getDatabaseUserId } from "../../utils/userIdUtils";
import { ORGANIZER_BADGE_DISPLAY } from "../../../constants/badgeDisplay";
import BadgeChip from "../shared/atoms/BadgeChip";

import { logger } from "../../utils/logger";
interface CampaignOrganizerDashboardProps {
  navigation?: any;
  route?: {
    params?: {
      campaignId?: string;
    };
  };
}

export default function CampaignOrganizerDashboard({
  navigation,
  route,
}: CampaignOrganizerDashboardProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    route?.params?.campaignId || null
  );
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizerBadge, setOrganizerBadge] = useState<{ label: string; color: string; icon: string } | null>(null);

  const { user, hasRole } = useAuth();
  const { t } = useLanguage();

  // Define user roles locally
  const USER_ROLES = {
    CAMP_ORGANIZER: "CAMP_ORGANIZER",
    ADMIN: "ADMIN",
    USER: "USER",
  };

  useEffect(() => {
    if (!hasRole(USER_ROLES.CAMP_ORGANIZER)) {
      Alert.alert(t("dashboard.access_denied"), t("dashboard.organizer_only"), [
        { text: t("common.ok"), onPress: () => navigation?.goBack() },
      ]);
      return;
    }

    loadMyCampaigns();
    loadOrganizerBadge();
  }, []);

  const loadOrganizerBadge = async () => {
    try {
      const databaseUserId = await getDatabaseUserId();
      if (!databaseUserId) return;

      const badgeInfo = await badgeService.getOrganizerBadgeInfo(databaseUserId);
      const display = ORGANIZER_BADGE_DISPLAY[badgeInfo.currentBadge.badge];
      if (display) {
        setOrganizerBadge(display);
      }
    } catch (error) {
      logger.error("Failed to load organizer badge:", error);
    }
  };

  const loadMyCampaigns = async () => {
    try {
      setLoading(true);

      // Get the actual database user ID instead of auth sub
      const databaseUserId = await getDatabaseUserId();

      if (!databaseUserId) {
        logger.warn("No database user ID available for campaign retrieval");
        setMyCampaigns([]);
        return;
      }

      const campaigns = await campaignService.getOrganizerCampaigns(
        databaseUserId
      );

      // Ensure we have an array
      const campaignArray = Array.isArray(campaigns) ? campaigns : [];
      setMyCampaigns(campaignArray);

      // Auto-select first campaign if none selected
      if (!selectedCampaignId && campaignArray.length > 0) {
        setSelectedCampaignId(campaignArray[0].id);
      }
    } catch (error) {
      logger.error("Failed to load campaigns:", error);
      Alert.alert(t("dashboard.error"), t("dashboard.load_campaigns_error"), [
        { text: t("common.ok") },
      ]);
      setMyCampaigns([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (result: QRScanResult) => {
    Alert.alert(
      t("dashboard.scan_success"),
      t("dashboard.participant_scanned", { name: result.scannedUser.name }),
      [{ text: t("common.ok") }]
    );
    setShowQRScanner(false);
    // Refresh stats after successful scan
    // This would trigger a refresh in CampaignStatsComponent
  };

  const handleScanQR = () => {
    if (!selectedCampaignId) {
      Alert.alert(
        t("dashboard.no_campaign"),
        t("dashboard.select_campaign_first"),
        [{ text: t("common.ok") }]
      );
      return;
    }
    setShowQRScanner(true);
  };

  const selectedCampaign = myCampaigns.find((c) => c.id === selectedCampaignId);

  if (!hasRole(USER_ROLES.CAMP_ORGANIZER)) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />

      {/* Header */}
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {t("dashboard.organizer_dashboard")}
            </Text>
            <Text style={styles.headerSubtitle}>
              {selectedCampaign?.title || t("dashboard.no_campaign_selected")}
            </Text>
            {organizerBadge && (
              <View style={styles.organizerBadgeContainer}>
                <BadgeChip
                  icon={organizerBadge.icon as any}
                  label={organizerBadge.label}
                  color="#FFFFFF"
                  size="small"
                />
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Campaign Selector */}
      {myCampaigns.length > 1 && (
        <View style={styles.campaignSelector}>
          <Text style={styles.selectorTitle}>
            {t("dashboard.select_campaign")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {myCampaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign.id}
                style={[
                  styles.campaignCard,
                  selectedCampaignId === campaign.id &&
                    styles.campaignCardSelected,
                ]}
                onPress={() => setSelectedCampaignId(campaign.id)}
              >
                <Text
                  style={[
                    styles.campaignCardTitle,
                    selectedCampaignId === campaign.id &&
                      styles.campaignCardTitleSelected,
                  ]}
                >
                  {campaign.title}
                </Text>
                <Text
                  style={[
                    styles.campaignCardLocation,
                    selectedCampaignId === campaign.id &&
                      styles.campaignCardLocationSelected,
                  ]}
                >
                  {campaign.location}
                </Text>
                <View style={styles.campaignCardStats}>
                  <Text
                    style={[
                      styles.campaignCardStat,
                      selectedCampaignId === campaign.id &&
                        styles.campaignCardStatSelected,
                    ]}
                  >
                    {campaign.actualDonors}/{campaign.expectedDonors}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Campaign Stats */}
      {selectedCampaignId && (
        <CampaignStatsComponent
          campaignId={selectedCampaignId}
          onScanQR={handleScanQR}
        />
      )}

      {/* Empty State */}
      {!loading && myCampaigns.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#999" />
          <Text style={styles.emptyStateTitle}>
            {t("dashboard.no_campaigns")}
          </Text>
          <Text style={styles.emptyStateText}>
            {t("dashboard.create_campaign_prompt")}
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation?.navigate("CreateCampaign")}
          >
            <Text style={styles.createButtonText}>
              {t("dashboard.create_campaign")}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* QR Scanner Modal */}
      <QRScannerModal
        visible={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        campaignId={selectedCampaignId || undefined}
        scanType="CAMPAIGN_ATTENDANCE"
        onScanSuccess={handleScanSuccess}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  organizerBadgeContainer: {
    marginTop: 8,
  },
  menuButton: {
    padding: 8,
    marginLeft: 16,
  },
  campaignSelector: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: "#F8F9FA",
    marginLeft: 20,
    marginRight: 8,
    padding: 16,
    borderRadius: 12,
    minWidth: 200,
    borderWidth: 2,
    borderColor: "transparent",
  },
  campaignCardSelected: {
    backgroundColor: "#667eea",
    borderColor: "#5a6fd8",
  },
  campaignCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  campaignCardTitleSelected: {
    color: "#FFFFFF",
  },
  campaignCardLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  campaignCardLocationSelected: {
    color: "rgba(255, 255, 255, 0.9)",
  },
  campaignCardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  campaignCardStat: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667eea",
  },
  campaignCardStatSelected: {
    color: "#FFFFFF",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: "#667eea",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
