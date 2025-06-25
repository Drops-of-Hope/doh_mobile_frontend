import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import Svg, { Path } from "react-native-svg";

// NativeWind styled components
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledImage = styled(Image);

interface ProfilePictureProps {
  imageUri?: string;
  size?: "sm" | "md" | "lg";
  showCameraIcon?: boolean;
  onPress?: () => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  imageUri,
  size = "lg",
  showCameraIcon = false,
  onPress,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-20 h-20",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <StyledTouchableOpacity
      onPress={onPress}
      className="relative"
      activeOpacity={onPress ? 0.7 : 1}
    >
      <StyledView
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gray-300`}
      >
        {imageUri ? (
          <StyledImage
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <StyledView className="w-full h-full bg-gray-300" />
        )}
      </StyledView>

      {showCameraIcon && (
        <StyledView className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-md">
          <StyledView
            className={`${iconSizeClasses[size]} rounded-full items-center justify-center`}
          >
            <Svg
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
              />
              <Path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
              />
            </Svg>
          </StyledView>
        </StyledView>
      )}
    </StyledTouchableOpacity>
  );
};

export default ProfilePicture;
