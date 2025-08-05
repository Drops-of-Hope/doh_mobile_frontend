import React from "react";
import { View, StyleSheet } from "react-native";
import StatCard from "../atoms/StatCard";
import { CampaignStats } from "../types";

interface StatsOverviewProps {
  stats: CampaignStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsRow}>
        <StatCard label="Total" value={stats.totalCampaigns} />
        <StatCard
          label="Critical"
          value={stats.criticalCount}
          color="#EF4444"
        />
        <StatCard
          label="Moderate"
          value={stats.moderateCount}
          color="#F97316"
        />
        <StatCard
          label="Available"
          value={stats.availableSlots}
          color="#10B981"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    backgroundColor: "#FFFFFF",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
