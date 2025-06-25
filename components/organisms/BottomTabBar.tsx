import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styled } from "nativewind";

// NativeWind components
const StyledView = styled(View);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface TabItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

interface BottomTabBarProps {
  tabs: TabItem[];
}

const BottomTabBar: React.FC<BottomTabBarProps> = ({ tabs }) => {
  return (
    <StyledView className="bg-white border-t border-gray-200 px-4 py-2">
      <StyledView className="flex-row justify-around items-center">
        {tabs.map((tab) => (
          <StyledTouchableOpacity
            key={tab.id}
            onPress={tab.onPress}
            className="flex-1 items-center py-2"
            activeOpacity={0.7}
          >
            <StyledView className="mb-1">{tab.icon}</StyledView>
            <StyledText
              className={`text-xs font-medium ${
                tab.isActive ? "text-red-600" : "text-gray-600"
              }`}
            >
              {tab.label}
            </StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledView>

      {/* Bottom indicator */}
      <StyledView
        className="h-1 bg-gray-300 rounded-full mt-2 mx-auto"
        style={{ width: 134 }}
      />
    </StyledView>
  );
};

export default BottomTabBar;
