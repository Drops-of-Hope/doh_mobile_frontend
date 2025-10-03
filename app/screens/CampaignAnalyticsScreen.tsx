import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import DashboardHeader from "./CampaignDashboardScreen/molecules/DashboardHeader";
import { campaignService } from "../services/campaignService";

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

  const loadAnalytics = async () => {
    if (!campaignId) return;

    try {
      setIsLoading(true);
      const data = await campaignService.getCampaignAnalytics(campaignId);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
      Alert.alert("Error", "Failed to load campaign analytics.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadAnalytics();
    setIsRefreshing(false);
  };

  const handleBack = () => navigation?.goBack();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader
          title="Campaign Analytics"
          onBack={handleBack}
          onAdd={() => {}}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!analytics) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader
          title="Campaign Analytics"
          onBack={handleBack}
          onAdd={() => {}}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No analytics data available</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <DashboardHeader
        title="Campaign Analytics"
        onBack={handleBack}
        onAdd={() => {}}
      />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#DC2626"]}
          />
        }
      >
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard
              title="Registrations"
              value={analytics.totalRegistrations}
              icon="👥"
              color="#3B82F6"
            />
            <StatCard
              title="Attendance"
              value={analytics.totalAttendance}
              icon="✅"
              color="#10B981"
            />
            <StatCard
              title="Donations"
              value={analytics.totalDonations}
              icon="🩸"
              color="#DC2626"
            />
            <StatCard
              title="Attendance Rate"
              value={`${analytics.attendanceRate.toFixed(1)}%`}
              icon="📊"
              color="#F59E0B"
            />
          </View>
        </View>

        {/* Blood Type Distribution */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Donations by Blood Type</Text>
          <View style={styles.bloodTypeContainer}>
            {Object.entries(analytics.donationsByBloodType).map(([bloodType, count]) => (
              <View key={bloodType} style={styles.bloodTypeItem}>
                <Text style={styles.bloodTypeLabel}>{bloodType}</Text>
                <Text style={styles.bloodTypeCount}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Donors */}
        {analytics.topDonors.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Donors</Text>
            {analytics.topDonors.map((donor, index) => (
              <View key={donor.id} style={styles.donorItem}>
                <View style={styles.donorRank}>
                  <Text style={styles.rankText}>{index + 1}</Text>
                </View>
                <View style={styles.donorInfo}>
                  <Text style={styles.donorName}>{donor.name}</Text>
                  <Text style={styles.donorDetails}>
                    {donor.bloodGroup} • {donor.donationCount} donations
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Daily Stats */}
        {analytics.dailyStats.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Activity</Text>
            {analytics.dailyStats.map((day) => (
              <View key={day.date} style={styles.dailyItem}>
                <Text style={styles.dailyDate}>
                  {new Date(day.date).toLocaleDateString()}
                </Text>
                <View style={styles.dailyStats}>
                  <Text style={styles.dailyStat}>📝 {day.registrations}</Text>
                  <Text style={styles.dailyStat}>✅ {day.attendance}</Text>
                  <Text style={styles.dailyStat}>🩸 {day.donations}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Stat Card Component
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statIcon}>{icon}</Text>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </View>
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  statTitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  bloodTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  bloodTypeItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  bloodTypeLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 4,
  },
  bloodTypeCount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  donorItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  donorRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  donorInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  donorDetails: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  dailyItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dailyDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  dailyStats: {
    flexDirection: "row",
    gap: 16,
  },
  dailyStat: {
    fontSize: 14,
    color: "#6B7280",
  },
});