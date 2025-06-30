import React from "react";
import { View, SafeAreaView } from "react-native";
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
      <View className="flex-1 pt-10">
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

        <BottomTabBar activeTab="account" />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
