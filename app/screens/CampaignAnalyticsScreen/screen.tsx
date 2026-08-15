import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, ActivityIndicator } from "react-native";
import { Users, CheckCircle2, Droplet, TrendingUp, Trophy } from "lucide-react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { campaignService } from "../../services/campaignService";
import { useFocusRefresh } from "../../hooks/useFocusRefresh";

import {
  Screen,
  AppBar,
  Surface,
  Text,
  StatRow,
  StatTile,
  SectionHeader,
  EmptyState,
  Icon,
  useTheme,
} from "../../design";

import { logger } from "../../utils/logger";
interface CampaignAnalyticsScreenProps {
  navigation?: any;
  route?: {
    params: {
      campaignId: string;
    };
  };
}

interface AnalyticsData {
  totalRegistrations: number;
  totalAttendance: number;
  totalDonations: number;
  donationsByBloodType: Record<string, number>;
  attendanceRate: number;
  donationRate: number;
  dailyStats: Array<{
    date: string;
    registrations: number;
    attendance: number;
    donations: number;
  }>;
  topDonors: Array<{
    id: string;
    name: string;
    donationCount: number;
    bloodGroup: string;
  }>;
}

export default function CampaignAnalyticsScreen({
  navigation,
  route,
}: CampaignAnalyticsScreenProps) {
  const theme = useTheme();
  const { user } = useAuth();
  const { t } = useLanguage();
  const { campaignId } = route?.params || {};

  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadAnalytics();
    }
  }, [campaignId]);

  const loadAnalytics = useCallback(async ({ silent = false }: { silent?: boolean } = {}) => {
    if (!campaignId) return;

    try {
      if (!silent) setIsLoading(true);
      const data = await campaignService.getCampaignAnalytics(campaignId);
      setAnalytics(data);
    } catch (error) {
      logger.error("Failed to load analytics:", error);
      if (!silent) {
        Alert.alert("Error", "Failed to load campaign analytics.");
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, [campaignId]);

  useFocusRefresh(useCallback(() => loadAnalytics({ silent: true }), [loadAnalytics]));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalytics();
    setIsRefreshing(false);
  };

  const handleBack = () => navigation?.goBack();

  if (isLoading) {
    return (
      <Screen>
        <AppBar title="Campaign Analytics" onBack={handleBack} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <ActivityIndicator size="large" color={theme.color.crimson} />
          <Text variant="body" tone="inkMuted">
            Loading analytics...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!analytics) {
    return (
      <Screen>
        <AppBar title="Campaign Analytics" onBack={handleBack} />
        <EmptyState icon={TrendingUp} title="No Analytics Data" body="No analytics data available for this campaign yet." />
      </Screen>
    );
  }

  return (
    <Screen scroll refreshing={isRefreshing} onRefresh={handleRefresh}>
      <AppBar title="Campaign Analytics" onBack={handleBack} />

      <View style={{ marginTop: theme.space.lg }}>
        {/* Overview Stats */}
        <SectionHeader title="Overview" />
        <View style={{ gap: theme.space.md, marginBottom: theme.space.xxl }}>
          <StatRow>
            <StatTile
              value={analytics.totalRegistrations}
              label="Registrations"
              icon={<Icon icon={Users} size={20} color={theme.color.info} />}
            />
            <StatTile
              value={analytics.totalAttendance}
              label="Attendance"
              icon={<Icon icon={CheckCircle2} size={20} color={theme.color.success} />}
            />
          </StatRow>
          <StatRow>
            <StatTile
              value={analytics.totalDonations}
              label="Donations"
              icon={<Icon icon={Droplet} size={20} color={theme.color.crimson} />}
            />
            <StatTile
              value={`${analytics.attendanceRate.toFixed(1)}%`}
              label="Attendance Rate"
              icon={<Icon icon={TrendingUp} size={20} color={theme.color.warning} />}
            />
          </StatRow>
        </View>

        {/* Blood Type Distribution */}
        <SectionHeader title="Donations by Blood Type" />
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: theme.space.md,
            marginBottom: theme.space.xxl,
          }}
        >
          {Object.entries(analytics.donationsByBloodType).map(([bloodType, count]) => (
            <Surface key={bloodType} padding="md" style={{ alignItems: "center", minWidth: 84 }}>
              <Text variant="h3" tone="crimson" style={{ marginBottom: 4 }}>
                {bloodType}
              </Text>
              <Text variant="h2">{count}</Text>
            </Surface>
          ))}
        </View>

        {/* Top Donors */}
        {analytics.topDonors.length > 0 && (
          <View style={{ marginBottom: theme.space.xxl }}>
            <SectionHeader title="Top Donors" />
            {analytics.topDonors.map((donor, index) => (
              <Surface key={donor.id} style={{ marginBottom: theme.space.sm, flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: theme.color.crimson,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: theme.space.md,
                  }}
                >
                  {index === 0 ? (
                    <Icon icon={Trophy} size={16} color={theme.color.inverse} />
                  ) : (
                    <Text variant="label" tone="inverse">
                      {index + 1}
                    </Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="body" style={{ fontWeight: "600" }}>
                    {donor.name}
                  </Text>
                  <Text variant="caption" tone="inkMuted">
                    {donor.bloodGroup} • {donor.donationCount} donations
                  </Text>
                </View>
              </Surface>
            ))}
          </View>
        )}

        {/* Daily Stats */}
        {analytics.dailyStats.length > 0 && (
          <View>
            <SectionHeader title="Daily Activity" />
            {analytics.dailyStats.map((day) => (
              <Surface key={day.date} style={{ marginBottom: theme.space.sm }}>
                <Text variant="body" style={{ fontWeight: "600", marginBottom: theme.space.sm }}>
                  {new Date(day.date).toLocaleDateString()}
                </Text>
                <View style={{ flexDirection: "row", gap: theme.space.lg }}>
                  <Text variant="caption" tone="inkMuted">
                    Registrations {day.registrations}
                  </Text>
                  <Text variant="caption" tone="inkMuted">
                    Attendance {day.attendance}
                  </Text>
                  <Text variant="caption" tone="inkMuted">
                    Donations {day.donations}
                  </Text>
                </View>
              </Surface>
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}
