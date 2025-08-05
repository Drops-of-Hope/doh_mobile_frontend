import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StatCard from "../atoms/StatCard";
import { EmergencyStats } from "../types";

interface StatsOverviewProps {
  stats: EmergencyStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Emergency Overview</Text>
      <View style={styles.statsContainer}>
        <StatCard label="Critical" value={stats.critical} color="#EF4444" />
        <View style={styles.statDivider} />
        <StatCard label="Moderate" value={stats.moderate} color="#F59E0B" />
        <View style={styles.statDivider} />
        <StatCard label="Low Priority" value={stats.low} color="#10B981" />
        <View style={styles.statDivider} />
        <StatCard label="Total Active" value={stats.total} color="#3B82F6" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
  },
});
