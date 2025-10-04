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
import CampaignsSection from "../../../components/organisms/HomeScreen/CampaignsSection";
import AppointmentSection from "../../../components/organisms/HomeScreen/AppointmentSection";

// Import new components
import UserQRModal from "../../../components/organisms/UserQRModal";

// Import services
import { homeService, HomeScreenData } from "../../services/homeService";
import { userService } from "../../services/userService";

// Import context
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

interface EnhancedHomeScreenProps {
  navigation?: any;
}

export default function EnhancedHomeScreen({ navigation }: EnhancedHomeScreenProps) {
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

  const handleCampaignPress = (campaignId: string) => {
    navigation?.navigate("CampaignDetails", { campaignId });
  };

  const handleAppointmentPress = (appointmentId: string) => {
    navigation?.navigate("AppointmentDetails", { appointmentId });
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

  const handleViewAllCampaigns = () => {
    navigation?.navigate("AllCampaigns");
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

  const getCampaignsData = () => {
    if (!homeData?.featuredCampaigns) return [];
    
    return homeData.featuredCampaigns.map(campaign => ({
      id: parseInt(campaign.id, 10) || 0,
      title: campaign.title,
      date: formatDate(campaign.startTime),
      location: campaign.location,
      slotsUsed: campaign.actualDonors,
      totalSlots: campaign.expectedDonors,
      urgency: "Moderate" as any, // Map based on availability
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
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      
      <ScrollView
        style={styles.scrollView}
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
          bloodType={user?.bloodType || 'A+'} 
          lastDonationDays={getLastDonationDays() || 0} 
        />

        {/* Upcoming Appointment */}
        {homeData?.upcomingAppointments && homeData.upcomingAppointments.length > 0 && (
          <AppointmentSection
            appointment={getUpcomingAppointment()}
            onViewDetails={(appointment) => handleAppointmentPress(appointment.id)}
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

        {/* Campaigns Section */}
        {homeData?.featuredCampaigns && homeData.featuredCampaigns.length > 0 && (
          <CampaignsSection
            campaigns={getCampaignsData()}
            onCampaignPress={(campaign) => handleCampaignPress(campaign.id.toString())}
            onViewAll={handleViewAllCampaigns}
          />
        )}

        {/* Bottom Padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar activeTab="Home" />

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
  scrollView: {
    flex: 1,
  },
  bottomPadding: {
    height: 100, // Space for bottom tab bar
  },
});
