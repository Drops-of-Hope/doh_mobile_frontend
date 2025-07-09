import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
  campaignService,
  Campaign as CampaignType,
} from "../services/campaignService";

const { width } = Dimensions.get("window");

interface DashboardStats {
  totalAttendance: number;
  screenedPassed: number;
  walkInsScreened: number;
  goalProgress: number;
  currentDonations: number;
  donationGoal: number;
}

const CampaignDashboardScreen: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeCampaign, setActiveCampaign] = useState<CampaignType | null>(
    null
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
    if (activeCampaign) {
      loadCampaignStats(activeCampaign.id);
    }
  }, [activeCampaign]);

  const loadCampaigns = async () => {
    try {
      if (user?.sub) {
        const userCampaigns = await campaignService.getOrganizerCampaigns(
          user.sub
        );
        setCampaigns(userCampaigns);
        if (!activeCampaign && userCampaigns.length > 0) {
          setActiveCampaign(userCampaigns[0]);
        }
      }
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      Alert.alert("Error", "Failed to load campaigns");
    }
  };

  const loadCampaignStats = async (campaignId: string) => {
    try {
      const campaignStats = await campaignService.getCampaignStats(campaignId);
      setStats(campaignStats);
    } catch (error) {
      console.error("Failed to load campaign stats:", error);
    }
  };

  const handleQRScan = () => {
    navigation?.navigate("QRScanner", { campaignId: activeCampaign?.id });
  };

  const handleCreateCampaign = () => {
    navigation?.navigate("CreateCampaign");
  };

  const handleSelectCampaign = (campaign: CampaignType) => {
    setActiveCampaign(campaign);
    setShowCampaignSelector(false);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: string;
    color: string;
  }> = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <View style={styles.statCardHeader}>
          <Ionicons name={icon as any} size={24} color={color} />
          <Text style={styles.statCardTitle}>{title}</Text>
        </View>
        <Text style={[styles.statCardValue, { color }]}>{value}</Text>
      </View>
    </View>
  );

  const ProgressBar: React.FC<{ progress: number; color: string }> = ({
    progress,
    color,
  }) => (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${Math.min(progress, 100)}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("campaign.dashboard_title")}</Text>
        <TouchableOpacity
          onPress={handleCreateCampaign}
          style={styles.addButton}
        >
          <Ionicons name="add" size={24} color="#FF4757" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Campaign Selector */}
        <View style={styles.campaignSelector}>
          <Text style={styles.sectionTitle}>
            {t("campaign.active_campaign")}
          </Text>
          <TouchableOpacity
            style={styles.campaignCard}
            onPress={() => setShowCampaignSelector(!showCampaignSelector)}
          >
            {activeCampaign ? (
              <>
                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignTitle}>
                    {activeCampaign.title}
                  </Text>
                  <Text style={styles.campaignDetails}>
                    <Ionicons name="location-outline" size={14} color="#666" />{" "}
                    {activeCampaign.location}
                  </Text>
                  <Text style={styles.campaignDetails}>
                    <Ionicons name="calendar-outline" size={14} color="#666" />{" "}
                    {activeCampaign.date}
                  </Text>
                  <Text style={styles.campaignDetails}>
                    <Ionicons name="time-outline" size={14} color="#666" />{" "}
                    {activeCampaign.startTime} - {activeCampaign.endTime}
                  </Text>
                </View>
                <View style={styles.campaignStatus}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          activeCampaign.status === "active"
                            ? "#10B981"
                            : "#F59E0B",
                      },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {activeCampaign.status.toUpperCase()}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </View>
              </>
            ) : (
              <Text style={styles.noCampaignText}>
                {t("campaign.no_campaign_selected")}
              </Text>
            )}
          </TouchableOpacity>

          {/* Campaign Dropdown */}
          {showCampaignSelector && (
            <View style={styles.campaignDropdown}>
              {campaigns.map((campaign) => (
                <TouchableOpacity
                  key={campaign.id}
                  style={styles.campaignOption}
                  onPress={() => handleSelectCampaign(campaign)}
                >
                  <Text style={styles.campaignOptionTitle}>
                    {campaign.title}
                  </Text>
                  <Text style={styles.campaignOptionDate}>{campaign.date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {activeCampaign && (
          <>
            {/* QR Scanner Section */}
            <View style={styles.qrSection}>
              <Text style={styles.sectionTitle}>{t("campaign.scan_qr")}</Text>
              <TouchableOpacity style={styles.qrButton} onPress={handleQRScan}>
                <Ionicons name="qr-code-outline" size={48} color="#FF4757" />
                <Text style={styles.qrButtonText}>{t("campaign.scan_qr")}</Text>
                <Text style={styles.qrButtonSubtext}>
                  {t("campaign.mark_attendance")}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Analytics Dashboard */}
            <View style={styles.analyticsSection}>
              <Text style={styles.sectionTitle}>
                {t("campaign.live_analytics")}
              </Text>

              {/* Stats Grid */}
              <View style={styles.statsGrid}>
                <StatCard
                  title={t("campaign.total_attendance")}
                  value={stats.totalAttendance}
                  icon="people-outline"
                  color="#3B82F6"
                />
                <StatCard
                  title={t("campaign.screening_passed")}
                  value={stats.screenedPassed}
                  icon="checkmark-circle-outline"
                  color="#10B981"
                />
                <StatCard
                  title={t("campaign.walk_ins_screened")}
                  value={stats.walkInsScreened}
                  icon="walk-outline"
                  color="#F59E0B"
                />
              </View>

              {/* Goal Progress */}
              <View style={styles.goalSection}>
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>
                    {t("campaign.donation_goal_progress")}
                  </Text>
                  <Text style={styles.goalNumbers}>
                    {stats.currentDonations} / {stats.donationGoal}
                  </Text>
                </View>
                <ProgressBar progress={stats.goalProgress} color="#FF4757" />
                <Text style={styles.goalSubtext}>
                  {stats.donationGoal - stats.currentDonations}{" "}
                  {t("campaign.remaining_donations")}
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  campaignSelector: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  campaignInfo: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  campaignDetails: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  campaignStatus: {
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  noCampaignText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  campaignDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  campaignOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  campaignOptionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
  },
  campaignOptionDate: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  qrSection: {
    marginTop: 24,
  },
  qrButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 12,
  },
  qrButtonSubtext: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  analyticsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  statsGrid: {
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statCardTitle: {
    fontSize: 14,
    color: "#64748B",
    marginLeft: 8,
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  goalSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  goalNumbers: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF4757",
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    minWidth: 50,
  },
  goalSubtext: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
});

export default CampaignDashboardScreen;
