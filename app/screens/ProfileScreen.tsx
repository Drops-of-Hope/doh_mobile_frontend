import React, { useEffect, useState } from "react";
import { View, SafeAreaView } from "react-native";
import ProfileContent from "../../components/organisms/ProfileContent";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import { getAuthState, clearAuthState } from "../services/auth";
import { clearAuthToken } from "../services/api";

const ProfileScreen: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    imageUri: "https://example.com/profile-image.jpg",
    membershipType: "MEMBER",
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const authState = await getAuthState();
      if (authState && authState.idToken) {
        // Decode the ID token to get user info (basic implementation)
        const tokenParts = authState.idToken.split('.');
        const payload = JSON.parse(atob(tokenParts[1]));
        
        setUserData({
          name: payload.given_name || payload.name || "User",
          email: payload.email || "user@example.com",
          imageUri: payload.picture || "https://example.com/profile-image.jpg",
          membershipType: "ASGARDEO MEMBER",
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
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

  const handleLogOut = async () => {
    try {
      await clearAuthState();
      await clearAuthToken();
      console.log("Logged out successfully");
      // The AppNavigator will automatically redirect to login screen
    } catch (error) {
      console.error("Logout failed:", error);
    }
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

        <BottomTabBar activeTab="account" />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
