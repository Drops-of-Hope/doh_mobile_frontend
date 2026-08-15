import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { User, ListChecks, BarChart3, HelpCircle, Globe, IdCard, LucideIcon } from "lucide-react-native";

// Import refactored components
import ProfileHeader from "./molecules/ProfileHeader";
import AchievementsSection, { BadgeProgressInfo } from "./molecules/AchievementsSection";
import LogoutButton from "./atoms/LogoutButton";
import BecomeCampaignOrganizerButton from "./atoms/BecomeCampaignOrganizerButton";

// Import design system
import { Text, ListRow, ListSection, SectionHeader, Icon, useTheme } from "../../design";
import DonorIdCard from "../shared/organisms/DonorIdCard";

// Import types and utilities
import { UserData, MenuItem } from "./types";
import { createMenuItems, getRoleMembershipType } from "./utils";

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
import { userService } from "../../services/userService";
import { DONOR_BADGE_DISPLAY } from "../../../constants/badgeDisplay";

// Import the profile completion screen
import ProfileCompletionScreen from "../ProfileCompletionScreen/screen";

import { logger } from "../../utils/logger";
interface ProfileScreenProps {
  navigation?: any;
}

// Maps the menu item ids produced by utils.ts#createMenuItems to lucide icons.
const MENU_ICONS: Record<string, LucideIcon> = {
  "edit-profile": User,
  "show-id": IdCard,
  activities: ListChecks,
  "campaign-dashboard": BarChart3,
  faq: HelpCircle,
  language: Globe,
};

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const theme = useTheme();
  // Auth and Language
  const { user, userRole, logout, hasRole } = useAuth();
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
    membershipType: "DONOR",
  });

  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [hasEmergencyResponderBadge, setHasEmergencyResponderBadge] = useState(false);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgressInfo | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);

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

        const currentTier = badgeInfo.currentBadge?.badge || userData.donationBadge;
        const progressInfo = badgeService.calculateBadgeProgress(badgeInfo.totalDonations, currentTier);
        setBadgeProgress({
          progress: progressInfo.progress / 100,
          nextTierLabel: progressInfo.nextBadge?.name ?? null,
          donationsNeeded: progressInfo.donationsNeeded,
        });
      } catch (error) {
        logger.error("ProfileScreen: Failed to load achievements:", error);
      }
    };

    if (!isLoadingProfile) {
      loadAchievements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingProfile]);

  // Fetch the real profile image (never a hardcoded placeholder) once the
  // profile has finished loading.
  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const profile = await userService.getUserProfile();
        setUserData((prev) => ({ ...prev, profileImageUrl: profile.profileImageUrl }));
      } catch (error) {
        logger.error("ProfileScreen: Failed to load profile image:", error);
      }
    };

    if (!isLoadingProfile && user) {
      loadProfileImage();
    }
  }, [isLoadingProfile, user]);

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
              logger.error("Backend API call failed:", error);
              logger.error(
                "This likely means the backend endpoints don't exist yet"
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
          setUserData((prev) => ({
            ...prev,
            name: storedUserData.name,
            email: storedUserData.email,
            bloodType: storedUserData.bloodGroup || "Unknown",
            mobileNumber: "Not provided", // We don't have this in auth data
            donationBadge: storedUserData.donationBadge as any,
            membershipType: getRoleMembershipType(userRole),
          }));
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
    navigation?.navigate("EditProfile");
  };

  const handleAvatarPress = () => {
    navigation?.navigate("AvatarPicker");
  };

  const handleShowId = () => setShowIdCard(true);

  const handleActivities = () => {
    navigation?.navigate("ActivitiesTab");
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
    navigation?.navigate("LanguageSelection");
  };

  const handleFAQs = () => {
    navigation?.navigate("FAQs");
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
    onShowId: handleShowId,
  });

  const renderMenuRow = (item: MenuItem) => {
    const IconComponent = MENU_ICONS[item.id] ?? User;
    return (
      <ListRow
        key={item.id}
        title={item.title}
        icon={<Icon icon={IconComponent} size={18} />}
        onPress={item.onPress}
      />
    );
  };

  const badgeDisplay = DONOR_BADGE_DISPLAY[userData.donationBadge];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.color.paper }]} edges={["top"]}>
      <StatusBar style="dark" />

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
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={theme.color.crimson} size="large" />
          <Text variant="body" tone="inkMuted" style={styles.loadingText}>
            Loading profile...
          </Text>
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
              avatarSeed={user?.sub}
              onEditProfile={handleEditProfile}
              onAvatarPress={handleAvatarPress}
            />

            <AchievementsSection
              tier={userData.donationBadge}
              tierLabel={badgeDisplay?.label ?? userData.donationBadge}
              progress={badgeProgress}
              showEmergencyBadge={hasEmergencyResponderBadge}
            />

            <View style={styles.menuSection}>
              <SectionHeader title="Account" />
              <ListSection>{accountItems.map(renderMenuRow)}</ListSection>
            </View>

            <View style={styles.menuSection}>
              <SectionHeader title="Settings" />
              <ListSection>{settingsItems.map(renderMenuRow)}</ListSection>
            </View>

            {/* Become Campaign Organizer Button - Only for Donors */}
            {shouldShowCampaignOrganizerButton() && (
              <BecomeCampaignOrganizerButton onSuccess={handleCampaignOrganizerSuccess} />
            )}

            {/* Separate Logout Button */}
            <LogoutButton onPress={handleLogout} title={t("profile.log_out")} />

            <View style={styles.bottomPadding} />
          </ScrollView>
        </>
      )}

      <DonorIdCard visible={showIdCard} onClose={() => setShowIdCard(false)} />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
