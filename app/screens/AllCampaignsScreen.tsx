import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Campaign } from '../../components/molecules/HomeScreen/CampaignCard';
import CampaignCard from '../../components/molecules/HomeScreen/CampaignCard';

interface AllCampaignsScreenProps {
  navigation?: any;
}

export default function AllCampaignsScreen({ navigation }: AllCampaignsScreenProps) {
  const [showCampaignModal, setShowCampaignModal] = useState<boolean>(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
  };

  const handleCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowCampaignModal(true);
  };

  const handleJoinCampaign = (campaign: Campaign) => {
    Alert.alert(
      'Join Campaign',
      `Would you like to join "${campaign.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Join', 
          onPress: () => {
            Alert.alert('Success!', 'You have successfully joined the campaign. We will send you details soon.');
          }
        }
      ]
    );
  };

  const closeCampaignModal = () => {
    setShowCampaignModal(false);
    setSelectedCampaign(null);
  };

  // Extended list of campaigns with proximity-based categorization
  const allCampaigns: Campaign[] = [
    // This Week - Nearby (Close)
    {
      id: 1,
      title: 'Emergency Relief Fund',
      date: '2025-07-07', // Tomorrow
      location: 'City General Hospital',
      slotsUsed: 65,
      totalSlots: 100,
      urgency: 'Critical'
    },
    {
      id: 2,
      title: 'University Blood Drive',
      date: '2025-07-08', // 2 days away
      location: 'University of Colombo',
      slotsUsed: 23,
      totalSlots: 50,
      urgency: 'Moderate'
    },
    {
      id: 3,
      title: 'Community Health Fair',
      date: '2025-07-10', // 4 days away
      location: 'Colombo Fort Medical Center',
      slotsUsed: 12,
      totalSlots: 75,
      urgency: 'Low'
    },
    // Next Week - Medium Distance
    {
      id: 4,
      title: 'Corporate Wellness Initiative',
      date: '2025-07-14', // Next week
      location: 'Negombo Business District',
      slotsUsed: 8,
      totalSlots: 30,
      urgency: 'Low'
    },
    {
      id: 5,
      title: 'School Awareness Program',
      date: '2025-07-16', // Next week
      location: 'Gampaha District Hospital',
      slotsUsed: 5,
      totalSlots: 40,
      urgency: 'Low'
    },
    {
      id: 6,
      title: 'National Blood Day Drive',
      date: '2025-07-18', // Next week
      location: 'Kalutara Medical Center',
      slotsUsed: 45,
      totalSlots: 200,
      urgency: 'Moderate'
    },
    // Later This Month - Distant
    {
      id: 7,
      title: 'Monsoon Emergency Reserve',
      date: '2025-07-25', // 3 weeks away
      location: 'Kandy Medical Center',
      slotsUsed: 78,
      totalSlots: 120,
      urgency: 'Critical'
    },
    {
      id: 8,
      title: 'Rural Health Outreach',
      date: '2025-07-28', // 3+ weeks away
      location: 'Anuradhapura District Hospital',
      slotsUsed: 15,
      totalSlots: 60,
      urgency: 'Moderate'
    },
    {
      id: 9,
      title: 'Youth Volunteer Drive',
      date: '2025-08-02', // Next month
      location: 'Jaffna Teaching Hospital',
      slotsUsed: 22,
      totalSlots: 80,
      urgency: 'Low'
    },
    {
      id: 10,
      title: 'Religious Festival Support',
      date: '2025-08-05', // Next month
      location: 'Batticaloa District Hospital',
      slotsUsed: 35,
      totalSlots: 100,
      urgency: 'Moderate'
    },
  ];

  // Helper function to calculate days from today
  const getDaysFromToday = (dateString: string) => {
    const today = new Date('2025-07-06'); // Current date from context
    const campaignDate = new Date(dateString);
    const diffTime = campaignDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Group campaigns by proximity (time and distance)
  const closeCampaigns = allCampaigns.filter(c => {
    const days = getDaysFromToday(c.date);
    return days <= 4; // This week, nearby locations
  });

  const mediumCampaigns = allCampaigns.filter(c => {
    const days = getDaysFromToday(c.date);
    return days > 4 && days <= 14; // Next week, medium distance
  });

  const distantCampaigns = allCampaigns.filter(c => {
    const days = getDaysFromToday(c.date);
    return days > 14; // Later, distant locations
  });

  const renderCampaignSection = (title: string, campaigns: Campaign[], iconColor: string, iconName: string) => {
    if (campaigns.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name={iconName as any} size={24} color={iconColor} />
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionCount}>({campaigns.length})</Text>
        </View>
        <View style={styles.campaignsContainer}>
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onPress={() => handleCampaignDetails(campaign)}
              showActions={true}
              onDetails={handleCampaignDetails}
              onJoin={handleJoinCampaign}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Campaigns</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {allCampaigns.length} active campaigns available for participation
          </Text>

          {/* Summary Stats - Updated for proximity */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#DC2626" />
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{closeCampaigns.length}</Text>
                <Text style={styles.statLabel}>This Week</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#F59E0B" />
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{mediumCampaigns.length}</Text>
                <Text style={styles.statLabel}>Next Week</Text>
              </View>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="location" size={24} color="#10B981" />
              <View style={styles.statContent}>
                <Text style={styles.statNumber}>{distantCampaigns.length}</Text>
                <Text style={styles.statLabel}>Later</Text>
              </View>
            </View>
          </View>

          {/* Campaign Sections - Updated for proximity */}
          {renderCampaignSection('This Week - Nearby', closeCampaigns, '#DC2626', 'time')}
          {renderCampaignSection('Next Week - Medium Distance', mediumCampaigns, '#F59E0B', 'calendar')}
          {renderCampaignSection('Later - Distant', distantCampaigns, '#10B981', 'location')}
        </View>
      </ScrollView>

      {/* Campaign Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCampaignModal}
        onRequestClose={closeCampaignModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Campaign Details</Text>
              <TouchableOpacity onPress={closeCampaignModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedCampaign && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                <View style={styles.campaignInfo}>
                  <Text style={styles.campaignInfoTitle}>{selectedCampaign.title}</Text>
                  <Text style={styles.campaignInfoDetails}>
                    {selectedCampaign.location} • {selectedCampaign.date}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={20} color="#3B82F6" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Event Date</Text>
                    <Text style={styles.detailValue}>{selectedCampaign.date}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#10B981" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{selectedCampaign.location}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="people" size={20} color="#8B5CF6" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Participants</Text>
                    <Text style={styles.detailValue}>
                      {selectedCampaign.slotsUsed} / {selectedCampaign.totalSlots} joined
                    </Text>
                  </View>
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>About This Campaign</Text>
                  <Text style={styles.descriptionText}>
                    Join us for this important blood donation campaign. Your participation helps save lives and supports our community's health initiatives. This is an excellent opportunity to make a meaningful difference.
                  </Text>
                </View>

                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>Participation Requirements</Text>
                  <Text style={styles.requirementsText}>
                    • Age 18-65 years{'\n'}
                    • Weight above 50kg{'\n'}
                    • Good health condition{'\n'}
                    • Valid identification required{'\n'}
                    • Registration recommended
                  </Text>
                </View>
                
                <View style={styles.modalBottomPadding} />
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalDetailsButton}
                onPress={closeCampaignModal}
              >
                <Text style={styles.modalDetailsButtonText}>Close</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalJoinButton}
                onPress={() => {
                  closeCampaignModal();
                  if (selectedCampaign) {
                    handleJoinCampaign(selectedCampaign);
                  }
                }}
              >
                <Text style={styles.modalJoinButtonText}>Join Campaign</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    paddingTop: 60, // Adjusted for status bar height
  },
  backButton: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    letterSpacing: 0.5,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    backgroundColor: '#FAFBFC',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    paddingHorizontal: 4,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  statIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
    marginRight: 12,
  },
  statContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 36,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  urgencyIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
    marginLeft: 8,
  },
  sectionCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  campaignsContainer: {
    gap: 16,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  campaignInfo: {
    backgroundColor: '#FEF3F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  campaignInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  campaignInfoDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  detailText: {
    marginLeft: 12,
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  requirementsContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#FEF3F2',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  requirementsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalBottomPadding: {
    height: 60,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
  modalDetailsButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalDetailsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  modalJoinButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
  },
  modalJoinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
});
