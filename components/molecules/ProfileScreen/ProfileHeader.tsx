import React from "react";
import { View, Text } from "react-native";
import ProfilePicture from "../../atoms/ProfileScreen/ProfilePicture";
import Button from "../../atoms/ProfileScreen/Button";

interface ProfileHeaderProps {
  name: string;
  email: string;
  imageUri?: string;
  membershipType?: string;
  onEditProfile?: () => void;
  onProfilePicturePress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  imageUri,
  membershipType,
  onEditProfile,
  onProfilePicturePress,
}) => {
  return (
    <View className="bg-gray-50 px-6 py-8 items-center">
      <View className="relative mb-4">
        <ProfilePicture
          imageUri={imageUri}
          size="lg"
          showCameraIcon={true}
          onPress={onProfilePicturePress}
        />
      </View>

      <Text className="text-2xl font-bold text-gray-900 mb-1">{name}</Text>

      <Text className="text-base text-gray-600 mb-4">{email}</Text>

      <Button
        title="Edit Profile"
        variant="outline"
        size="sm"
        onPress={onEditProfile}
      />

      {membershipType && (
        <View className="w-full mt-6">
          <View className="bg-red-600 rounded-full py-3 px-6">
            <Text className="text-white text-center font-bold text-lg">
              {membershipType}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ProfileHeader;
