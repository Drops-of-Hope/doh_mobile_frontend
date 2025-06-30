import React, { useState, useEffect } from "react";
import { View, SafeAreaView, Alert, Text } from "react-native";
import { styled } from "nativewind";
import CampaignList from "../../components/molecules/Donation/CampaignList";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import { donationService } from "../../app/services/donationService";

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);

interface Campaign {
  id: string;
  title: string;
  description: string;
  participants: number;
  location?: string;
  date?: string;
  time?: string;
}

const ExploreScreen: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const campaignsData = await donationService.getCampaigns();
      setCampaigns(campaignsData);
    } catch (error) {
      console.error("Failed to load campaigns:", error);
      // Mock data for demo
      setCampaigns([
        {
          id: "1",
          title: "Emergency Blood Drive - General Hospital",
          description:
            "Critical blood shortage at General Hospital. All blood types needed urgently.",
          participants: 156,
          location: "General Hospital, Colombo",
          date: "2025-07-15",
          time: "9:00 AM - 4:00 PM",
        },
        {
          id: "2",
          title: "Community Health Campaign - University",
          description: "Monthly blood donation drive at the university campus.",
          participants: 89,
          location: "University of Colombo",
          date: "2025-07-20",
          time: "10:00 AM - 3:00 PM",
        },
        {
          id: "3",
          title: "Mobile Blood Unit - Shopping Mall",
          description:
            "Convenient blood donation at the city center shopping mall.",
          participants: 45,
          location: "One Galle Face Mall",
          date: "2025-07-25",
          time: "11:00 AM - 6:00 PM",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCampaign = async (campaign: Campaign) => {
    try {
      // Register user interest in the campaign
      await donationService.joinCampaign(campaign.id);

      Alert.alert(
        "Registration Successful!",
        `You have successfully registered for "${campaign.title}". You will receive a notification with details.\n\nLocation: ${campaign.location}\nDate: ${campaign.date}\nTime: ${campaign.time}`,
        [{ text: "OK" }]
      );

      // Update participant count
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaign.id ? { ...c, participants: c.participants + 1 } : c
        )
      );
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        "Unable to register for this campaign. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 bg-white">
        <StyledView className="flex-1 justify-center items-center">
          <Text className="text-lg text-gray-600">Loading campaigns...</Text>
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledView className="flex-1">
        <StyledView className="flex-1 pt-12">
          <CampaignList
            campaigns={campaigns}
            onCampaignPress={handleJoinCampaign}
          />
        </StyledView>

        <BottomTabBar activeTab="explore" />
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default ExploreScreen;
