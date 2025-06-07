// components/molecules/TitlePage.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Svg, Path } from 'react-native-svg';

interface TitlePageProps {
  showWelcomeMessage?: boolean;
  titleSize?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
}

const TitlePage: React.FC<TitlePageProps> = ({ 
  showWelcomeMessage = false, 
  titleSize = 'large',
  alignment = 'center'
}) => {
  // Blood drop with heartbeat component
  const BloodDropIcon = () => (
    <View className="items-center mb-8">
      <Svg width="120" height="160" viewBox="0 0 120 160">
        {/* Blood drop shape */}
        <Path
          d="M60 10 C60 10, 20 50, 20 90 C20 115, 37 135, 60 135 C83 135, 100 115, 100 90 C100 50, 60 10, 60 10 Z"
          fill="#DC2626"
        />
        {/* Heartbeat line */}
        <Path
          d="M15 90 L25 90 L35 70 L45 110 L55 50 L65 130 L75 90 L85 90 L95 90 L105 90"
          stroke="white"
          strokeWidth="3"
          fill="none"
        />
        {/* Highlight on drop */}
        <Path
          d="M45 45 C50 40, 55 45, 50 50 C45 55, 40 50, 45 45"
          fill="rgba(255,255,255,0.3)"
        />
      </Svg>
    </View>
  );

  const getTitleSizeClass = () => {
    switch (titleSize) {
      case 'small': return 'text-2xl';
      case 'medium': return 'text-3xl';
      case 'large': return 'text-4xl';
      default: return 'text-4xl';
    }
  };

  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left': return 'text-left items-start';
      case 'right': return 'text-right items-end';
      case 'center': return 'text-center items-center';
      default: return 'text-center items-center';
    }
  };

  return (
    <View className={`${getAlignmentClass()}`}>
      {/* Blood drop icon */}
      <BloodDropIcon />
      
      {/* Title */}
      <Text className={`${getTitleSizeClass()} font-bold text-gray-800 mb-4 ${alignment === 'center' ? 'text-center' : alignment === 'left' ? 'text-left' : 'text-right'}`}>
        Drops of Hope
      </Text>
      
      {/* Subtitle */}
      <Text className={`text-lg text-gray-600 mb-8 px-4 ${alignment === 'center' ? 'text-center' : alignment === 'left' ? 'text-left' : 'text-right'}`}>
        Connecting lifelines one drop at a time
      </Text>
      
      {/* Conditional Welcome message */}
      {showWelcomeMessage && (
        <View className="px-4">
          <Text className={`text-base text-gray-700 leading-6 ${alignment === 'center' ? 'text-center' : alignment === 'left' ? 'text-left' : 'text-right'}`}>
            Welcome to our community of life-savers.{'\n'}
            Your contribution makes a difference.
          </Text>
        </View>
      )}
    </View>
  );
};

export default TitlePage;