// Home screen — "Ink & Paper" rebuild.
// Content order is deliberate: eligibility hero -> emergencies (time-critical,
// outranks stats) -> stats -> campaigns. The nearest upcoming appointment
// floats: when it's 3 days out or closer it sits directly under the hero as a
// crimson alarm card, otherwise it drops below the stats strip.
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";

import { Screen, StatRow, StatTile } from "../../design";

import HomeHero from "./organisms/HomeHero";
import UpcomingAppointmentCard from "./molecules/UpcomingAppointmentCard";
import ComponentRow from "./molecules/ComponentRow";
import EmergenciesSection from "./organisms/EmergenciesSection";
import EmergencyDetailsModal from "./organisms/EmergencyDetailsModal";
import CampaignsSection from "./organisms/CampaignsSection";
import ThankYouCard from "./molecules/ThankYouCard";
import HomeScreenSkeleton from "../shared/molecules/skeletons/HomeScreenSkeleton";
import ProfileCompletionScreen from "../ProfileCompletionScreen/screen";
import DonorIdCard from "../shared/organisms/DonorIdCard";

import { Emergency } from "./molecules/EmergencyCard";
import { homeService, HomeScreenData } from "../../services/homeService";
import { userService } from "../../services/userService";

import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthUser } from "../../hooks/useAuthUser";

import { getUrgency, isUrgent } from "../../utils/appointmentUrgency";
import { logger } from "../../utils/logger";

interface HomeScreenProps {
  navigation?: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // State management
  const [homeData, setHomeData] = useState<HomeScreenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showIdCard, setShowIdCard] = useState(false);

  // Context
  const { user, getFirstName } = useAuth();
  const { t } = useLanguage();
  const { getStoredUserData, processAuthUser } = useAuthUser();

  // Helper functions
  const getLastDonationDays = () => {
    if (!homeData?.userStats?.lastDonationDate) return null;
    const lastDonation = new Date(homeData.userStats.lastDonationDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format badge name for display (e.g., "BRONZE" -> "Bronze Donor")
  const formatBadgeName = (badge: string | undefined): string => {
    if (!badge) return "Bronze Donor"; // Default

    const formatted = badge.charAt(0).toUpperCase() + badge.slice(1).toLowerCase();
    return `${formatted} Donor`;
  };

  // Get donor badge from stored user data
  const getDonorBadge = async (): Promise<string> => {
    try {
      const userData = await getStoredUserData();
      return formatBadgeName(userData?.donationBadge);
    } catch (error) {
      logger.error("Error getting donor badge:", error);
      return "Bronze Donor"; // Default fallback
    }
  };

  const [donorBadge, setDonorBadge] = useState<string>("Bronze Donor");

  useEffect(() => {
    initializeUser();
    getDonorBadge().then(setDonorBadge);
    // Best-effort avatar fetch for the header; the initials fallback covers failure.
    userService
      .getUserProfile()
      .then((profile) => setAvatarUrl(profile.profileImageUrl ?? null))
      .catch(() => {});
  }, []);

  const initializeUser = async () => {
    try {
      // First check if we have stored user data
      let userData = await getStoredUserData();

      // If no stored user data but we have an authenticated user,
      // we need to process/create the user in the backend
      if (!userData && user?.sub) {
        const authData = {
          sub: user.sub,
          email: user.email,
          given_name: user.given_name || user.name?.split(" ")[0] || "User",
          family_name: user.family_name || user.name?.split(" ").slice(1).join(" ") || "",
          name: user.name || `${user.given_name} ${user.family_name}`,
          roles: user.roles || [],
          birthdate: user.birthdate || "",
          username: user.username || user.email,
          updated_at: Math.floor(Date.now() / 1000),
        };

        // Process the user (creates in backend if needed)
        userData = await processAuthUser(authData);
      }

      await checkProfileCompletion(userData);
      await loadHomeData();
    } catch (error) {
      logger.error("❌ Error initializing user:", error);
      Alert.alert(
        "Initialization Error",
        "Failed to initialize user data. Please try logging out and back in.",
        [{ text: "OK" }]
      );
    }
  };

  const checkProfileCompletion = async (userData?: any) => {
    try {
      const userDataToCheck = userData || (await getStoredUserData());

      if (!userDataToCheck) {
        return;
      }

      if (userDataToCheck?.needsProfileCompletion) {
        setShowProfileCompletion(true);
        return;
      }
    } catch (error) {
      logger.error("Error checking profile completion:", error);
    }
  };

  const loadHomeData = async () => {
    // Don't load if profile completion is needed
    if (showProfileCompletion) return;

    try {
      setLoading(true);
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (error) {
      logger.error("Failed to load home data:", error);

      // Check if error is due to user not existing
      if (error instanceof Error && error.message.includes("User not found")) {
        setShowProfileCompletion(true);
        return;
      }

      Alert.alert(t("home.error_title"), t("home.load_error"), [{ text: t("common.ok") }]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async (userInfo: any) => {
    setShowProfileCompletion(false);
    await loadHomeData();
  };

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (error) {
      logger.error("Failed to refresh home data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleViewAllEmergencies = () => {
    navigation?.navigate("AllEmergencies");
  };

  const handleDonatePress = () => {
    navigation?.navigate("Donate");
  };

  const handleAvatarPress = () => {
    // AvatarPicker lives in the Profile tab's stack.
    navigation?.navigate("ProfileTab", { screen: "AvatarPicker" });
  };

  const handleShowIdPress = () => setShowIdCard(true);

  // Transform data for existing components
  const getEmergenciesData = (): Emergency[] => {
    if (!homeData?.emergencies) return [];

    return homeData.emergencies.map((emergency, index) => {
      const parsedId = emergency.id ? parseInt(emergency.id, 10) : null;
      const uniqueId = parsedId && !isNaN(parsedId) ? parsedId : index + 1000;

      return {
        id: uniqueId,
        hospital: emergency.hospital?.name || "",
        bloodType: Array.isArray(emergency.bloodTypesNeeded) ? emergency.bloodTypesNeeded.join(", ") : "",
        slotsUsed: 0, // Calculate based on responses
        totalSlots: emergency.quantityNeeded
          ? Object.values(emergency.quantityNeeded).reduce((a, b) => a + b, 0)
          : 0,
        urgency: emergency.urgencyLevel as any,
        timeLeft: calculateTimeLeft(emergency.expiresAt),
        description: emergency.description || "",
        contactNumber: emergency.contactNumber || "",
        address: emergency.hospital?.address || "",
        requirements: emergency.specialInstructions || "",
      };
    });
  };

  const getCampaignsData = () => {
    if (!homeData?.featuredCampaigns) return [];

    return homeData.featuredCampaigns.map((campaign, index) => {
      const parsedId = campaign.id ? parseInt(campaign.id, 10) : null;
      return {
        id: parsedId && !isNaN(parsedId) ? parsedId : index + 2000,
        title: campaign.title,
        date: formatDate(campaign.startTime),
        location: campaign.location,
        slotsUsed: campaign.actualDonors || 0,
        totalSlots: campaign.expectedDonors || 0,
        urgency: "Low" as const,
      };
    });
  };

  const calculateTimeLeft = (expiresAt: string): string => {
    if (!expiresAt) return t("home.expired");

    const now = new Date();
    const expiry = new Date(expiresAt);

    if (isNaN(expiry.getTime())) return t("home.expired");

    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return t("home.expired");

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return t("home.time_left_hours", { hours, minutes });
    }
    return t("home.time_left_minutes", { minutes });
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toLocaleDateString();
  };

  if (showProfileCompletion) {
    return (
      <ProfileCompletionScreen
        userId={user?.sub || ""}
        onComplete={handleProfileComplete}
        onSkip={() => setShowProfileCompletion(false)}
      />
    );
  }

  const emergencies = getEmergenciesData();
  const campaigns = getCampaignsData();

  // The backend returns upcomingAppointments nearest-first and now includes
  // today, so [0] is always the one to surface.
  const nextAppointment = homeData?.upcomingAppointments?.[0] ?? null;
  const nextAppointmentIsUrgent = nextAppointment
    ? isUrgent(getUrgency(nextAppointment.appointmentDateTime))
    : false;

  const appointmentCard = nextAppointment ? (
    <View style={styles.section}>
      <UpcomingAppointmentCard
        appointment={nextAppointment}
        userName={user?.name || getFirstName() || "User"}
        userEmail={user?.email || ""}
        userUID={user?.sub || ""}
      />
    </View>
  ) : null;

  return (
    <Screen scroll={!loading} refreshing={refreshing} onRefresh={handleRefresh}>
      {loading ? (
        <HomeScreenSkeleton />
      ) : (
        <>
          <View style={styles.section}>
            <HomeHero
              firstName={getFirstName() || "User"}
              donorLevel={donorBadge}
              avatarUrl={avatarUrl}
              avatarSeed={user?.sub}
              onAvatarPress={handleAvatarPress}
              lastDonationDate={homeData?.userStats?.lastDonationDate}
              nextEligibleDate={homeData?.userStats?.nextEligibleDate}
              eligibleToDonate={homeData?.userStats?.eligibleToDonate}
              onDonatePress={handleDonatePress}
              onShowIdPress={handleShowIdPress}
            />
          </View>

          {/* 2. Imminent appointment (<= 3 days) — never buried below stats */}
          {nextAppointmentIsUrgent ? appointmentCard : null}

          {/* 3. Emergencies — time-critical, outranks stats */}
          {emergencies.length > 0 && (
            <View style={styles.section}>
              <EmergenciesSection
                emergencies={emergencies}
                onDonate={handleDonatePress}
                onViewDetails={setSelectedEmergency}
                onViewAll={handleViewAllEmergencies}
              />
            </View>
          )}

          {/* 4. Stats strip */}
          {homeData?.userStats && (
            <View style={styles.section}>
              <StatRow>
                <StatTile value={homeData.userStats.totalDonations} label={t("home.donations")} />
                <StatTile value={homeData.userStats.totalPoints} label={t("home.points")} />
                <StatTile value={homeData.userStats.donationStreak} label={t("home.streak")} />
              </StatRow>
            </View>
          )}

          {homeData?.userStats?.lastDonationDate && (
            <View style={styles.section}>
              <ComponentRow lastDonationDays={getLastDonationDays() || 0} />
            </View>
          )}

          {/* 5. Distant appointment (4+ days) — informational, not urgent */}
          {nextAppointmentIsUrgent ? null : appointmentCard}

          {/* 6. Campaigns */}
          {campaigns.length > 0 && (
            <View style={styles.section}>
              <CampaignsSection
                campaigns={campaigns}
                onViewAll={() => navigation?.navigate("AllCampaigns")}
              />
            </View>
          )}

          {/* 7. Thank you */}
          <ThankYouCard
            totalDonations={homeData?.userStats?.totalDonations ?? 0}
            firstName={getFirstName() || "User"}
          />
        </>
      )}

      <EmergencyDetailsModal
        visible={selectedEmergency !== null}
        emergency={selectedEmergency}
        onClose={() => setSelectedEmergency(null)}
        onDonate={() => {
          setSelectedEmergency(null);
          handleDonatePress();
        }}
      />

      <DonorIdCard visible={showIdCard} onClose={() => setShowIdCard(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
});
