import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import Svg, { Path } from "react-native-svg";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface CampaignCardProps {
  title: string;
  description: string;
  onPress: () => void;
  participants?: number;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  title,
  description,
  onPress,
  participants = 0,
}) => {
  const QRIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 7V5C3 3.89543 3.89543 3 5 3H7M3 17V19C3 20.1046 3.89543 21 5 21H7M17 3H19C20.1046 3 21 3.89543 21 5V7M17 21H19C20.1046 21 21 20.1046 21 19V17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M8 8H10V10H8V8Z" fill="currentColor" />
      <Path d="M14 8H16V10H14V8Z" fill="currentColor" />
      <Path d="M8 14H10V16H8V14Z" fill="currentColor" />
      <Path d="M14 14H16V16H14V14Z" fill="currentColor" />
    </Svg>
  );

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-6 mb-4 border border-gray-200 shadow-sm"
      activeOpacity={0.7}
    >
      <StyledView className="flex-row items-center justify-between mb-4">
        <StyledView className="flex-1">
          <StyledText className="text-xl font-bold text-gray-900 mb-2">
            {title}
          </StyledText>
          <StyledText className="text-gray-600 text-base">
            {description}
          </StyledText>
        </StyledView>
        <StyledView className="ml-4">
          <QRIcon />
        </StyledView>
      </StyledView>

      <StyledView className="flex-row items-center justify-between">
        <StyledText className="text-sm text-gray-500">
          {participants} participants joined
        </StyledText>
        <StyledView className="bg-blue-600 px-4 py-2 rounded-full">
          <StyledText className="text-white font-medium text-sm">
            View Details
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default CampaignCard;
