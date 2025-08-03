import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProgressBar from "../atoms/ProgressBar";
import { DashboardStats } from "../types";

interface GoalProgressProps {
  stats: DashboardStats;
}

export default function GoalProgress({ stats }: GoalProgressProps) {
  const remainingDonations = stats.donationGoal - stats.currentDonations;

  return (
    <View style={styles.goalSection}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalTitle}>Donation Goal Progress</Text>
        <Text style={styles.goalNumbers}>
          {stats.currentDonations} / {stats.donationGoal}
        </Text>
      </View>

      <ProgressBar progress={stats.goalProgress} color="#FF4757" />

      <Text style={styles.goalSubtext}>
        {remainingDonations} remaining donations
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
  goalSubtext: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
});
