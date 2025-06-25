import React from "react";
import { View, SafeAreaView } from "react-native";
import Svg, { Path } from "react-native-svg";
import ProfileContent from "../../components/organisms/ProfileContent";
import BottomTabBar from "../../components/organisms/BottomTabBar";

const ProfileScreen: React.FC = () => {
  // Mock user data - replace with your actual data source
  const userData = {
    name: "Sabrina Aryan",
    email: "SabrinaAry208@gmail.com",
    imageUri: "https://example.com/profile-image.jpg",
    membershipType: "SILVER MEMBER",
  };

  // Tab bar icons (replace with your preferred icon library)
  const DropIcon = ({ isActive }: { isActive?: boolean }) => (
    <View className={`w-6 h-6 rounded-full `}>
      <Svg
        fill={isActive ? "#dc2626" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33"
        />
      </Svg>
    </View>
  );

  const SearchIcon = ({ isActive }: { isActive?: boolean }) => (
    <View className={`w-6 h-6 rounded-full `}>
      <Svg
        fill={isActive ? "#dc2626" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </Svg>
    </View>
  );

  const HomeIcon = ({ isActive }: { isActive?: boolean }) => (
    <View className={`w-6 h-6 rounded-sm `}>
      <Svg
        fill={isActive ? "#dc2626" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </Svg>
    </View>
  );

  const HeartIcon = ({ isActive }: { isActive?: boolean }) => (
    <View className={`w-6 h-6 rounded-full `}>
      <Svg
        fill={isActive ? "#dc2626" : "none"}
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

  const PersonIcon = ({ isActive }: { isActive?: boolean }) => (
    <View className={`w-6 h-6 rounded-full `}>
      <Svg
        fill={isActive ? "#dc2626" : "none"}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
        />
      </Svg>
    </View>
  );

  const tabItems = [
    {
      id: "donate",
      icon: <DropIcon />,
      label: "Donate",
      onPress: () => console.log("Donate pressed"),
    },
    {
      id: "explore",
      icon: <SearchIcon />,
      label: "Explore",
      onPress: () => console.log("Explore pressed"),
    },
    {
      id: "home",
      icon: <HomeIcon />,
      label: "Home",
      onPress: () => console.log("Home pressed"),
    },
    {
      id: "activities",
      icon: <HeartIcon />,
      label: "Activities",
      onPress: () => console.log("Activities pressed"),
    },
    {
      id: "account",
      icon: <PersonIcon isActive={true} />,
      label: "Account",
      isActive: true,
      onPress: () => console.log("Account pressed"),
    },
  ];

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
  };

  const handleProfilePicturePress = () => {
    console.log("Profile picture pressed");
  };

  const handleMyDonations = () => {
    console.log("My Donations pressed");
  };

  const handleDonationEligibility = () => {
    console.log("Donation Eligibility pressed");
  };

  const handleUpcomingAppointment = () => {
    console.log("Upcoming appointment pressed");
  };

  const handleLanguage = () => {
    console.log("Language pressed");
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
  };

  const handleFAQs = () => {
    console.log("FAQs pressed");
  };

  const handleLogOut = () => {
    console.log("Log Out pressed");
  };

  return (
    <SafeAreaView className="flex-1 border-white">
      <View className="flex-1">
        <ProfileContent
          userData={userData}
          onEditProfile={handleEditProfile}
          onProfilePicturePress={handleProfilePicturePress}
          onMyDonations={handleMyDonations}
          onDonationEligibility={handleDonationEligibility}
          onUpcomingAppointment={handleUpcomingAppointment}
          onLanguage={handleLanguage}
          onNotifications={handleNotifications}
          onFAQs={handleFAQs}
          onLogOut={handleLogOut}
        />

        <BottomTabBar tabs={tabItems} />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
