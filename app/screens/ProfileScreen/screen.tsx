import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
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
import { getDatabaseUserId } from "../../utils/userIdUtils";
import { badgeService } from "../../services/badgeService";
import { userService } from "../../services/userService";
import { DONOR_BADGE_DISPLAY } from "../../../constants/badgeDisplay";

import { logger } from "../../utils/logger";
import { useFocusRefresh } from "../../hooks/useFocusRefresh";
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
  // Auth and Language — AuthContext already resolved the backend profile before this
  // screen could mount (see AppNavigator), so this screen just reads it.
  const { user, userRole, logout, hasRole, profile, refreshBackendUser } = useAuth();
  const { t } = useLanguage();

  // State management
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(undefined);
  const [hasEmergencyResponderBadge, setHasEmergencyResponderBadge] = useState(false);
  const [badgeProgress, setBadgeProgress] = useState<BadgeProgressInfo | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // AppNavigator only mounts this screen once profileStatus is "complete", so `profile`
  // is expected to already be populated — this is a defensive fallback, not a real wait.
  const isLoadingProfile = !profile;

  const userData: UserData = {
    name: profile?.name ?? "Loading...",
    email: profile?.email ?? "Loading...",
    bloodType: profile?.bloodGroup || "Unknown",
    mobileNumber: "Not provided", // Not carried in the backend profile response
    donationBadge: (profile?.donationBadge as any) ?? "BRONZE",
    membershipType: getRoleMembershipType(userRole),
    profileImageUrl,
  };

  const loadAchievements = useCallback(async () => {
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
  }, [userData.donationBadge]);

  // Fetch the real profile image (never a hardcoded placeholder).
  const loadProfileImage = useCallback(async () => {
    try {
      const fullProfile = await userService.getUserProfile();
      setProfileImageUrl(fullProfile.profileImageUrl);
    } catch (error) {
      logger.error("ProfileScreen: Failed to load profile image:", error);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingProfile) {
      loadAchievements();
    }
  }, [isLoadingProfile, loadAchievements]);

  useEffect(() => {
    if (!isLoadingProfile && user) {
      loadProfileImage();
    }
  }, [isLoadingProfile, user, loadProfileImage]);

  // Badges, donation streak, and role can all change from other screens
  // (donating, campaign-organizer approval); previously only loaded once on
  // mount. `refreshBackendUser` is the non-navigator-collapsing profile
  // refresh documented on AuthContext.
  useFocusRefresh(
    useCallback(() => {
      if (isLoadingProfile) return;
      void refreshBackendUser();
      void loadAchievements();
      void loadProfileImage();
    }, [isLoadingProfile, refreshBackendUser, loadAchievements, loadProfileImage])
  );

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refreshBackendUser(), loadAchievements(), loadProfileImage()]);
    } finally {
      setRefreshing(false);
    }
  }, [refreshBackendUser, loadAchievements, loadProfileImage]);

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

      {isLoadingProfile ? (
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
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.color.crimson} />
            }
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
