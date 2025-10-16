import React, { useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";

// Import refactored components
import ScreenHeader from "./atoms/ScreenHeader";
import StatsOverview from "./molecules/StatsOverview";
import CampaignList from "./molecules/CampaignList";
import CampaignModal from "./organisms/CampaignModal";

// Import types and utilities
import { Campaign } from "./types";
import { getAllCampaigns, getCampaignStats } from "./utils";
import { campaignService } from "../../services/campaignService";
import { useAuth } from "../../context/AuthContext";

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
  const [joiningCampaign, setJoiningCampaign] = useState<boolean>(false);
  
  // Auth context
  const { user, isAuthenticated } = useAuth();

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
            text: "Login", 
            onPress: () => navigation?.navigate('Login') 
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
                
                // Store registration locally for future reference
                console.log("Campaign registration details:", result.registrationDetails);
              } else {
                Alert.alert(
                  "Registration Info",
                  result.message,
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              console.error("Campaign registration error:", error);
              
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

      {/* Loading Overlay for Campaign Registration */}
      {joiningCampaign && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#DC2626" />
            <StatusBar 
              barStyle="light-content" 
              backgroundColor="rgba(0,0,0,0.5)" 
              translucent 
            />
          </View>
        </View>
      )}
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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
});
