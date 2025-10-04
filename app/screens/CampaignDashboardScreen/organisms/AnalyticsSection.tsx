import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import StatCard from "../atoms/StatCard";
import GoalProgress from "../molecules/GoalProgress";
import { AnalyticsSectionProps } from "../types";
import { campaignService } from "../../../services/campaignService";

interface ExtendedAnalyticsSectionProps extends AnalyticsSectionProps {
  campaignId?: string;
  onStatsUpdated?: (stats: any) => void;
}

export default function AnalyticsSection({ 
  stats, 
  campaignId,
  onStatsUpdated 
}: ExtendedAnalyticsSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (campaignId) {
        refreshStats();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [campaignId]);

  const refreshStats = async () => {
    if (!campaignId) return;
    
    setIsRefreshing(true);
    try {
      const updatedStats = await campaignService.getCampaignStats(campaignId);
      onStatsUpdated?.(updatedStats);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to refresh stats:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatLastUpdated = () => {
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastUpdated.getTime()) / (1000 * 60));
    
    if (diffMinutes === 0) return "Just now";
    if (diffMinutes === 1) return "1 minute ago";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours === 1) return "1 hour ago";
    return `${diffHours} hours ago`;
  };

  return (
    <View style={styles.analyticsSection}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Live Analytics</Text>
        <TouchableOpacity 
          style={styles.refreshButton} 
          onPress={refreshStats}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#6B7280" />
          ) : (
            <Text style={styles.refreshText}>↻</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.lastUpdatedText}>
        Last updated: {formatLastUpdated()}
      </Text>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Attendance"
          value={stats.totalAttendance}
          icon="people-outline"
          color="#3B82F6"
        />

        <StatCard
          title="Screening Passed"
          value={stats.screenedPassed}
          icon="checkmark-circle-outline"
          color="#10B981"
        />

        <StatCard
          title="Walk-ins Screened"
          value={stats.walkInsScreened}
          icon="walk-outline"
          color="#F59E0B"
        />
      </View>

      {/* Goal Progress */}
      <GoalProgress stats={stats} />
    </View>
  );
}

const styles = StyleSheet.create({
  analyticsSection: {
    marginTop: 24,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  refreshButton: {
    padding: 4,
  },
  refreshText: {
    fontSize: 18,
    color: "#6B7280",
    fontWeight: "600",
  },
  lastUpdatedText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 12,
  },
  statsGrid: {
    marginBottom: 20,
  },
});
