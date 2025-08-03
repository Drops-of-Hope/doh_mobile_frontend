import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";

// Import refactored components
import ScreenHeader from "./atoms/ScreenHeader";
import StatsOverview from "./molecules/StatsOverview";
import CampaignList from "./molecules/CampaignList";
import CampaignModal from "./organisms/CampaignModal";

// Import types and utilities
import { Campaign } from "./types";
import { getAllCampaigns, getCampaignStats } from "./utils";

interface AllCampaignsScreenProps {
  navigation?: any;
}

export default function AllCampaignsScreen({
  navigation,
}: AllCampaignsScreenProps) {
  // State management
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );

  // Navigation handlers
  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  // Modal handlers
  const handleCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const handleJoinCampaign = (campaign: Campaign) => {
    Alert.alert(
      "Join Campaign",
      `Would you like to join "${campaign.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join",
          onPress: () => {
            Alert.alert(
              "Success!",
              "You have successfully joined the campaign. We will send you details soon.",
            );
          },
        },
      ],
    );
  };

  // Modal close handler
  const closeCampaignModal = () => {
    setShowCampaignModal(false);
    setSelectedCampaign(null);
  };

  // Get data
  const allCampaigns = getAllCampaigns();
  const stats = getCampaignStats(allCampaigns);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <ScreenHeader title="All Campaigns" onBackPress={handleBack} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StatsOverview stats={stats} />

        <CampaignList
          campaigns={allCampaigns}
          onDetails={handleCampaignDetails}
          onJoin={handleJoinCampaign}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Campaign Details Modal */}
      <CampaignModal
        visible={showCampaignModal}
        campaign={selectedCampaign}
        onClose={closeCampaignModal}
        onJoin={handleJoinCampaign}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});
