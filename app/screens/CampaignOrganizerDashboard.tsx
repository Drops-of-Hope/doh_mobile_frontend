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
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Import components
import CampaignStatsComponent from "../../components/organisms/CampaignStatsComponent";
import QRScannerModal from "../../components/organisms/QRScannerModal";

// Import services
import { campaignService } from "../services/campaignService";
import { qrService, QRScanResult } from "../services/qrService";

// Import context
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

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
  route 
}: CampaignOrganizerDashboardProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(
    route?.params?.campaignId || null
  );
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [myCampaigns, setMyCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      Alert.alert(
        t("dashboard.access_denied"),
        t("dashboard.organizer_only"),
        [{ text: t("common.ok"), onPress: () => navigation?.goBack() }]
      );
      return;
    }

    loadMyCampaigns();
  }, []);

  const loadMyCampaigns = async () => {
    try {
      setLoading(true);
      // This would be a call to campaignService.getMyCampaigns()
      // For now, using mock data
      const mockCampaigns = [
        {
          id: "1",
          title: "Blood Drive at University",
          location: "UCSC Auditorium",
          startTime: "2024-12-15T09:00:00Z",
          endTime: "2024-12-15T17:00:00Z",
          expectedDonors: 100,
          actualDonors: 45,
          isActive: true,
        },
        {
          id: "2", 
          title: "Community Blood Campaign",
          location: "Community Center",
          startTime: "2024-12-20T08:00:00Z",
          endTime: "2024-12-20T16:00:00Z",
          expectedDonors: 150,
          actualDonors: 20,
          isActive: true,
        },
      ];
      
      setMyCampaigns(mockCampaigns);
      
      if (!selectedCampaignId && mockCampaigns.length > 0) {
        setSelectedCampaignId(mockCampaigns[0].id);
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      Alert.alert(
        t("dashboard.error"),
        t("dashboard.load_campaigns_error"),
        [{ text: t("common.ok") }]
      );
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

  const selectedCampaign = myCampaigns.find(c => c.id === selectedCampaignId);

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
            <Text style={styles.headerTitle}>{t("dashboard.organizer_dashboard")}</Text>
            <Text style={styles.headerSubtitle}>
              {selectedCampaign?.title || t("dashboard.no_campaign_selected")}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Campaign Selector */}
      {myCampaigns.length > 1 && (
        <View style={styles.campaignSelector}>
          <Text style={styles.selectorTitle}>{t("dashboard.select_campaign")}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {myCampaigns.map((campaign) => (
              <TouchableOpacity
                key={campaign.id}
                style={[
                  styles.campaignCard,
                  selectedCampaignId === campaign.id && styles.campaignCardSelected,
                ]}
                onPress={() => setSelectedCampaignId(campaign.id)}
              >
                <Text style={[
                  styles.campaignCardTitle,
                  selectedCampaignId === campaign.id && styles.campaignCardTitleSelected,
                ]}>
                  {campaign.title}
                </Text>
                <Text style={[
                  styles.campaignCardLocation,
                  selectedCampaignId === campaign.id && styles.campaignCardLocationSelected,
                ]}>
                  {campaign.location}
                </Text>
                <View style={styles.campaignCardStats}>
                  <Text style={[
                    styles.campaignCardStat,
                    selectedCampaignId === campaign.id && styles.campaignCardStatSelected,
                  ]}>
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
          <Text style={styles.emptyStateTitle}>{t("dashboard.no_campaigns")}</Text>
          <Text style={styles.emptyStateText}>{t("dashboard.create_campaign_prompt")}</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation?.navigate("CreateCampaign")}
          >
            <Text style={styles.createButtonText}>{t("dashboard.create_campaign")}</Text>
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
