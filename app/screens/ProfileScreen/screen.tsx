import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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
import { useAuthUser } from "../../hooks/useAuthUser";
import {
  debugUserIds,
  validateUserDataConsistency,
  clearAllUserData,
} from "../../utils/userDataUtils";

// Import the profile completion screen
import ProfileCompletionScreen from "../ProfileCompletionScreen";

interface ProfileScreenProps {
  navigation?: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  // Auth and Language
  const { user, userRole, logout, hasRole, getFullName } = useAuth();
  const { t } = useLanguage();
  // Initialize auth user hook
  const { getStoredUserData, processAuthUser } = useAuthUser();

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
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [user]);

  // New effect to handle auth user processing
  useEffect(() => {
    const handleAuthUserProcessing = async () => {
      if (user && !isLoadingProfile) {
        try {
          // Check if we have stored user data
          const storedUserData = await getStoredUserData();

          if (!storedUserData) {
            // User is authenticated but not in our database
            // Process the auth user (create or login)
            console.log("🔄 Processing auth user for database creation...");
            console.log("👤 User data from AuthContext:", user);

            // Transform user data to the format expected by processAuthUser
            const authData = {
              sub: user.sub,
              email: user.email,
              birthdate: user.birthdate || "",
              family_name:
                user.family_name || user.name.split(" ").slice(-1)[0] || "",
              given_name: user.given_name || user.name.split(" ")[0] || "",
              roles: user.roles || [],
              updated_at: user.updated_at || Date.now(),
              username: user.username || user.email,
            };

            console.log("📡 Sending auth data to backend:", authData);

            try {
              const result = await processAuthUser(authData);
              console.log("✅ Backend response:", result);

              // After processing, reload user data which will trigger profile completion if needed
              await loadUserData();
            } catch (error) {
              console.error("❌ Backend API call failed:", error);
              console.error(
                "🔍 This likely means the backend endpoints don't exist yet"
              );
            }
          }
        } catch (error) {
          console.error("Error processing auth user:", error);
        }
      }
    };

    handleAuthUserProcessing();
  }, [user, isLoadingProfile]);

  const loadUserData = async () => {
    try {
      setIsLoadingProfile(true);

      if (user) {
        console.log("ProfileScreen: Loading user data for user ID:", user.sub);
        console.log("ProfileScreen: Current user from AuthContext:", user);

        // Debug user data consistency
        await debugUserIds();
        const isConsistent = await validateUserDataConsistency();

        if (!isConsistent) {
          console.log(
            "ProfileScreen: User data inconsistency detected, clearing all data"
          );
          await clearAllUserData();

          // Use mock data after clearing
          const mockData = getMockUserData(user, getFullName);
          setUserData({
            ...mockData,
            membershipType: getRoleMembershipType(userRole),
          });
          return;
        }

        // First, get stored user data from auth service
        const storedUserData = await getStoredUserData();
        console.log("ProfileScreen: Stored user data:", storedUserData);

        if (storedUserData) {
          console.log(
            "ProfileScreen: Using stored user data for user ID:",
            storedUserData.id
          );

          // Verify the stored data matches the current authenticated user
          if (storedUserData.id !== user.sub) {
            console.warn("ProfileScreen: Stored user data ID mismatch!");
            console.warn("ProfileScreen: Expected user ID:", user.sub);
            console.warn("ProfileScreen: Stored user ID:", storedUserData.id);
            console.warn("ProfileScreen: Clearing mismatched stored data...");

            // Clear the mismatched data
            await clearAllUserData();

            // Fallback to mock data with correct user info
            const mockData = getMockUserData(user, getFullName);
            setUserData({
              ...mockData,
              membershipType: getRoleMembershipType(userRole),
            });

            return;
          }

          // Check if profile needs completion
          const needsCompletion = !storedUserData.isProfileComplete;

          if (needsCompletion) {
            console.log("ProfileScreen: Profile needs completion");
            setShowProfileCompletion(true);
            return;
          }

          // Update userData with real data
          console.log("ProfileScreen: Setting user data from stored data");
          setUserData({
            name: storedUserData.name,
            email: storedUserData.email,
            bloodType: storedUserData.bloodGroup || "Unknown",
            mobileNumber: "Not provided", // We don't have this in auth data
            donationBadge: storedUserData.donationBadge as any,
            imageUri: "https://preview.redd.it/i-love-this-girl-please-give-me-all-your-lupa-screenshots-v0-pi1gbw98vv6f1.png?width=1080&format=png&auto=webp&s=c9027c37af9690e627905354c3183f94a17ff5e8",
            membershipType: getRoleMembershipType(userRole),
          });
        } else {
          console.log("ProfileScreen: No stored user data, using auth data");
          // Fallback to mock data if no stored data
          const mockData = getMockUserData(user, getFullName);
          setUserData({
            ...mockData,
            membershipType: getRoleMembershipType(userRole),
          });
        }
      }
    } catch (error) {
      console.error("ProfileScreen: Error loading user data:", error);
      // Fallback to mock data on error
      if (user) {
        console.log("ProfileScreen: Using fallback mock data due to error");
        const mockData = getMockUserData(user, getFullName);
        setUserData({
          ...mockData,
          membershipType: getRoleMembershipType(userRole),
        });
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Navigation handlers
  const handleEditProfile = () => {
    setShowEditProfileModal(true);
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
            Alert.alert(t("common.error"), t("profile.logout_error"));
          }
        },
      },
    ]);
  };

  // Menu item handlers
  const menuItems = createMenuItems(userRole, hasRole, t, {
    onEditProfile: handleEditProfile,
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

      {showProfileCompletion ? (
        <ProfileCompletionScreen
          userId={user?.sub || ""}
          onComplete={(userInfo) => {
            console.log("🎉 Profile completion successful:", userInfo);
            setShowProfileCompletion(false);
            loadUserData(); // Reload data after profile completion
          }}
          onSkip={() => {
            console.log("⏭️ Profile completion skipped");
            setShowProfileCompletion(false);
          }}
        />
      ) : isLoadingProfile ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading profile...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            <ProfileHeader
              userData={userData}
              onEditProfile={handleEditProfile}
            />

            <MenuSection
              menuItems={menuItems}
              onItemPress={handleMenuItemPress}
            />

            <View style={styles.bottomPadding} />
          </ScrollView>

          {/* Modals */}
          <LanguageModal
            visible={showLanguageModal}
            onClose={closeLanguageModal}
          />

          <FAQModal visible={showFAQModal} onClose={closeFAQModal} />

          <EditProfileModal
            visible={showEditProfileModal}
            onClose={closeEditProfileModal}
          />
        </>
      )}

      <BottomTabBar activeTab="account" />
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
