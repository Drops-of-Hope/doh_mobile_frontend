import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from "../../components/organisms/BottomTabBar";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

const { width } = Dimensions.get('window');

// Define types
type UrgencyLevel = 'Critical' | 'Moderate' | 'Low';

interface Campaign {
  id: number;
  title: string;
  date: string;
  location: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
}

interface Emergency {
  id: number;
  hospital: string;
  bloodType: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
  timeLeft: string;
}

export default function HomeScreen({ navigation }: { navigation?: any }) {
  const [searchText, setSearchText] = useState<string>('');
  const { getFirstName, logout } = useAuth();
  const { t } = useLanguage();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

  const getProgressColor = (urgency: UrgencyLevel): string => {
    switch(urgency) {
      case 'Critical': return '#FF4757';
      case 'Moderate': return '#3B82F6';
      case 'Low': return '#00D2D3';
      default: return '#3B82F6';
    }
  };

  const getUrgencyColors = (urgency: UrgencyLevel) => {
    switch(urgency) {
      case 'Critical': return { text: '#FF4757', bg: '#FFF5F5' };
      case 'Moderate': return { text: '#3B82F6', bg: '#F0F6FF' };
      case 'Low': return { text: '#00D2D3', bg: '#F0FDFA' };
      default: return { text: '#3B82F6', bg: '#F0F6FF' };
    }
  };

  const handleDonateNow = (emergency: Emergency) => {
    console.log(`Donate to ${emergency.hospital} for ${emergency.bloodType}`);
  };

  const handleNotificationPress = () => {
    if (navigation) {
      navigation.navigate('Notifications');
    } else {
      console.log('Navigate to Notifications screen');
    }
  };

  const EmergencyCard = ({ emergency }: { emergency: Emergency }) => {
    const urgencyColors = getUrgencyColors(emergency.urgency);
    const progressWidth = (emergency.slotsUsed / emergency.totalSlots) * 100;

    return (
      <View style={styles.emergencyCard}>
        <View style={styles.emergencyHeader}>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColors.bg }]}>
            <Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
              {emergency.urgency}
            </Text>
          </View>
          <Text style={styles.timeLeft}>{emergency.timeLeft}</Text>
        </View>
        
        <Text style={styles.emergencyHospital}>{emergency.hospital}</Text>
        
        <View style={styles.bloodTypeContainer}>
          <Text style={styles.bloodTypeText}>{emergency.bloodType}</Text>
          <Text style={styles.slotsText}>
            {emergency.slotsUsed}/{emergency.totalSlots} slots filled
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressWidth}%`,
                  backgroundColor: getProgressColor(emergency.urgency)
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.emergencyActions}>
          <TouchableOpacity 
            style={styles.donateButton}
            onPress={() => handleDonateNow(emergency)}
          >
            <Ionicons name="heart" size={16} color="white" style={styles.donateButtonIcon} />
            <Text style={styles.donateButtonText}>Donate Now</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.detailsButtonSecondary}>
            <Text style={styles.detailsButtonSecondaryText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CampaignCard = ({ campaign }: { campaign: Campaign }) => {
    const urgencyColors = getUrgencyColors(campaign.urgency);
    const progressWidth = (campaign.slotsUsed / campaign.totalSlots) * 100;

    return (
      <View style={styles.campaignCard}>
        <View style={styles.campaignHeader}>
          <View style={[styles.urgencyBadge, { backgroundColor: urgencyColors.bg }]}>
            <Text style={[styles.urgencyText, { color: urgencyColors.text }]}>
              {campaign.urgency}
            </Text>
          </View>
          <Text style={styles.campaignDate}>{campaign.date}</Text>
        </View>
        
        <Text style={styles.campaignTitle}>{campaign.title}</Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={16} color="#8E8E93" />
          <Text style={styles.locationText}>{campaign.location}</Text>
        </View>
        
        <View style={styles.slotsContainer}>
          <Text style={styles.slotsText}>
            {campaign.slotsUsed}/{campaign.totalSlots} slots filled
          </Text>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progressWidth}%`,
                  backgroundColor: getProgressColor(campaign.urgency)
                }
              ]} 
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hello, {getFirstName()}</Text>
              <Text style={styles.subGreeting}>Your summary for the day</Text>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.donorBadge}>
                <View style={styles.donorDot} />
                <Text style={styles.donorText}>Silver Donor</Text>
              </View>
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="log-out-outline" size={24} color="#DC2626" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns, hospitals..."
              placeholderTextColor="#9CA3AF"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsCenter}>
            <Text style={styles.statsNumber}>12</Text>
            <View style={styles.statsLabelContainer}>
              <Text style={styles.statsLabel}>Total</Text>
              <Text style={styles.statsLabel}>Donations</Text>
            </View>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.statusIcon}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Ready to Donate</Text>
              <Text style={styles.statusSubtitle}>You are eligible to donate</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.componentRow}>
            <View style={styles.componentCard}>
              <View style={styles.componentIcon}>
                <Ionicons name="water" size={18} color="white" />
              </View>
              <View style={styles.componentContent}>
                <Text style={styles.componentTitle}>Blood Type</Text>
                <Text style={styles.componentSubtitle}>O+ Universal donor</Text>
              </View>
              <Text style={styles.componentValue}>O+</Text>
            </View>
            <View style={styles.componentCard}>
              <View style={[styles.componentIcon, { backgroundColor: '#5F27CD' }]}>
                <Ionicons name="calendar" size={18} color="white" />
              </View>
              <View style={styles.componentContent}>
                <Text style={styles.componentTitle}>Last Donation</Text>
                <Text style={styles.componentSubtitle}>Time since last visit</Text>
              </View>
              <Text style={styles.componentValue}>473 days</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentIcon}>
              <Ionicons name="heart" size={20} color="white" />
            </View>
            <View style={styles.appointmentContent}>
              <Text style={styles.appointmentTitle}>Blood Donation</Text>
              <Text style={styles.appointmentDateTime}>July 15, 2025 at 10:00 AM</Text>
              <Text style={styles.appointmentLocation}>Colombo General Hospital</Text>
              <Text style={styles.confirmedText}>Confirmed</Text>
            </View>
          </View>
          
          <View style={styles.appointmentButtons}>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emergenciesContainer}>
            {emergencies.map((emergency) => (
              <EmergencyCard key={emergency.id} emergency={emergency} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Campaigns</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.campaignsContainer}>
            {upcomingCampaigns.slice(0, 2).map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </View>
        </View>
        
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
  header: {
    paddingTop: 60,
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  greetingContainer: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  donorBadge: {
    marginTop: 15,
    backgroundColor: '#fefefe',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 85, 99, 0.2)',
  },
  donorDot: {
    width: 8,
    height: 8,
    backgroundColor: '#A0A0A0',
    borderRadius: 4,
    marginRight: 8,
  },
  donorText: {
    color: '#1F2937',
    fontSize: 14,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    marginTop: 15,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 20,
    top: 18,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingLeft: 52,
    paddingRight: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    fontWeight: '500',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  statsCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 24,
    width: '100%',
  },
  statsNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#3B82F6',
    marginRight: 20,
    lineHeight: 70,
  },
  statsLabelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  statsLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    lineHeight: 24,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  statusIcon: {
    backgroundColor: '#00D2D3',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  appointmentIcon: {
    backgroundColor: '#FF4757',
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appointmentContent: {
    flex: 1,
  },
  appointmentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  appointmentDateTime: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  confirmedText: {
    color: '#00D2D3',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  appointmentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#FF4757',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    color: '#5F27CD',
    fontWeight: '700',
    fontSize: 14,
  },
  emergenciesContainer: {
    gap: 12,
  },
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLeft: {
    fontSize: 12,
    color: '#FF4757',
    fontWeight: '700',
  },
  emergencyHospital: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  componentRow: {
    gap: 12,
  },
  componentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  componentIcon: {
    backgroundColor: '#FF4757',
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  componentContent: {
    flex: 1,
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  componentSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  componentValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  campaignsContainer: {
    gap: 12,
  },
  campaignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  campaignDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  bloodTypeContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  slotsContainer: {
    marginBottom: 12,
  },
  slotsText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  emergencyActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  donateButton: {
    flex: 2,
    backgroundColor: '#FF4757',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  donateButtonIcon: {
    marginRight: 8,
  },
  donateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
  detailsButtonSecondary: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonSecondaryText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
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