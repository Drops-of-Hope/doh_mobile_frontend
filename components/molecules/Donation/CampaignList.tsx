import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styled } from "nativewind";
import CampaignCard from "../../atoms/Donation/CampaignCard";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

interface Campaign {
  id: string;
  title: string;
  description: string;
  participants: number;
}

interface CampaignListProps {
  campaigns: Campaign[];
  onCampaignPress: (campaign: Campaign) => void;
}

const CampaignList: React.FC<CampaignListProps> = ({
  campaigns,
  onCampaignPress,
}) => {
  return (
    <StyledView className="flex-1">
      <StyledText className="text-2xl font-bold text-gray-900 mb-4 px-4">
        Active Campaigns
      </StyledText>
      <StyledText className="text-base text-gray-600 mb-6 px-4">
        Join a blood donation campaign and help save lives in your community
      </StyledText>

      <StyledScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
      >
        {campaigns.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            title={campaign.title}
            description={campaign.description}
            participants={campaign.participants}
            onPress={() => onCampaignPress(campaign)}
          />
        ))}

        {campaigns.length === 0 && (
          <StyledView className="flex-1 justify-center items-center py-20">
            <StyledText className="text-gray-500 text-center text-lg">
              No active campaigns available
            </StyledText>
            <StyledText className="text-gray-400 text-center mt-2">
              Check back later for new donation opportunities
            </StyledText>
          </StyledView>
        )}
      </StyledScrollView>
    </StyledView>
  );
};

export default CampaignList;
