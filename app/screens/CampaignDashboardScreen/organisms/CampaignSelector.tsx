import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CampaignInfo from "../molecules/CampaignInfo";
import StatusBadge from "../atoms/StatusBadge";
import { CampaignSelectorProps } from "../types";

export default function CampaignSelector({
  activeCampaign,
  campaigns,
  showDropdown,
  onToggleDropdown,
  onSelectCampaign,
}: CampaignSelectorProps) {
  return (
    <View style={styles.campaignSelector}>
      <Text style={styles.sectionTitle}>Active Campaign</Text>

      <TouchableOpacity style={styles.campaignCard} onPress={onToggleDropdown}>
        {activeCampaign ? (
          <>
            <CampaignInfo campaign={activeCampaign} />

            <View style={styles.campaignStatus}>
              <StatusBadge status={activeCampaign.status || "unknown"} />
              <Ionicons name="chevron-down" size={20} color="#666" />
            </View>
          </>
        ) : (
          <Text style={styles.noCampaignText}>No Campaign Selected</Text>
        )}
      </TouchableOpacity>

      {/* Campaign Dropdown */}
      {showDropdown && (
        <View style={styles.campaignDropdown}>
          {campaigns.map((campaign) => (
            <TouchableOpacity
              key={campaign.id}
              style={styles.campaignOption}
              onPress={() => onSelectCampaign(campaign)}
            >
              <Text style={styles.campaignOptionTitle}>{campaign.title}</Text>
              <Text style={styles.campaignOptionDate}>{campaign.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  campaignSelector: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  campaignCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  campaignStatus: {
    alignItems: "center",
  },
  noCampaignText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  campaignDropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  campaignOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  campaignOptionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1E293B",
  },
  campaignOptionDate: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
});
