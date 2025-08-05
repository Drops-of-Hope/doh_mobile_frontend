import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StatCard from "../atoms/StatCard";
import GoalProgress from "../molecules/GoalProgress";
import { AnalyticsSectionProps } from "../types";

export default function AnalyticsSection({ stats }: AnalyticsSectionProps) {
  return (
    <View style={styles.analyticsSection}>
      <Text style={styles.sectionTitle}>Live Analytics</Text>

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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  statsGrid: {
    marginBottom: 20,
  },
});
