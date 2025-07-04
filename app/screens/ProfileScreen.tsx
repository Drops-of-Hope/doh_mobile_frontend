import React, { useEffect, useState } from "react";
import { View, SafeAreaView, Alert, Modal } from "react-native";
import ProfileContent from "../../components/organisms/ProfileContent";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import LanguageSelectionScreen from "./LanguageSelectionScreen";
import FAQsScreen from "./FAQsScreen";
import EditProfileScreen from "./EditProfileScreen";
import { useAuth, USER_ROLES } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { RoleBasedAccess } from "../utils/roleBasedAccess";

const ProfileScreen: React.FC = () => {
  const { user, userRole, logout, hasRole, getFullName } = useAuth();
  const { t } = useLanguage();
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "Loading...",
    imageUri: "https://example.com/profile-image.jpg",
    membershipType: "MEMBER",
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      if (user) {
        setUserData({
          name: getFullName(),
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
    setShowEditProfileModal(true);
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
    setShowLanguageModal(true);
  };

  const handleNotifications = () => {
    console.log("Notifications pressed");
    // Navigate to notification settings
  };

  const handleBecomeCampOrganizer = () => {
    console.log("Become Camp Organizer pressed");
    Alert.alert(
      t('profile.camp_organizer_application'),
      t('profile.camp_organizer_message'),
      [
        {
          text: t('common.cancel'),
          style: "cancel",
        },
        {
          text: t('profile.apply'),
          onPress: () => {
            // TODO: Navigate to camp organizer application process
            console.log("User wants to become camp organizer");
            Alert.alert(
              t('profile.application_submitted'),
              t('profile.application_success_message'),
              [{ text: t('common.ok') }]
            );
          },
        },
      ]
    );
  };

  const handleFAQs = () => {
    console.log("FAQs pressed");
    setShowFAQModal(true);
  };

  const handleLogOut = async () => {
    try {
      Alert.alert(t('profile.logout_confirm_title'), t('profile.logout_confirm_message'), [
        {
          text: t('common.cancel'),
          style: "cancel",
        },
        {
          text: t('profile.log_out'),
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
          onBecomeCampOrganizer={handleBecomeCampOrganizer}
          onFAQs={handleFAQs}
          onLogOut={handleLogOut}
        />

        <BottomTabBar activeTab="account" />
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <LanguageSelectionScreen onClose={() => setShowLanguageModal(false)} />
      </Modal>

      {/* FAQs Modal */}
      <Modal
        visible={showFAQModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <FAQsScreen onBack={() => setShowFAQModal(false)} />
      </Modal>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <EditProfileScreen onClose={() => setShowEditProfileModal(false)} />
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
