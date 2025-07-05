import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from "../../components/organisms/BottomTabBar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

// Import new atomic components
import HomeHeader from '../../components/organisms/HomeScreen/HomeHeader';
import StatsCard from '../../components/molecules/HomeScreen/StatsCard';
import ComponentRow from '../../components/molecules/HomeScreen/ComponentRow';
import EmergenciesSection from '../../components/organisms/HomeScreen/EmergenciesSection';
import CampaignsSection from '../../components/organisms/HomeScreen/CampaignsSection';
import AppointmentSection from '../../components/organisms/HomeScreen/AppointmentSection';
import { Emergency } from '../../components/molecules/HomeScreen/EmergencyCard';
import { Campaign } from '../../components/molecules/HomeScreen/CampaignCard';
import { Appointment } from '../../components/molecules/HomeScreen/AppointmentCard';

export default function HomeScreen({ navigation }: { navigation?: any }) {
  const [searchText, setSearchText] = useState<string>('');
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const { getFirstName, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    loadUpcomingAppointment();
  }, []);

  const loadUpcomingAppointment = async () => {
    try {
      // This would be replaced with actual API call
      const mockAppointment: Appointment = {
        id: "1",
        date: "July 15, 2025",
        time: "10:00 AM",
        location: "Colombo Blood Bank",
        hospital: "Colombo General Hospital",
        status: "upcoming"
      };
      setUpcomingAppointment(mockAppointment);
    } catch (error) {
      console.error("Failed to load appointment:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNotificationPress = () => {
    if (navigation) {
      navigation.navigate('Notifications');
    } else {
      console.log('Navigate to Notifications screen');
    }
  };

  const handleDonateNow = (emergency: Emergency) => {
    console.log(`Donate to ${emergency.hospital} for ${emergency.bloodType}`);
  };

  const handleViewEmergencyDetails = (emergency: Emergency) => {
    console.log(`View details for ${emergency.hospital}`);
  };

  const handleViewAllEmergencies = () => {
    console.log('View all emergencies');
  };

  const handleViewAllCampaigns = () => {
    console.log('View all campaigns');
  };

  const handleAppointmentDetails = (appointment: Appointment) => {
    console.log(`View appointment details for ${appointment.id}`);
  };

  const handleReschedule = (appointment: Appointment) => {
    console.log(`Reschedule appointment ${appointment.id}`);
  };

  const emergencies: Emergency[] = [
    {
      id: 1,
      hospital: 'City General Hospital',
      bloodType: 'O+ Needed',
      slotsUsed: 3,
      totalSlots: 10,
      urgency: 'Critical',
      timeLeft: '2 hours left'
    },
    {
      id: 2,
      hospital: 'Negombo General Hospital',
      bloodType: 'A+ Needed',
      slotsUsed: 5,
      totalSlots: 8,
      urgency: 'Critical',
      timeLeft: '4 hours left'
    }
  ];

  const upcomingCampaigns: Campaign[] = [
    {
      id: 1,
      title: 'Emergency Relief Fund',
      date: '2025-07-05',
      location: 'City General Hospital',
      slotsUsed: 65,
      totalSlots: 100,
      urgency: 'Critical'
    },
    {
      id: 2,
      title: 'University Blood Drive',
      date: '2025-07-12',
      location: 'University of Colombo',
      slotsUsed: 23,
      totalSlots: 50,
      urgency: 'Moderate'
    },
    {
      id: 3,
      title: 'Community Health Fair',
      date: '2025-07-18',
      location: 'Negombo Community Center',
      slotsUsed: 12,
      totalSlots: 75,
      urgency: 'Low'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <HomeHeader
          firstName={getFirstName()}
          donorLevel="Silver Donor"
          searchText={searchText}
          onSearchTextChange={setSearchText}
          onLogout={handleLogout}
        />

        <StatsCard totalDonations={12} />

        <View style={styles.section}>
          <ComponentRow 
            bloodType="O+"
            lastDonationDays={473}
          />
        </View>

        <AppointmentSection
          appointment={upcomingAppointment}
          title="Blood Donation"
          onViewDetails={handleAppointmentDetails}
          onReschedule={handleReschedule}
        />

        <EmergenciesSection
          emergencies={emergencies}
          onDonate={handleDonateNow}
          onViewDetails={handleViewEmergencyDetails}
          onViewAll={handleViewAllEmergencies}
        />

        <CampaignsSection
          campaigns={upcomingCampaigns}
          onViewAll={handleViewAllCampaigns}
          limit={2}
        />

        <View style={styles.bottomPadding} />
      </ScrollView>

      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handleNotificationPress}
      >
        <Ionicons name="notifications" size={24} color="white" />
        <View style={styles.notificationBadge} />
      </TouchableOpacity>

      <BottomTabBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginBottom: 24,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 120,
    right: 24,
    width: 60,
    height: 60,
    backgroundColor: '#5F27CD',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5F27CD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    backgroundColor: '#FF4757',
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  bottomPadding: {
    height: 24,
  },
});