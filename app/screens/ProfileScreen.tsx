import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Alert } from "react-native";
import ProfileContent from "../../components/organisms/ProfileContent";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import { useAuth, USER_ROLES } from "../context/AuthContext";
import { RoleBasedAccess } from "../utils/roleBasedAccess";

const ProfileScreen: React.FC = () => {
  const { user, userRole, logout, hasRole } = useAuth();
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    imageUri: "https://example.com/profile-image.jpg",
    membershipType: "MEMBER",
  });

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      if (user) {
        setUserData({
          name: user.name || user.given_name || "User",
          email: user.email || "user@example.com",
          imageUri: user.picture || "https://example.com/profile-image.jpg",
          membershipType: getRoleMembershipType(),
        });
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  };

  const getRoleMembershipType = (): string => {
    if (hasRole(USER_ROLES.ADMIN)) return "ADMIN";
    if (hasRole(USER_ROLES.DONOR)) return "DONOR";
    if (hasRole(USER_ROLES.VOLUNTEER)) return "VOLUNTEER";
    if (hasRole(USER_ROLES.BENEFICIARY)) return "BENEFICIARY";
    if (hasRole(USER_ROLES.ORGANIZATION)) return "ORGANIZATION";
    return "MEMBER";
  };

  const handleEditProfile = () => {
    console.log("Edit profile pressed");
    // Navigate to edit profile screen
  };

  const handleProfilePicturePress = () => {
    console.log("Profile picture pressed");
    // Handle profile picture change
  };

  const handleMyDonations = () => {
    console.log("My Donations pressed");
    // Only show for donors and admins
    if (hasRole(USER_ROLES.DONOR) || hasRole(USER_ROLES.ADMIN)) {
      // Navigate to donations screen
    }
  };

  const handleDonationEligibility = () => {
    console.log("Donation Eligibility pressed");
    // Show donation eligibility info
  };

  const handleUpcomingAppointment = () => {
    console.log("Upcoming appointment pressed");
    // Show upcoming appointments (for volunteers and beneficiaries)
  };

  const handleLanguage = () => {
    console.log("Language pressed");
    // Navigate to language settings
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
    // Navigate to notification settings
  };

  const handleFAQs = () => {
    console.log("FAQs pressed");
    // Navigate to FAQs
  };

  const handleLogOut = async () => {
    try {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            console.log("Logged out successfully");
          },
        },
      ]);
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
