import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StatItem from "../atoms/StatItem";
import { DonationActivity } from "./ActivityCard";

interface SummaryCardProps {
  activities: DonationActivity[];
}

export default function SummaryCard({ activities }: SummaryCardProps) {
  const donationCount = activities.filter((a) => a.type === "donation").length;
  const checkupCount = activities.filter((a) => a.type === "checkup").length;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryContent}>
        <Text style={styles.summaryNumber}>{activities.length}</Text>
        <Text style={styles.summaryLabel}>Total Activities</Text>
      </View>
      <View style={styles.summaryStats}>
        <StatItem number={donationCount} label="Donations" />
        <StatItem number={checkupCount} label="Checkups" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  summaryContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryNumber: {
    fontSize: 48,
    fontWeight: "900",
    color: "#3B82F6",
    marginRight: 16,
  },
  summaryLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});
