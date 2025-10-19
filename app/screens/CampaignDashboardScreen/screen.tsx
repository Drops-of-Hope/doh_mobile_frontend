import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { extractTimeFromISO } from "../../utils/userDataUtils";

// Import refactored components
import DashboardHeader from "./molecules/DashboardHeader";

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
import { debugAllUserIds, testBackendEndpoints } from "../../utils/userIdUtils";

interface CampaignSection {
  active: CampaignType[];
  upcoming: CampaignType[];
  previous: CampaignType[];
}

export default function CampaignDashboardScreen({
  navigation,
}: CampaignDashboardScreenProps) {
  // Context
  const { user } = useAuth();
  const { t } = useLanguage();

  // State management
  const [campaigns, setCampaigns] = useState<CampaignSection>({
    active: [],
    upcoming: [],
    previous: [],
  });
  const [activeCampaignStats, setActiveCampaignStats] =
    useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const categorizeByStatus = (campaigns: CampaignType[]): CampaignSection => {
    const now = new Date();
    console.log('Current time:', now.toISOString(), '| Local:', now.toLocaleString());
    
    const categorized: CampaignSection = {
      active: [],
      upcoming: [],
      previous: [],
    };

    campaigns.forEach((campaign) => {
      // Strip .000Z suffix to prevent UTC conversion - treat times as local
      const startTimeStr = campaign.startTime.replace(/\.000Z$/, '');
      const endTimeStr = campaign.endTime.replace(/\.000Z$/, '');
      
      const startTime = new Date(startTimeStr);
      const endTime = new Date(endTimeStr);
      
      console.log('Campaign:', campaign.title);
      console.log('  Start string:', campaign.startTime, '→ stripped:', startTimeStr);
      console.log('  End string:', campaign.endTime, '→ stripped:', endTimeStr);
      console.log('  Start parsed:', startTime.toISOString(), '| Local:', startTime.toLocaleString());
      console.log('  End parsed:', endTime.toISOString(), '| Local:', endTime.toLocaleString());
      console.log('  Now >= Start?', now >= startTime, '| Now <= End?', now <= endTime);

      if (now >= startTime && now <= endTime) {
        console.log('  → Categorized as ACTIVE');
        categorized.active.push(campaign);
      } else if (now < startTime) {
        console.log('  → Categorized as UPCOMING');
        categorized.upcoming.push(campaign);
      } else {
        console.log('  → Categorized as PREVIOUS');
        categorized.previous.push(campaign);
      }
    });

    // Sort each category
    categorized.active.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    categorized.upcoming.sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    categorized.previous.sort(
      (a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime()
    );

    return categorized;
  };

  const loadCampaigns = async () => {
    try {
      if (user?.sub) {
        console.log("Loading campaigns for user:", user.sub);
        const userCampaigns = await loadUserCampaigns(user.sub);
        console.log("Received campaigns:", userCampaigns);

        if (Array.isArray(userCampaigns)) {
          const categorized = categorizeByStatus(userCampaigns);
          setCampaigns(categorized);

          // Load stats for the first active campaign
          if (categorized.active.length > 0) {
            await loadStats(categorized.active[0].id);
          }
        } else {
          console.warn("userCampaigns is not an array:", userCampaigns);
          setCampaigns({ active: [], upcoming: [], previous: [] });
        }
      } else {
        console.warn("No user ID available");
        setCampaigns({ active: [], upcoming: [], previous: [] });
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      setCampaigns({ active: [], upcoming: [], previous: [] });
      Alert.alert(
        "Error",
        "Failed to load campaigns. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadStats = async (campaignId: string) => {
    try {
      const campaignStats = await loadCampaignStats(campaignId);
      setActiveCampaignStats(campaignStats);
    } catch (error) {
      console.error("Failed to load campaign stats:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCampaigns();
  };

  // Navigation handlers
  const handleBack = () => {
    navigation?.goBack();
  };

  const handleCreateCampaign = () => {
    navigation?.navigate("CreateCampaign");
  };

  const handleEditCampaign = (campaignId: string) => {
    navigation?.navigate("EditCampaign", { campaignId });
  };

  const handleCampaignDetails = (campaignId: string) => {
    navigation?.navigate("CampaignDetails", { campaignId });
  };

  const handleQRScan = (campaignId: string) => {
    navigation?.navigate("QRScanner", { campaignId });
  };

  const handleDebugUserIds = async () => {
    console.log("=== MANUAL USER ID DEBUG TRIGGERED ===");
    await debugAllUserIds();
    console.log("Auth context user:", user);
    console.log("Auth context user.sub:", user?.sub);

    console.log("=== TESTING BACKEND ENDPOINTS ===");
    await testBackendEndpoints();

    Alert.alert(
      "Debug Complete",
      "Check console for user ID and endpoint information"
    );
  };

  const formatDate = (dateString: string) => {
    // Strip .000Z to prevent UTC conversion
    const cleanString = dateString.replace(/\.000Z$/, '');
    return new Date(cleanString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    // Use utility function to extract time without timezone conversion
    return extractTimeFromISO(dateString);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <DashboardHeader
          title={t("campaign.dashboard_title")}
          onBack={handleBack}
          onAdd={handleCreateCampaign}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E53E3E" />
          <Text style={styles.loadingText}>Loading campaigns...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <DashboardHeader
        title={t("campaign.dashboard_title")}
        onBack={handleBack}
        onAdd={handleCreateCampaign}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Active Campaign Section */}
        {campaigns.active.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔴 Active Campaign</Text>
            {campaigns.active.map((campaign) => (
              <View
                key={campaign.id}
                style={[styles.campaignCard, styles.activeCampaignCard]}
              >
                <View style={styles.campaignHeader}>
                  <Text style={styles.campaignTitle}>{campaign.title}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>LIVE</Text>
                  </View>
                </View>

                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignLocation}>
                    {" "}
                    {campaign.location}
                  </Text>
                  <Text style={styles.campaignTime}>
                    {formatTime(campaign.startTime)} -{" "}
                    {formatTime(campaign.endTime)}
                  </Text>
                </View>

                {activeCampaignStats && (
                  <View style={styles.statsSection}>
                    <Text style={styles.statsTitle}>Real-time Progress</Text>
                    <View style={styles.statsGrid}>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {activeCampaignStats.totalAttendance}
                        </Text>
                        <Text style={styles.statLabel}>Attendees</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {activeCampaignStats.screenedPassed}
                        </Text>
                        <Text style={styles.statLabel}>Screened</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {activeCampaignStats.currentDonations}
                        </Text>
                        <Text style={styles.statLabel}>Donations</Text>
                      </View>
                      <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                          {Math.round(activeCampaignStats.goalProgress)}%
                        </Text>
                        <Text style={styles.statLabel}>Goal</Text>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.campaignActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.qrButton]}
                    onPress={() => handleQRScan(campaign.id)}
                  >
                    <Ionicons name="qr-code" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>QR Scan</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.detailsButton]}
                    onPress={() => handleCampaignDetails(campaign.id)}
                  >
                    <Ionicons name="analytics" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Upcoming Campaigns Section */}
        {campaigns.upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}> Upcoming Campaigns</Text>
            {campaigns.upcoming.map((campaign) => (
              <View key={campaign.id} style={styles.campaignCard}>
                <View style={styles.campaignHeader}>
                  <Text style={styles.campaignTitle}>{campaign.title}</Text>
                  <View style={[styles.statusBadge, styles.upcomingBadge]}>
                    <Text style={[styles.statusText, styles.upcomingText]}>
                      UPCOMING
                    </Text>
                  </View>
                </View>

                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignLocation}>
                    {campaign.location}
                  </Text>
                  <Text style={styles.campaignDate}>
                    {formatDate(campaign.startTime)}
                  </Text>
                  <Text style={styles.campaignTime}>
                    {formatTime(campaign.startTime)} -{" "}
                    {formatTime(campaign.endTime)}
                  </Text>
                </View>

                <View style={styles.campaignActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditCampaign(campaign.id)}
                  >
                    <Ionicons name="create" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.detailsButton]}
                    onPress={() => handleCampaignDetails(campaign.id)}
                  >
                    <Ionicons name="eye" size={20} color="#fff" />
                    <Text style={styles.actionButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Previous Campaigns Section */}
        {campaigns.previous.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              📊 Previous Campaigns (Track Record)
            </Text>
            {campaigns.previous.map((campaign) => (
              <TouchableOpacity
                key={campaign.id}
                style={[styles.campaignCard, styles.previousCampaignCard]}
                onPress={() => handleCampaignDetails(campaign.id)}
              >
                <View style={styles.campaignHeader}>
                  <Text style={styles.campaignTitle}>{campaign.title}</Text>
                  <View style={[styles.statusBadge, styles.completedBadge]}>
                    <Text style={[styles.statusText, styles.completedText]}>
                      COMPLETED
                    </Text>
                  </View>
                </View>

                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignLocation}>
                    {campaign.location}
                  </Text>
                  <Text style={styles.campaignDate}>
                    {formatDate(campaign.startTime)}
                  </Text>
                </View>

                <View style={styles.campaignSummary}>
                  <Text style={styles.summaryText}>
                    Goal: {campaign.donationGoal || "N/A"} | Actual:{" "}
                    {campaign.actualDonors || 0}
                  </Text>
                </View>

                <View style={styles.viewMoreIndicator}>
                  <Text style={styles.viewMoreText}>
                    Tap to view full details
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#666" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* No Campaigns State */}
        {campaigns.active.length === 0 &&
          campaigns.upcoming.length === 0 &&
          campaigns.previous.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No Campaigns Yet</Text>
              <Text style={styles.emptyStateText}>
                Start organizing blood donation campaigns to help save lives
              </Text>
              <TouchableOpacity
                style={styles.createFirstCampaignButton}
                onPress={handleCreateCampaign}
              >
                <Text style={styles.createFirstCampaignText}>
                  Create Your First Campaign
                </Text>
              </TouchableOpacity>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1A202C",
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeCampaignCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#E53E3E",
  },
  previousCampaignCard: {
    opacity: 0.8,
  },
  campaignHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A202C",
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: "#3182CE",
  },
  completedBadge: {
    backgroundColor: "#38A169",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  upcomingText: {
    color: "#FFFFFF",
  },
  completedText: {
    color: "#FFFFFF",
  },
  campaignInfo: {
    marginBottom: 12,
  },
  campaignLocation: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 4,
  },
  campaignDate: {
    fontSize: 14,
    color: "#4A5568",
    marginBottom: 4,
  },
  campaignTime: {
    fontSize: 14,
    color: "#4A5568",
  },
  campaignSummary: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 12,
    color: "#718096",
  },
  statsSection: {
    backgroundColor: "#F7FAFC",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E53E3E",
  },
  statLabel: {
    fontSize: 12,
    color: "#718096",
    marginTop: 2,
  },
  campaignActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  qrButton: {
    backgroundColor: "#E53E3E",
  },
  editButton: {
    backgroundColor: "#E53E3E",
  },
  detailsButton: {
    backgroundColor: "#E53E3E",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  viewMoreIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  viewMoreText: {
    fontSize: 12,
    color: "#718096",
    fontStyle: "italic",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4A5568",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  createFirstCampaignButton: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstCampaignText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
