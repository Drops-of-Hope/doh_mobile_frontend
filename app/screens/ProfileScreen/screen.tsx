import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";

// Import refactored components
import ProfileHeader from "./molecules/ProfileHeader";
import MenuSection from "./molecules/MenuSection";

// Import modal organisms
import LanguageModal from "./organisms/LanguageModal";
import FAQModal from "./organisms/FAQModal";
import EditProfileModal from "./organisms/EditProfileModal";

// Import existing bottom tab bar
import BottomTabBar from "../../../components/organisms/BottomTabBar";

// Import types and utilities
import { UserData, MenuItem } from "./types";
import {
  createMenuItems,
  getMockUserData,
  getRoleMembershipType,
} from "./utils";

// Import context
import { useAuth, USER_ROLES } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface ProfileScreenProps {
  navigation?: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  // Auth and Language
  const { user, userRole, logout, hasRole, getFullName } = useAuth();
  const { t } = useLanguage();

  // State management
  const [userData, setUserData] = useState<UserData>({
    name: "Loading...",
    email: "Loading...",
    bloodType: "Loading...",
    mobileNumber: "Loading...",
    donationBadge: "BRONZE",
    imageUri: "https://example.com/profile-image.jpg",
    membershipType: "DONOR",
  });

  // Modal states
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    try {
      if (user) {
        const mockData = getMockUserData(user, getFullName);
        setUserData({
          ...mockData,
          membershipType: getRoleMembershipType(userRole),
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  // Navigation handlers
  const handleEditProfile = () => {
    setShowEditProfileModal(true);
  };

  const handleMyDonations = () => {
    navigation?.navigate("MyDonations");
  };

  const handleActivities = () => {
    navigation?.navigate("Activities");
  };

  const handleCampaignDashboard = () => {
    // Check if user is already a camp organizer
    if (hasRole(USER_ROLES.CAMP_ORGANIZER)) {
      navigation?.navigate("CampaignDashboard");
    } else {
      // Show application dialog for becoming camp organizer
      Alert.alert(
        t("profile.camp_organizer_application"),
        t("profile.camp_organizer_message"),
        [
          {
            text: t("common.cancel"),
            style: "cancel",
          },
          {
            text: t("profile.apply"),
            onPress: () => {
              Alert.alert(
                t("profile.application_submitted"),
                t("profile.application_success_message"),
                [{ text: t("common.ok") }]
              );
            },
          },
        ]
      );
    }
  };

  const handleLanguageSettings = () => {
    setShowLanguageModal(true);
  };

  const handleFAQs = () => {
    setShowFAQModal(true);
  };

  const handleLogout = async () => {
    Alert.alert(t("profile.logout_confirmation"), t("profile.logout_message"), [
      {
        text: t("common.cancel"),
        style: "cancel",
      },
      {
        text: t("profile.logout"),
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
          } catch (error) {
            console.error("Logout failed:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  // Menu item handlers
  const menuItems = createMenuItems(userRole, hasRole, {
    onEditProfile: handleEditProfile,
    onMyDonations: handleMyDonations,
    onActivities: handleActivities,
    onCampaignDashboard: handleCampaignDashboard,
    onLanguageSettings: handleLanguageSettings,
    onFAQs: handleFAQs,
    onLogout: handleLogout,
  });

  const handleMenuItemPress = (item: MenuItem) => {
    item.onPress();
  };

  // Modal close handlers
  const closeLanguageModal = () => setShowLanguageModal(false);
  const closeFAQModal = () => setShowFAQModal(false);
  const closeEditProfileModal = () => {
    setShowEditProfileModal(false);
    loadUserData(); // Reload data after editing
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader userData={userData} onEditProfile={handleEditProfile} />

        <MenuSection menuItems={menuItems} onItemPress={handleMenuItemPress} />

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Modals */}
      <LanguageModal visible={showLanguageModal} onClose={closeLanguageModal} />

      <FAQModal visible={showFAQModal} onClose={closeFAQModal} />

      <EditProfileModal
        visible={showEditProfileModal}
        onClose={closeEditProfileModal}
      />

      <BottomTabBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 100,
  },
});
