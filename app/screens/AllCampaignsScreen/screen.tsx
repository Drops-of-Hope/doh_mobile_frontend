import React, { useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Screen, AppBar, useTheme } from "../../design";

// Import refactored components
import StatsOverview from "./molecules/StatsOverview";
import CampaignList from "./molecules/CampaignList";
import CampaignModal from "./organisms/CampaignModal";

// Import types and utilities
import { Campaign } from "./types";
import { getAllCampaigns, getCampaignStats } from "./utils";
import { campaignService } from "../../services/campaignService";
import { useAuth } from "../../context/AuthContext";

import { logger } from "../../utils/logger";
interface AllCampaignsScreenProps {
  navigation?: any;
}

export default function AllCampaignsScreen({
  navigation,
}: AllCampaignsScreenProps) {
  const theme = useTheme();
  // State management
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null,
  );
  const [joiningCampaign, setJoiningCampaign] = useState<boolean>(false);
  
  // Auth context
  const { user, isAuthenticated, logout } = useAuth();

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

  const handleJoinCampaign = async (campaign: Campaign) => {
    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      Alert.alert(
        "Authentication Required",
        "Please log in to join campaigns.",
        [
          { text: "Cancel", style: "cancel" },
          {
            // No standalone "Login" route exists; signing out returns the
            // root navigator to the unauthenticated Entry screen.
            text: "Log In",
            onPress: () => logout(),
          },
        ]
      );
      return;
    }

    // Close modal first for better UX
    setShowCampaignModal(false);

    Alert.alert(
      "Join Campaign",
      `Would you like to join "${campaign.title}"?\n\nLocation: ${campaign.location}\nDate: ${campaign.date}`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join",
          onPress: async () => {
            setJoiningCampaign(true);
            
            try {
              // Convert the local Campaign type to string ID for API
              const campaignId = campaign.id.toString();
              
              const result = await campaignService.joinCampaign(campaignId, {
                contactNumber: user.phone_number || "",
                specialRequests: "",
                emergencyContact: "",
              });

              if (result.success) {
                Alert.alert(
                  "🎉 Registration Successful!",
                  `You have successfully registered for "${campaign.title}".\n\nParticipation ID: ${result.participationId}\n\nYou will receive notifications with campaign updates and instructions.`,
                  [{ text: "OK" }]
                );
              } else {
                Alert.alert(
                  "Registration Info",
                  result.message,
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              logger.error("Campaign registration error:", error);
              
              const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
              
              Alert.alert(
                "Registration Failed",
                `Failed to register for campaign: ${errorMessage}`,
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Retry", 
                    onPress: () => handleJoinCampaign(campaign)
                  },
                ]
              );
            } finally {
              setJoiningCampaign(false);
            }
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
    <Screen scroll>
      <AppBar title="All Campaigns" onBack={handleBack} />

      <View style={styles.statsWrap}>
        <StatsOverview stats={stats} />
      </View>

      <CampaignList
        campaigns={allCampaigns}
        onDetails={handleCampaignDetails}
        onJoin={handleJoinCampaign}
      />

      {/* Campaign Details Modal */}
      <CampaignModal
        visible={showCampaignModal}
        campaign={selectedCampaign}
        onClose={closeCampaignModal}
        onJoin={handleJoinCampaign}
      />

      {/* Loading Overlay for Campaign Registration */}
      {joiningCampaign && (
        <View style={styles.loadingOverlay}>
          <View style={[styles.loadingContainer, { backgroundColor: theme.color.surface, borderRadius: theme.radius.md }]}>
            <ActivityIndicator size="large" color={theme.color.crimson} />
          </View>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  statsWrap: { marginBottom: 24 },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
});
