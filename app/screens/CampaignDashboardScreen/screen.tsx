import React, { useState, useEffect } from "react";
import { View, Alert, ActivityIndicator, Pressable } from "react-native";
import { Plus, QrCode, BarChart3, Pencil, Eye, Calendar } from "lucide-react-native";
import { extractTimeFromISO } from "../../utils/userDataUtils";

import {
  Screen,
  AppBar,
  Surface,
  Text,
  Button,
  StatRow,
  StatTile,
  ProgressTrack,
  EmptyState,
  Icon,
  useTheme,
} from "../../design";

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

import { logger } from "../../utils/logger";
interface CampaignSection {
  active: CampaignType[];
  upcoming: CampaignType[];
  previous: CampaignType[];
  cancelled: CampaignType[];
}

export default function CampaignDashboardScreen({
  navigation,
}: CampaignDashboardScreenProps) {
  const theme = useTheme();
  // Context
  const { user } = useAuth();
  const { t } = useLanguage();

  // State management
  const [campaigns, setCampaigns] = useState<CampaignSection>({
    active: [],
    upcoming: [],
    previous: [],
    cancelled: [],
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

    const categorized: CampaignSection = {
      active: [],
      upcoming: [],
      previous: [],
      cancelled: [],
    };

    campaigns.forEach((campaign) => {
      // Check if campaign is cancelled first (check both isApproved field and status)
      const isCancelled =
        (typeof campaign.isApproved === 'string' && campaign.isApproved === 'CANCELLED') ||
        campaign.status === 'cancelled';

      if (isCancelled) {
        categorized.cancelled.push(campaign);
        return;
      }

      // Strip .000Z suffix to prevent UTC conversion - treat times as local
      const startTimeStr = campaign.startTime.replace(/\.000Z$/, '');
      const endTimeStr = campaign.endTime.replace(/\.000Z$/, '');

      const startTime = new Date(startTimeStr);
      const endTime = new Date(endTimeStr);

      if (now >= startTime && now <= endTime) {
        categorized.active.push(campaign);
      } else if (now < startTime) {
        categorized.upcoming.push(campaign);
      } else {
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
    categorized.cancelled.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    );

    return categorized;
  };

  const loadCampaigns = async () => {
    try {
      if (user?.sub) {
        const userCampaigns = await loadUserCampaigns(user.sub);

        if (Array.isArray(userCampaigns)) {
          const categorized = categorizeByStatus(userCampaigns);
          setCampaigns(categorized);

          // Load stats for the first active campaign
          if (categorized.active.length > 0) {
            await loadStats(categorized.active[0].id);
          }
        } else {
          logger.warn("userCampaigns is not an array:", userCampaigns);
          setCampaigns({ active: [], upcoming: [], previous: [], cancelled: [] });
        }
      } else {
        logger.warn("No user ID available");
        setCampaigns({ active: [], upcoming: [], previous: [], cancelled: [] });
      }
    } catch (error) {
      logger.error("Failed to load campaigns:", error);
      setCampaigns({ active: [], upcoming: [], previous: [], cancelled: [] });
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
      logger.error("Failed to load campaign stats:", error);
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

  const rightAction = (
    <Button
      title="Create"
      size="sm"
      fullWidth={false}
      icon={<Icon icon={Plus} size={16} color={theme.color.inverse} />}
      onPress={handleCreateCampaign}
    />
  );

  if (loading) {
    return (
      <Screen>
        <AppBar title={t("campaign.dashboard_title")} onBack={handleBack} right={rightAction} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={theme.color.crimson} />
          <Text variant="body" tone="inkMuted">
            Loading campaigns...
          </Text>
        </View>
      </Screen>
    );
  }

  const noCampaigns =
    campaigns.active.length === 0 &&
    campaigns.upcoming.length === 0 &&
    campaigns.previous.length === 0;

  return (
    <Screen scroll refreshing={refreshing} onRefresh={onRefresh}>
      <AppBar title={t("campaign.dashboard_title")} onBack={handleBack} right={rightAction} />

      <View style={{ marginTop: theme.space.lg }}>
        {/* Active Campaigns */}
        {campaigns.active.length > 0 && (
          <View style={{ marginBottom: theme.space.xxl }}>
            <Text variant="overline" tone="crimson" style={{ marginBottom: theme.space.md }}>
              ACTIVE CAMPAIGN
            </Text>
            {campaigns.active.map((campaign) => {
              const goalProgress = activeCampaignStats
                ? Math.max(0, Math.min(1, activeCampaignStats.goalProgress / 100))
                : 0;
              return (
                <Surface key={campaign.id} style={{ marginBottom: theme.space.lg }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: theme.space.sm,
                    }}
                  >
                    <Text variant="h3" style={{ flex: 1, marginRight: theme.space.sm }}>
                      {campaign.title}
                    </Text>
                    <Surface tone="crimsonSoft" bordered={false} padding={0} radius="pill" style={{ paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text variant="overline" tone="crimson">
                        LIVE
                      </Text>
                    </Surface>
                  </View>

                  <Text variant="caption" tone="inkMuted" style={{ marginBottom: 2 }}>
                    {campaign.location}
                  </Text>
                  <Text variant="caption" tone="inkMuted" style={{ marginBottom: theme.space.lg }}>
                    {formatTime(campaign.startTime)} - {formatTime(campaign.endTime)}
                  </Text>

                  {activeCampaignStats && (
                    <View style={{ marginBottom: theme.space.lg }}>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginBottom: theme.space.sm,
                        }}
                      >
                        <Text variant="label" tone="inkMuted">
                          Goal Progress
                        </Text>
                        <Text variant="label" tone="ink">
                          {Math.round(activeCampaignStats.goalProgress)}%
                        </Text>
                      </View>
                      <ProgressTrack progress={goalProgress} />
                      <View style={{ marginTop: theme.space.lg }}>
                        <StatRow>
                          <StatTile value={activeCampaignStats.totalAttendance} label="Attendees" />
                          <StatTile value={activeCampaignStats.screenedPassed} label="Screened" />
                          <StatTile value={activeCampaignStats.currentDonations} label="Donations" />
                        </StatRow>
                      </View>
                    </View>
                  )}

                  <View style={{ flexDirection: "row", gap: theme.space.md }}>
                    <View style={{ flex: 1 }}>
                      <Button
                        title="QR Scan"
                        size="md"
                        icon={<Icon icon={QrCode} size={18} color={theme.color.inverse} />}
                        onPress={() => handleQRScan(campaign.id)}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Button
                        title="Details"
                        size="md"
                        variant="outline"
                        icon={<Icon icon={BarChart3} size={18} color={theme.color.crimson} />}
                        onPress={() => handleCampaignDetails(campaign.id)}
                      />
                    </View>
                  </View>
                </Surface>
              );
            })}
          </View>
        )}

        {/* Upcoming Campaigns */}
        {campaigns.upcoming.length > 0 && (
          <View style={{ marginBottom: theme.space.xxl }}>
            <Text variant="overline" tone="inkMuted" style={{ marginBottom: theme.space.md }}>
              UPCOMING CAMPAIGNS
            </Text>
            {campaigns.upcoming.map((campaign) => (
              <Surface key={campaign.id} style={{ marginBottom: theme.space.lg }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: theme.space.sm,
                  }}
                >
                  <Text variant="h3" style={{ flex: 1, marginRight: theme.space.sm }}>
                    {campaign.title}
                  </Text>
                  <Surface tone="infoSoft" bordered={false} padding={0} radius="pill" style={{ paddingHorizontal: 10, paddingVertical: 4 }}>
                    <Text variant="overline" tone="info">
                      UPCOMING
                    </Text>
                  </Surface>
                </View>

                <Text variant="caption" tone="inkMuted" style={{ marginBottom: 2 }}>
                  {campaign.location}
                </Text>
                <Text variant="caption" tone="inkMuted" style={{ marginBottom: 2 }}>
                  {formatDate(campaign.startTime)}
                </Text>
                <Text variant="caption" tone="inkMuted" style={{ marginBottom: theme.space.lg }}>
                  {formatTime(campaign.startTime)} - {formatTime(campaign.endTime)}
                </Text>

                <View style={{ flexDirection: "row", gap: theme.space.md }}>
                  <View style={{ flex: 1 }}>
                    <Button
                      title="Edit"
                      size="md"
                      variant="outline"
                      icon={<Icon icon={Pencil} size={18} color={theme.color.crimson} />}
                      onPress={() => handleEditCampaign(campaign.id)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      title="View"
                      size="md"
                      icon={<Icon icon={Eye} size={18} color={theme.color.inverse} />}
                      onPress={() => handleCampaignDetails(campaign.id)}
                    />
                  </View>
                </View>
              </Surface>
            ))}
          </View>
        )}

        {/* Previous Campaigns */}
        {campaigns.previous.length > 0 && (
          <View style={{ marginBottom: theme.space.xxl }}>
            <Text variant="overline" tone="inkMuted" style={{ marginBottom: theme.space.md }}>
              PREVIOUS CAMPAIGNS
            </Text>
            {campaigns.previous.map((campaign) => (
              <Pressable key={campaign.id} onPress={() => handleCampaignDetails(campaign.id)}>
                <Surface style={{ marginBottom: theme.space.lg, opacity: 0.9 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: theme.space.sm,
                    }}
                  >
                    <Text variant="h3" style={{ flex: 1, marginRight: theme.space.sm }}>
                      {campaign.title}
                    </Text>
                    <Surface tone="successSoft" bordered={false} padding={0} radius="pill" style={{ paddingHorizontal: 10, paddingVertical: 4 }}>
                      <Text variant="overline" tone="success">
                        COMPLETED
                      </Text>
                    </Surface>
                  </View>

                  <Text variant="caption" tone="inkMuted" style={{ marginBottom: 2 }}>
                    {campaign.location}
                  </Text>
                  <Text variant="caption" tone="inkMuted" style={{ marginBottom: theme.space.md }}>
                    {formatDate(campaign.startTime)}
                  </Text>

                  <Text variant="label" tone="inkMuted">
                    Goal: {campaign.donationGoal || "N/A"} | Actual: {campaign.actualDonors || 0}
                  </Text>
                </Surface>
              </Pressable>
            ))}
          </View>
        )}

        {/* No Campaigns State */}
        {noCampaigns && (
          <EmptyState
            icon={Calendar}
            title="No Campaigns Yet"
            body="Start organizing blood donation campaigns to help save lives"
            actionLabel="Create Your First Campaign"
            onAction={handleCreateCampaign}
          />
        )}
      </View>
    </Screen>
  );
}
