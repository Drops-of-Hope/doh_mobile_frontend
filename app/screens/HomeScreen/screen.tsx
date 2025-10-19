// Enhanced Home Screen with dynamic data integration
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native";

// Import existing components
import BottomTabBar from "../shared/organisms/BottomTabBar";
import StatsCard from "./molecules/StatsCard";
import ComponentRow from "./molecules/ComponentRow";
import EmergenciesSection from "./organisms/EmergenciesSection";
import AppointmentSection from "./organisms/AppointmentSection";
import HomeHeader from "./organisms/HomeHeader";
import NextDonationCard from "./molecules/NextDonationCard";
import ThankYouCard from "./molecules/ThankYouCard";

// Import new components
import UserQRModal from "../shared/organisms/UserQRModal";
import HomeScreenSkeleton from "../shared/molecules/skeletons/HomeScreenSkeleton";
import ProfileCompletionScreen from "../ProfileCompletionScreen/screen";

// Import services
import { homeService, HomeScreenData } from "../../services/homeService";
import { userService } from "../../services/userService";

// Import context
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useAuthUser } from "../../hooks/useAuthUser";

interface HomeScreenProps {
  navigation?: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // State management
  const [homeData, setHomeData] = useState<HomeScreenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  // Context
  const { user, getFirstName, logout } = useAuth();
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

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      // First check if we have stored user data
      let userData = await getStoredUserData();
      
      // If no stored user data but we have an authenticated user, 
      // we need to process/create the user in the backend
      if (!userData && user?.sub) {
        console.log("🔄 No stored user data found, processing auth user...");
        
        // Create AuthUserData from the current user
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
        console.log("✅ User processed successfully:", userData);
      }
      
      // Now check if profile completion is needed
      await checkProfileCompletion(userData);
      
      // Load home data
      await loadHomeData();
    } catch (error) {
      console.error("❌ Error initializing user:", error);
      Alert.alert(
        "Initialization Error",
        "Failed to initialize user data. Please try logging out and back in.",
        [{ text: "OK" }]
      );
    }
  };

  const checkProfileCompletion = async (userData?: any) => {
    try {
      const userDataToCheck = userData || await getStoredUserData();
      
      if (!userDataToCheck) {
        console.log("⚠️ No user data available for profile check");
        return;
      }
      
      if (userDataToCheck?.needsProfileCompletion) {
        console.log("📋 User needs profile completion");
        setShowProfileCompletion(true);
        return;
      }
    } catch (error) {
      console.error("Error checking profile completion:", error);
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
      console.error("Failed to load home data:", error);
      
      // Check if error is due to user not existing
      if (error instanceof Error && error.message.includes("User not found")) {
        // User needs to complete profile setup
        setShowProfileCompletion(true);
        return;
      }
      
      Alert.alert(
        t("home.error_title"),
        t("home.load_error"),
        [{ text: t("common.ok") }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = async (userInfo: any) => {
    setShowProfileCompletion(false);
    // Reload home data after profile completion
    await loadHomeData();
  };

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (error) {
      console.error("Failed to refresh home data:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleEmergencyPress = (emergencyId: string) => {
    navigation?.navigate("EmergencyDetails", { emergencyId });
  };

  const handleQRPress = () => {
    setShowQRModal(true);
  };

  const handleNotificationPress = () => {
    navigation?.navigate("Notifications");
  };

  const handleViewAllEmergencies = () => {
    navigation?.navigate("AllEmergencies");
  };

  const handleBookAppointment = () => {
    navigation?.navigate("DonationScreen");
  };

  // Transform data for existing components
  const getStatsData = () => {
    if (!homeData?.userStats) return null;
    
    return {
      totalDonations: homeData.userStats.totalDonations,
      totalPoints: homeData.userStats.totalPoints,
      donationStreak: homeData.userStats.donationStreak,
      eligibleToDonate: homeData.userStats.eligibleToDonate,
      nextEligibleDate: homeData.userStats.nextEligibleDate,
    };
  };

  const getEmergenciesData = () => {
    if (!homeData?.emergencies) return [];
    
    return homeData.emergencies.map((emergency, index) => {
      const parsedId = emergency.id ? parseInt(emergency.id, 10) : null;
      const uniqueId = (parsedId && !isNaN(parsedId)) ? parsedId : index + 1000;
      
      return {
        id: uniqueId,
        hospital: emergency.hospital?.name || "",
        bloodType: Array.isArray(emergency.bloodTypesNeeded) 
          ? emergency.bloodTypesNeeded.join(", ") 
          : "",
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

  const getUpcomingAppointment = () => {
    if (!homeData?.upcomingAppointments?.length) return null;
    
    const appointment = homeData.upcomingAppointments[0];
    if (!appointment) return null;
    
    return {
      id: appointment.id || "",
      date: appointment.appointmentDateTime ? formatDate(appointment.appointmentDateTime) : "",
      time: appointment.appointmentDateTime ? formatTime(appointment.appointmentDateTime) : "",
      location: appointment.location || appointment.medicalEstablishment?.name || "",
      hospital: appointment.medicalEstablishment?.name || "",
      status: appointment.scheduled as any,
    };
  };

  const calculateTimeLeft = (expiresAt: string): string => {
    if (!expiresAt) return t("home.expired");
    
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    // Check if the date is valid
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

  const formatTime = (dateString: string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "" : date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Show Profile Completion Screen if needed */}
      {showProfileCompletion ? (
        <ProfileCompletionScreen
          userId={user?.sub || ""}
          onComplete={handleProfileComplete}
          onSkip={() => setShowProfileCompletion(false)}
        />
      ) : (
        <>
          {/* Header Section with Welcome Message */}
          <View style={styles.headerContainer}>
            <HomeHeader
              firstName={getFirstName() || "User"}
              donorLevel="Bronze Donor" // This could be dynamic based on user stats
              searchText={searchText}
              onSearchTextChange={setSearchText}
              onLogout={logout}
            />
          </View>
          
          {loading ? (
            <HomeScreenSkeleton />
          ) : (
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
              }
              showsVerticalScrollIndicator={false}
            >
              {/* Stats Section */}
              {homeData?.userStats && (
                <StatsCard
                  totalDonations={homeData?.userStats?.totalDonations || 0}
                  statusTitle={homeData?.userStats?.eligibleToDonate ? "Ready to Donate" : "Not Eligible"}
                  statusSubtitle={homeData?.userStats?.eligibleToDonate 
                    ? "You are eligible to donate" 
                    : homeData?.userStats?.nextEligibleDate 
                      ? `Next eligible: ${new Date(homeData.userStats.nextEligibleDate).toLocaleDateString()}`
                      : "Check your donation history"
                  }
                  statusIcon={homeData?.userStats?.eligibleToDonate ? "checkmark-circle" : "time-outline"}
                />
              )}

              {/* Component Row - Quick Actions */}
              <ComponentRow 
                bloodType={user?.bloodType || user?.bloodGroup || 'A+'} 
                lastDonationDays={getLastDonationDays() || 0} 
              />

              {/* Next Donation Date Card */}
              <NextDonationCard 
                lastDonationDate={homeData?.userStats?.lastDonationDate}
                nextEligibleDate={homeData?.userStats?.nextEligibleDate}
                eligibleToDonate={homeData?.userStats?.eligibleToDonate}
              />

              {/* Upcoming Appointment */}
              {homeData?.upcomingAppointments && homeData.upcomingAppointments.length > 0 && (
                <AppointmentSection
                  appointment={getUpcomingAppointment()}
                />
              )}

              {/* Emergencies Section */}
              {homeData?.emergencies && homeData.emergencies.length > 0 && (
                <EmergenciesSection
                  emergencies={getEmergenciesData()}
                  onDonate={(emergency) => handleEmergencyPress(emergency.id.toString())}
                  onViewAll={handleViewAllEmergencies}
                />
              )}

              {/* Thank You Card */}
              <ThankYouCard />

              {/* Bottom Padding */}
              <View style={styles.bottomPadding} />
            </ScrollView>
          )}

          {/* Bottom Tab Bar */}
          <BottomTabBar activeTab="home" />
        </>
      )}

      {/* QR Code Modal */}
      <UserQRModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottomPadding: {
    height: 100, // Space for bottom tab bar
  },
});
