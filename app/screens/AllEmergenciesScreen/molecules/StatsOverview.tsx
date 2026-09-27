import React from "react";
import { View, StyleSheet } from "react-native";
import { SectionHeader, StatRow, StatTile } from "../../../design";
import { EmergencyStats } from "../types";

interface StatsOverviewProps {
  stats: EmergencyStats;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <View style={styles.container}>
      <SectionHeader title="Emergency Overview" />
      <StatRow>
        <StatTile value={stats.critical} label="Critical" />
        <StatTile value={stats.moderate} label="Moderate" />
        <StatTile value={stats.low} label="Low Priority" />
        <StatTile value={stats.total} label="Total Active" />
      </StatRow>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
});
