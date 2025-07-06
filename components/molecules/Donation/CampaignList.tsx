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
      <StyledScrollView
        className="flex-1"
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
              No campaigns found
            </StyledText>
            <StyledText className="text-gray-400 text-center mt-2">
              Try adjusting your search or filter criteria
            </StyledText>
          </StyledView>
        )}
      </StyledScrollView>
    </StyledView>
  );
};

export default CampaignList;
