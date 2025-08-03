import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CampaignType } from "../types";

interface CampaignInfoProps {
  campaign: CampaignType;
}

export default function CampaignInfo({ campaign }: CampaignInfoProps) {
  return (
    <View style={styles.campaignInfo}>
      <Text style={styles.campaignTitle}>{campaign.title}</Text>

      <Text style={styles.campaignDetails}>
        <Ionicons name="location-outline" size={14} color="#666" />{" "}
        {campaign.location}
      </Text>

      <Text style={styles.campaignDetails}>
        <Ionicons name="calendar-outline" size={14} color="#666" />{" "}
        {campaign.date}
      </Text>

      <Text style={styles.campaignDetails}>
        <Ionicons name="time-outline" size={14} color="#666" />{" "}
        {campaign.startTime} - {campaign.endTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  campaignInfo: {
    flex: 1,
  },
  campaignTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  campaignDetails: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
});
