import React from "react";
import { View, StyleSheet } from "react-native";
import CampaignCard from "../../../../components/molecules/HomeScreen/CampaignCard";
import { Campaign } from "../types";

interface CampaignListProps {
  campaigns: Campaign[];
  onDetails: (campaign: Campaign) => void;
  onJoin: (campaign: Campaign) => void;
}

export default function CampaignList({
  campaigns,
  onDetails,
  onJoin,
}: CampaignListProps) {
  return (
    <View style={styles.campaignListContainer}>
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          showActions={true}
          onDetails={() => onDetails(campaign)}
          onJoin={() => onJoin(campaign)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  campaignListContainer: {
    paddingHorizontal: 16,
  },
});
