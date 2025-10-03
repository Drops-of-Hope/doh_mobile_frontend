import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";

// Import refactored components
import DashboardHeader from "./molecules/DashboardHeader";
import CampaignSelector from "./organisms/CampaignSelector";
import QRSection from "./organisms/QRSection";
import AnalyticsSection from "./organisms/AnalyticsSection";

// Import types and utilities
import {
  CampaignDashboardScreenProps,
  DashboardStats,
  CampaignType,
} from "./types";
import { loadUserCampaigns, loadCampaignStats } from "./utils";

// Import context
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

export default function CampaignDashboardScreen({
  navigation,
}: CampaignDashboardScreenProps) {
  // Context
  const { user } = useAuth();
  const { t } = useLanguage();

  // State management
  const [activeCampaign, setActiveCampaign] = useState<CampaignType | null>(
    null,
  );
  const [campaigns, setCampaigns] = useState<CampaignType[]>([]);
  const [showCampaignSelector, setShowCampaignSelector] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalAttendance: 0,
    screenedPassed: 0,
    walkInsScreened: 0,
    goalProgress: 0,
    currentDonations: 0,
    donationGoal: 100,
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  useEffect(() => {
    if (activeCampaign) {
      loadStats(activeCampaign.id);
    }
  }, [activeCampaign]);

  const loadCampaigns = async () => {
    try {
      if (user?.sub) {
        console.log("Loading campaigns for user:", user.sub);
        const userCampaigns = await loadUserCampaigns(user.sub);
        console.log("Received campaigns:", userCampaigns);
        
        // Ensure userCampaigns is an array
        if (Array.isArray(userCampaigns)) {
          setCampaigns(userCampaigns);
          if (!activeCampaign && userCampaigns.length > 0) {
            setActiveCampaign(userCampaigns[0]);
          }
        } else {
          console.warn("userCampaigns is not an array:", userCampaigns);
          setCampaigns([]);
        }
      } else {
        console.warn("No user ID available");
        setCampaigns([]);
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      setCampaigns([]); // Set empty array on error
      Alert.alert("Error", "Failed to load campaigns. Please check your connection and try again.");
    }
  };

  const loadStats = async (campaignId: string) => {
    try {
      const campaignStats = await loadCampaignStats(campaignId);
      setStats(campaignStats);
    } catch (error) {
      console.error("Failed to load campaign stats:", error);
    }
  };

  // Navigation handlers
  const handleBack = () => {
    navigation?.goBack();
  };

  const handleCreateCampaign = () => {
    navigation?.navigate("CreateCampaign");
  };

  const handleQRScan = () => {
    navigation?.navigate("QRScanner", { campaignId: activeCampaign?.id });
  };

  // Campaign selection handlers
  const handleToggleCampaignSelector = () => {
    setShowCampaignSelector(!showCampaignSelector);
  };

  const handleSelectCampaign = (campaign: CampaignType) => {
    setActiveCampaign(campaign);
    setShowCampaignSelector(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <DashboardHeader
        title={t("campaign.dashboard_title")}
        onBack={handleBack}
        onAdd={handleCreateCampaign}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <CampaignSelector
          activeCampaign={activeCampaign}
          campaigns={campaigns}
          showDropdown={showCampaignSelector}
          onToggleDropdown={handleToggleCampaignSelector}
          onSelectCampaign={handleSelectCampaign}
        />

        {activeCampaign && (
          <>
            <QRSection onScanQR={handleQRScan} />
            <AnalyticsSection 
              stats={stats} 
              campaignId={activeCampaign.id}
              onStatsUpdated={setStats}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
