import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

interface TabItemProps {
  id: string;
  label: string;
  isActive: boolean;
  icon: React.ReactNode;
  primaryColor: string;
  onPress: (id: string) => void;
}

export default function TabItem({ id, label, isActive, icon, primaryColor, onPress }: TabItemProps) {
  return (
    <StyledTouchableOpacity
      key={id}
      onPress={() => onPress(id)}
      className="flex-1 items-center py-2"
      activeOpacity={0.7}
    >
      <StyledView className="mb-1">{icon}</StyledView>
      <StyledText
        className={`text-xs font-medium ${
          isActive ? "text-gray-800" : "text-gray-600"
        }`}
        style={{
          color: isActive ? primaryColor : "#6B7280",
        }}
      >
        {label}
      </StyledText>
    </StyledTouchableOpacity>
  );
}
