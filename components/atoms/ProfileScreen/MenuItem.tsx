import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { styled } from "nativewind";

// NativeWind-enhanced components
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  showArrow = true,
}) => {
  return (
    <StyledTouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between py-4 px-6 bg-white"
      activeOpacity={0.7}
    >
      <StyledView className="flex-row items-center">
        <StyledView className="w-6 h-6 mr-4">{icon}</StyledView>
        <StyledText className="text-base text-gray-900 font-medium">
          {title}
        </StyledText>
      </StyledView>

      {showArrow && (
        <StyledView className="w-2 h-2 border-r-2 border-b-2 border-gray-400" />
      )}
    </StyledTouchableOpacity>
  );
};

export default MenuItem;
