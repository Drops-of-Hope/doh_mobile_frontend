//components/organisms/ProfileContent.tsx
import React from "react";
import { ScrollView, View } from "react-native";
import ProfileHeader from "../molecules/ProfileScreen/ProfileHeader";
import MenuSection from "../molecules/ProfileScreen/MenuSection";
import Button from "../atoms/ProfileScreen/Button";
import { useLanguage } from "../../app/context/LanguageContext";
import { useMenuItemsConfig } from "../molecules/ProfileScreen/MenuItemsConfig";

interface ProfileContentProps {
  userData: {
    name: string;
    email: string;
    bloodType?: string;
    mobileNumber?: string;
    donationBadge?: string;
    imageUri?: string;
    membershipType?: string;
  };
  navigation?: any; // Add navigation prop
  onEditProfile?: () => void;
  onProfilePicturePress?: () => void;
  onMyDonations?: () => void;
  onDonationEligibility?: () => void;
  onUpcomingAppointment?: () => void;
  onLanguage?: () => void;
  onNotifications?: () => void;
  onBecomeCampOrganizer?: () => void;
  onFAQs?: () => void;
  onLogOut?: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  userData,
  navigation,
  onEditProfile,
  onProfilePicturePress,
  onMyDonations,
  onDonationEligibility,
  onUpcomingAppointment,
  onLanguage,
  onNotifications,
  onBecomeCampOrganizer,
  onFAQs,
  onLogOut,
}) => {
  const { t } = useLanguage();

  // Default navigation handlers if not provided
  const handleMyDonations =
    onMyDonations || (() => navigation?.navigate("MyDonations"));
  const handleDonationEligibility =
    onDonationEligibility ||
    (() => navigation?.navigate("DonationEligibility"));
  const handleUpcomingAppointment =
    onUpcomingAppointment ||
    (() => navigation?.navigate("UpcomingAppointment"));

  const { mainMenuItems, settingsMenuItems } = useMenuItemsConfig({
    onMyDonations: handleMyDonations,
    onDonationEligibility: handleDonationEligibility,
    onUpcomingAppointment: handleUpcomingAppointment,
    onLanguage,
    onNotifications,
    onBecomeCampOrganizer,
    onFAQs,
  });

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="mt-8">
        <ProfileHeader
          name={userData.name}
          email={userData.email}
          bloodType={userData.bloodType}
          mobileNumber={userData.mobileNumber}
          donationBadge={userData.donationBadge}
          imageUri={userData.imageUri}
          membershipType={userData.membershipType}
          onEditProfile={onEditProfile}
          onProfilePicturePress={onProfilePicturePress}
        />
      </View>

      <View className="mt-4">
        <MenuSection items={mainMenuItems} />
        <MenuSection items={settingsMenuItems} />
      </View>

      <View className="px-6 py-8">
        <Button
          title={t("profile.log_out")}
          variant="outline"
          size="lg"
          onPress={onLogOut}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileContent;
