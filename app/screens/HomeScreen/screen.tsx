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
import BottomTabBar from "../../../components/organisms/BottomTabBar";
import StatsCard from "../../../components/molecules/HomeScreen/StatsCard";
import ComponentRow from "../../../components/molecules/HomeScreen/ComponentRow";
import EmergenciesSection from "../../../components/organisms/HomeScreen/EmergenciesSection";
import AppointmentSection from "../../../components/organisms/HomeScreen/AppointmentSection";
import HomeHeader from "../../../components/organisms/HomeScreen/HomeHeader";

// Import new components
import UserQRModal from "../../../components/organisms/UserQRModal";
import HomeScreenSkeleton from "../../../components/molecules/skeletons/HomeScreenSkeleton";

// Import services
import { homeService, HomeScreenData } from "../../services/homeService";
import { userService } from "../../services/userService";

// Import context
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

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

  // Context
  const { user, getFirstName, logout } = useAuth();
  const { t } = useLanguage();

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
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const data = await homeService.getHomeData();
      setHomeData(data);
    } catch (error) {
      console.error("Failed to load home data:", error);
      Alert.alert(
        t("home.error_title"),
        t("home.load_error"),
        [{ text: t("common.ok") }]
      );
    } finally {
      setLoading(false);
    }
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
    
    return homeData.emergencies.map(emergency => ({
      id: parseInt(emergency.id, 10) || 0,
      hospital: emergency.hospital.name,
      bloodType: emergency.bloodTypesNeeded.join(", "),
      slotsUsed: 0, // Calculate based on responses
      totalSlots: Object.values(emergency.quantityNeeded).reduce((a, b) => a + b, 0),
      urgency: emergency.urgencyLevel as any,
      timeLeft: calculateTimeLeft(emergency.expiresAt),
      description: emergency.description,
      contactNumber: emergency.contactNumber,
      address: emergency.hospital.address,
      requirements: emergency.specialInstructions,
    }));
  };

  const getUpcomingAppointment = () => {
    if (!homeData?.upcomingAppointments?.length) return null;
    
    const appointment = homeData.upcomingAppointments[0];
    return {
      id: appointment.id,
      date: formatDate(appointment.appointmentDateTime),
      time: formatTime(appointment.appointmentDateTime),
      location: appointment.location || appointment.medicalEstablishment?.name || "",
      hospital: appointment.medicalEstablishment?.name || "",
      status: appointment.scheduled as any,
    };
  };

  const calculateTimeLeft = (expiresAt: string): string => {
    const now = new Date();
    const expiry = new Date(expiresAt);
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
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
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
            />
          )}

          {/* Component Row - Quick Actions */}
          <ComponentRow 
            bloodType={user?.bloodType || user?.bloodGroup || 'A+'} 
            lastDonationDays={getLastDonationDays() || 0} 
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

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      )}

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="home" />

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
