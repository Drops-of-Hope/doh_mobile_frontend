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
      case 'Critical': return '#f87171';
      case 'Moderate': return '#fb923c';
      case 'Low': return '#4ade80';
      default: return '#60a5fa';
    }
  };

  const getUrgencyColors = (urgency: UrgencyLevel) => {
    switch(urgency) {
      case 'Critical': return { text: '#dc2626', bg: '#fef2f2' };
      case 'Moderate': return { text: '#ea580c', bg: '#fff7ed' };
      case 'Low': return { text: '#16a34a', bg: '#f0fdf4' };
      default: return { text: '#2563eb', bg: '#eff6ff' };
    }
  };

  const handleDonateNow = (emergency: Emergency) => {
    // Handle donate now action
    console.log(`Donate to ${emergency.hospital} for ${emergency.bloodType}`);
    // You can navigate to donation booking screen or show confirmation modal
  };

  const handleNotificationPress = () => {
    // Navigate to notifications screen
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

        {/* Action Buttons */}
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
          <Ionicons name="location-outline" size={16} color="#6b7280" />
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
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hello, Nadhiya</Text>
              <Text style={styles.subGreeting}>Your summary for the day</Text>
            </View>
            <View style={styles.donorBadge}>
              <View style={styles.donorDot} />
              <Text style={styles.donorText}>Silver Donor</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search campaigns, hospitals..."
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* Main Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsCenter}>
            <Text style={styles.statsNumber}>12</Text>
            <View style={styles.statsLabelContainer}>
              <Text style={styles.statsLabel}>Total</Text>
              <Text style={styles.statsLabel}>Donations</Text>
            </View>
          </View>

          {/* Status - Left Aligned */}
          <View style={styles.statusRow}>
            <View style={styles.statusIcon}>
              <Ionicons name="checkmark-circle" size={24} color="white" />
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Ready to Donate</Text>
              <Text style={styles.statusSubtitle}>You are eligible to donate</Text>
            </View>
          </View>
        </View>

        {/* Main Components Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Main Components:</Text>
          
          <View style={styles.componentRow}>
            <View style={styles.componentCard}>
              <View style={styles.componentIcon}>
                <Ionicons name="water" size={20} color="white" />
              </View>
              <View style={styles.componentContent}>
                <Text style={styles.componentTitle}>Blood Type</Text>
                <Text style={styles.componentSubtitle}>O+ Universal donor</Text>
              </View>
              <Text style={styles.componentValue}>O+</Text>
            </View>
            <View style={styles.componentCard}>
              <View style={[styles.componentIcon, { backgroundColor: '#3b82f6' }]}>
                <Ionicons name="calendar" size={20} color="white" />
              </View>
              <View style={styles.componentContent}>
                <Text style={styles.componentTitle}>Last Donation</Text>
                <Text style={styles.componentSubtitle}>Time since last visit</Text>
              </View>
              <Text style={styles.componentValue}>473 days</Text>
            </View>
          </View>
        </View>
        
        {/* Next Appointment */}
        <View style={styles.appointmentCard}>
          <View style={styles.appointmentHeader}>
            <View style={styles.appointmentIcon}>
              <Ionicons name="heart" size={24} color="white" />
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

        {/* Emergency Section */}
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

        {/* Upcoming Campaigns */}
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

      {/* Floating Notification Button */}
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
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 60,
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  donorBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(75, 85, 99, 0.1)',
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
    backgroundColor: '#4b5563',
    borderRadius: 4,
    marginRight: 8,
  },
  donorText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  statsCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  statsCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 24,
    width: '100%',
  },
  statsNumber: {
    fontSize: 100,
    fontWeight: '300',
    color: '#111827',
    marginRight: 20,
    lineHeight: 100,
  },
  statsLabelContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  statsLabel: {
    fontSize: 24,
    fontWeight: '500',
    color: '#f97316',
    lineHeight: 28,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    backgroundColor: '#10b981',
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  appointmentCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  appointmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  appointmentIcon: {
    backgroundColor: '#ef4444',
    width: 56,
    height: 56,
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
    fontWeight: '600',
    color: '#111827',
  },
  appointmentDateTime: {
    fontSize: 14,
    color: '#6b7280',
    marginVertical: 4,
  },
  confirmedText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  appointmentLocation: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  appointmentButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  rescheduleButton: {
    flex: 1,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  rescheduleButtonText: {
    color: '#374151',
    fontWeight: '500',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllButton: {
    color: '#ef4444',
    fontWeight: '500',
  },
  emergenciesContainer: {
    gap: 12,
  },
  emergencyCard: {
    backgroundColor: 'rgba(243, 244, 246, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 0.5)',
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLeft: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
  emergencyHospital: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  componentRow: {
    gap: 12,
  },
  componentCard: {
    backgroundColor: 'rgba(243, 244, 246, 0.6)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 0.5)',
  },
  componentIcon: {
    backgroundColor: '#ef4444',
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
    fontWeight: '500',
    color: '#111827',
  },
  componentSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  componentValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  campaignsContainer: {
    gap: 12,
  },
  campaignCard: {
    backgroundColor: 'rgba(243, 244, 246, 0.6)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(209, 213, 219, 0.5)',
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  urgencyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  urgencyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  campaignDate: {
    fontSize: 14,
    color: '#9ca3af',
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  bloodTypeContainer: {
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  slotsContainer: {
    marginBottom: 16,
  },
  slotsText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  progressContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  // New styles for emergency action buttons
  emergencyActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  donateButton: {
    flex: 2,
    backgroundColor: '#dc2626',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  donateButtonIcon: {
    marginRight: 8,
  },
  donateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsButtonSecondary: {
    flex: 1,
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  detailsButtonSecondaryText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 112,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#ef4444',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: '#f97316',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  tabBar: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 320,
    alignSelf: 'center',
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 20,
  },
});