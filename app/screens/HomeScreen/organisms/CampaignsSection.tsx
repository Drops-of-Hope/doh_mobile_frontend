import React from "react";
import { View, StyleSheet } from "react-native";
import { SectionHeader } from "../../../design";
import CampaignCard, { Campaign } from "../molecules/CampaignCard";

interface CampaignsSectionProps {
  campaigns: Campaign[];
  onCampaignPress?: (campaign: Campaign) => void;
  onViewAll?: () => void;
  limit?: number;
}

export default function CampaignsSection({ campaigns, onCampaignPress, onViewAll, limit = 2 }: CampaignsSectionProps) {
  const displayedCampaigns = limit ? campaigns.slice(0, limit) : campaigns;

  return (
    <View style={styles.section}>
      <SectionHeader
        title="Upcoming Campaigns"
        actionLabel={onViewAll ? "View All" : undefined}
        onAction={onViewAll}
      />

      <View style={styles.list}>
        {displayedCampaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} onPress={onCampaignPress} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  list: { gap: 12 },
});
