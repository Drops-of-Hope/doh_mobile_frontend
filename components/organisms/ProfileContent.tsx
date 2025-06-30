//components/organisms/ProfileContent.tsx
import React from "react";
import { ScrollView, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import ProfileHeader from "../molecules/ProfileScreen/ProfileHeader";
import MenuSection from "../molecules/ProfileScreen/MenuSection";
import Button from "../atoms/ProfileScreen/Button";

interface ProfileContentProps {
  userData: {
    name: string;
    email: string;
    imageUri?: string;
    membershipType?: string;
  };

  onEditProfile?: () => void;
  onProfilePicturePress?: () => void;
  onMyDonations?: () => void;
  onDonationEligibility?: () => void;
  onUpcomingAppointment?: () => void;
  onLanguage?: () => void;
  onNotifications?: () => void;
  onFAQs?: () => void;
  onLogOut?: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  userData,
  onEditProfile,
  onProfilePicturePress,
  onMyDonations,
  onDonationEligibility,
  onUpcomingAppointment,
  onLanguage,
  onNotifications,
  onFAQs,
  onLogOut,
}) => {
  // Icons as simple components (you can replace with your preferred icon library)
  const DropIcon = () => (
    <View className="w-5 h-5 rounded-full">
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
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
        />
      </Svg>
    </View>
  );

  const Elligibility = () => (
    <View className="w-5 h-5 rounded-full">
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
          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
        />
      </Svg>
    </View>
  );

  const CalendarIcon = () => (
    <View className="w-5 h-5 rounded-sm">
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
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
        />
      </Svg>
    </View>
  );

  const GlobeIcon = () => (
    <View className="w-5 h-5 rounded-full">
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
          d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
        />
      </Svg>
    </View>
  );

  const BellIcon = () => (
    <View className="w-5 h-5 rounded-sm">
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
          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
        />
      </Svg>
    </View>
  );

  const QuestionIcon = () => (
    <View className="w-5 h-5 rounded-full">
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
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
      </Svg>
    </View>
  );

  const mainMenuItems = [
    {
      id: "donations",
      icon: <DropIcon />,
      title: "My Donations",
      onPress: onMyDonations,
    },
    {
      id: "eligibility",
      icon: <Elligibility />,
      title: "Donation Eligibility",
      onPress: onDonationEligibility,
    },
    {
      id: "appointment",
      icon: <CalendarIcon />,
      title: "Upcoming appointment",
      onPress: onUpcomingAppointment,
    },
  ];

  const settingsMenuItems = [
    {
      id: "language",
      icon: <GlobeIcon />,
      title: "Language",
      onPress: onLanguage,
    },
    {
      id: "notifications",
      icon: <BellIcon />,
      title: "Notifications",
      onPress: onNotifications,
    },
    {
      id: "faqs",
      icon: <QuestionIcon />,
      title: "FAQs",
      onPress: onFAQs,
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="mt-8">
        <ProfileHeader
          name={userData.name}
          email={userData.email}
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
          title="Log Out"
          variant="outline"
          size="lg"
          onPress={onLogOut}
        />
      </View>
    </ScrollView>
  );
};

export default ProfileContent;
