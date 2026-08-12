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
import LogoutButton from "./atoms/LogoutButton";
import BecomeCampaignOrganizerButton from "./atoms/BecomeCampaignOrganizerButton";

// Import modal organisms
import LanguageModal from "./organisms/LanguageModal";
import FAQModal from "./organisms/FAQModal";
import EditProfileModal from "./organisms/EditProfileModal";

// Import existing bottom tab bar
import BottomTabBar from "../shared/organisms/BottomTabBar";

// Import types and utilities
import { UserData, MenuItem } from "./types";
import {
  createMenuItems,
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
import { getDatabaseUserId } from "../../utils/userIdUtils";
import { badgeService } from "../../services/badgeService";
import { COLORS, SPACING } from "../../../constants/theme";
import { EMERGENCY_RESPONDER_BADGE_DISPLAY } from "../../../constants/badgeDisplay";
import BadgeChip from "../shared/atoms/BadgeChip";

// Import the profile completion screen
import ProfileCompletionScreen from "../ProfileCompletionScreen/screen";

import { logger } from "../../utils/logger";
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
  const [hasEmergencyResponderBadge, setHasEmergencyResponderBadge] = useState(false);

  useEffect(() => {
    loadUserData();
  }, [user]);

  useEffect(() => {
    const loadAchievements = async () => {
      try {
        const databaseUserId = await getDatabaseUserId();
        if (!databaseUserId) return;

        const badgeInfo = await badgeService.getBadgeInfo(databaseUserId);
        setHasEmergencyResponderBadge(badgeInfo.emergencyResponderBadge);
      } catch (error) {
        logger.error("ProfileScreen: Failed to load achievements:", error);
      }
    };

    if (!isLoadingProfile) {
      loadAchievements();
    }
  }, [isLoadingProfile]);

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

            try {
              await processAuthUser(authData);

              // After processing, reload user data which will trigger profile completion if needed
              await loadUserData();
            } catch (error) {
              logger.error("❌ Backend API call failed:", error);
              logger.error(
                "🔍 This likely means the backend endpoints don't exist yet"
              );
            }
          }
        } catch (error) {
          logger.error("Error processing auth user:", error);
        }
      }
    };

    handleAuthUserProcessing();
  }, [user, isLoadingProfile]);

  const loadUserData = async () => {
    try {
      setIsLoadingProfile(true);

      if (user) {
        // Debug user data consistency
        await debugUserIds();
        const isConsistent = await validateUserDataConsistency();

        if (!isConsistent) {
          await clearAllUserData();

          // Set basic loading state - user needs to complete profile or re-authenticate
          setShowProfileCompletion(true);
          return;
        }

        // First, get stored user data from auth service
        const storedUserData = await getStoredUserData();

        if (storedUserData) {
          // Verify the stored data matches the current authenticated user
          if (storedUserData.id !== user.sub) {
            logger.warn("ProfileScreen: Stored user data ID mismatch!");
            logger.warn("ProfileScreen: Expected user ID:", user.sub);
            logger.warn("ProfileScreen: Stored user ID:", storedUserData.id);
            logger.warn("ProfileScreen: Clearing mismatched stored data...");

            // Clear the mismatched data
            await clearAllUserData();

            // Show profile completion for user to re-authenticate or complete profile
            setShowProfileCompletion(true);
            return;
          }

          // Check if profile needs completion
          const needsCompletion = !storedUserData.isProfileComplete;

          if (needsCompletion) {
            setShowProfileCompletion(true);
            return;
          }

          // Update userData with real data
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
          // Show profile completion screen if no stored data
          setShowProfileCompletion(true);
        }
      }
    } catch (error) {
      logger.error("ProfileScreen: Error loading user data:", error);
      // Show profile completion on error
      if (user) {
        setShowProfileCompletion(true);
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
            logger.error("Logout failed:", error);
            Alert.alert(t("common.error"), t("profile.logout_error"));
          }
        },
      },
    ]);
  };

  // Handler for successful campaign organizer role assignment
  const handleCampaignOrganizerSuccess = async () => {
    // Directly call logout without confirmation since user already confirmed
    try {
      await logout();
    } catch (error) {
      logger.error("Logout after role assignment failed:", error);
      // Still try to show message even if logout fails
      Alert.alert(
        "Please Re-login",
        "Please close and reopen the app to see your new permissions."
      );
    }
  };

  // Check if user should see the "Become Campaign Organizer" button
  const shouldShowCampaignOrganizerButton = (): boolean => {
    // Only show for donors who don't already have the campaign organizer role
    const isDonor = hasRole(USER_ROLES.DONOR) || hasRole(USER_ROLES.SELFSIGNUP);
    const isAlreadyCampaignOrganizer = hasRole(USER_ROLES.CAMP_ORGANIZER);
    
    return isDonor && !isAlreadyCampaignOrganizer;
  };

  // Menu item handlers
  const { accountItems, settingsItems } = createMenuItems(userRole, hasRole, t, {
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
          onComplete={() => {
            setShowProfileCompletion(false);
            loadUserData(); // Reload data after profile completion
          }}
          onSkip={() => {
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
            contentContainerStyle={styles.scrollContent}
          >
            <ProfileHeader
              userData={userData}
              onEditProfile={handleEditProfile}
            />

            {hasEmergencyResponderBadge && (
              <View style={styles.achievementsSection}>
                <Text style={styles.achievementsTitle}>Achievements</Text>
                <BadgeChip
                  icon={EMERGENCY_RESPONDER_BADGE_DISPLAY.icon}
                  label={EMERGENCY_RESPONDER_BADGE_DISPLAY.label}
                  color={EMERGENCY_RESPONDER_BADGE_DISPLAY.color}
                />
              </View>
            )}

            <MenuSection
              title="Account"
              menuItems={accountItems}
              onItemPress={handleMenuItemPress}
            />

            <MenuSection
              title="Settings"
              menuItems={settingsItems}
              onItemPress={handleMenuItemPress}
            />

            {/* Become Campaign Organizer Button - Only for Donors */}
            {shouldShowCampaignOrganizerButton() && (
              <BecomeCampaignOrganizerButton
                onSuccess={handleCampaignOrganizerSuccess}
              />
            )}

            {/* Separate Logout Button */}
            <LogoutButton onPress={handleLogout} title={t("profile.log_out")} />

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
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.XL,
  },
  bottomPadding: {
    height: 100,
  },
  achievementsSection: {
    paddingHorizontal: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  achievementsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.TEXT_SECONDARY,
    marginBottom: SPACING.XS,
  },
});
