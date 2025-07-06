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
<<<<<<< Updated upstream
  Dimensions
=======
  Modal,
  Text,
  Pressable,
  TextInput,
  Alert,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
  const [upcomingAppointment, setUpcomingAppointment] = useState<Appointment | null>(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [donationForm, setDonationForm] = useState({
    contactNumber: '',
    specialRequests: '',
  });
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
    setSelectedEmergency(emergency);
    setShowDonationModal(true);
  };

  const handleViewEmergencyDetails = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
    setShowEmergencyModal(true);
  };

  const handleViewAllEmergencies = () => {
    navigation?.navigate('AllEmergencies');
  };

  const handleViewAllCampaigns = () => {
    navigation?.navigate('AllCampaigns');
  };

  const handleAppointmentDetails = (appointment: Appointment) => {
    setShowAppointmentModal(true);
  };

  const handleReschedule = (appointment: Appointment) => {
    console.log(`Reschedule appointment ${appointment.id}`);
  };
>>>>>>> Stashed changes

  const closeModal = () => {
    setShowAppointmentModal(false);
  };

  const closeEmergencyModal = () => {
    setShowEmergencyModal(false);
    setSelectedEmergency(null);
  };

  const closeDonationModal = () => {
    setShowDonationModal(false);
    setSelectedEmergency(null);
    setDonationForm({
      contactNumber: '',
      specialRequests: '',
    });
  };

  const handleDonationSubmit = () => {
    if (!donationForm.contactNumber) {
      Alert.alert('Error', 'Please provide your contact number');
      return;
    }

    // Here you would typically make an API call to book the donation
    Alert.alert(
      'Emergency Donation Registered!',
      `Thank you for responding to this emergency! We'll contact you immediately at ${donationForm.contactNumber} with instructions for immediate donation.`,
      [
        {
          text: 'OK',
          onPress: () => {
            closeDonationModal();
            // Optionally refresh the appointments
            loadUpcomingAppointment();
          }
        }
      ]
    );
  };

  const emergencies: Emergency[] = [
    {
      id: 1,
      hospital: 'City General Hospital',
      bloodType: 'O+ Needed',
      slotsUsed: 3,
      totalSlots: 10,
      urgency: 'Critical',
      timeLeft: '2 hours left',
      description: 'Critical shortage of O+ blood needed for emergency surgeries. Multiple patients in the ICU require immediate blood transfusions.',
      contactNumber: '+94 11 123 4567',
      address: '123 Main Street, Colombo 07',
      requirements: 'Minimum 450ml donation, Age 18-65, Weight above 50kg'
    },
    {
      id: 2,
      hospital: 'Negombo General Hospital',
      bloodType: 'AB+ Needed',
      slotsUsed: 5,
      totalSlots: 8,
      urgency: 'Critical',
      timeLeft: '4 hours left',
      description: 'Urgent need for AB+ blood type for accident victims. Road traffic accident has resulted in multiple casualties requiring immediate medical attention.',
      contactNumber: '+94 31 234 5678',
      address: '456 Hospital Road, Negombo',
      requirements: 'Minimum 450ml donation, Age 18-65, Weight above 50kg'
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
              <Text style={styles.greeting}>Hello, Nadhiya</Text>
              <Text style={styles.subGreeting}>Your summary for the day</Text>
            </View>
            <View style={styles.donorBadge}>
              <View style={styles.donorDot} />
              <Text style={styles.donorText}>Silver Donor</Text>
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

      {/* Appointment Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAppointmentModal}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Appointment Details</Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            {upcomingAppointment && (
              <View style={styles.modalBody}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar" size={20} color="#3B82F6" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailValue}>
                      {upcomingAppointment.date} at {upcomingAppointment.time}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#10B981" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Location</Text>
                    <Text style={styles.detailValue}>{upcomingAppointment.location}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="medical" size={20} color="#F59E0B" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Hospital</Text>
                    <Text style={styles.detailValue}>{upcomingAppointment.hospital}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="checkmark-circle" size={20} color="#8B5CF6" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <Text style={[styles.detailValue, styles.statusText]}>
                      {upcomingAppointment.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Instructions */}
                <View style={styles.instructionsContainer}>
                  <Text style={styles.instructionsTitle}>Preparation Instructions</Text>
                  <Text style={styles.instructionsText}>
                    • Eat a healthy meal before donating{'\n'}
                    • Drink plenty of water{'\n'}
                    • Bring a valid ID{'\n'}
                    • Avoid alcohol 24 hours before donation{'\n'}
                    • Get a good night's sleep
                  </Text>
                </View>
              </View>
            )}

            {/* Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rescheduleButton]}
                onPress={() => {
                  closeModal();
                  if (upcomingAppointment) {
                    handleReschedule(upcomingAppointment);
                  }
                }}
              >
                <Text style={styles.rescheduleButtonText}>Reschedule</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.confirmButton]}
                onPress={closeModal}
              >
                <Text style={styles.confirmButtonText}>Got it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Emergency Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEmergencyModal}
        onRequestClose={closeEmergencyModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Emergency Details</Text>
              <TouchableOpacity onPress={closeEmergencyModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedEmergency && (
              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Emergency Information */}
                <View style={styles.emergencyInfo}>
                  <Text style={styles.emergencyInfoTitle}>Emergency Information</Text>
                  <Text style={styles.emergencyInfoUrgency}>
                    {selectedEmergency.urgency} - {selectedEmergency.timeLeft}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="medical" size={20} color="#F59E0B" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Hospital</Text>
                    <Text style={styles.detailValue}>{selectedEmergency.hospital}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="water" size={20} color="#DC2626" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Blood Type Needed</Text>
                    <Text style={styles.detailValue}>{selectedEmergency.bloodType}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="people" size={20} color="#8B5CF6" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Donors</Text>
                    <Text style={styles.detailValue}>
                      {selectedEmergency.slotsUsed} / {selectedEmergency.totalSlots} slots filled
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="location" size={20} color="#10B981" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Address</Text>
                    <Text style={styles.detailValue}>{selectedEmergency.address}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="call" size={20} color="#3B82F6" />
                  <View style={styles.detailText}>
                    <Text style={styles.detailLabel}>Contact</Text>
                    <Text style={styles.detailValue}>{selectedEmergency.contactNumber}</Text>
                  </View>
                </View>

                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>Emergency Description</Text>
                  <Text style={styles.descriptionText}>{selectedEmergency.description}</Text>
                </View>

                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>Donation Requirements</Text>
                  <Text style={styles.requirementsText}>{selectedEmergency.requirements}</Text>
                </View>
                
                {/* Bottom padding for scrolling */}
                <View style={styles.modalBottomPadding} />
              </ScrollView>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rescheduleButton]}
                onPress={() => {
                  closeEmergencyModal();
                  if (selectedEmergency) {
                    handleDonateNow(selectedEmergency);
                  }
                }}
              >
                <Text style={styles.rescheduleButtonText}>Donate Now</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.confirmButton]}
                onPress={closeEmergencyModal}
              >
                <Text style={styles.confirmButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Donation Booking Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDonationModal}
        onRequestClose={closeDonationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Book Donation</Text>
              <TouchableOpacity onPress={closeDonationModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedEmergency && (
                <>
                  <View style={styles.emergencyInfo}>
                    <Text style={styles.emergencyInfoTitle}>Emergency Information</Text>
                    <Text style={styles.emergencyInfoText}>
                      {selectedEmergency.hospital} - {selectedEmergency.bloodType}
                    </Text>
                    <Text style={styles.emergencyInfoUrgency}>
                      {selectedEmergency.urgency} - {selectedEmergency.timeLeft}
                    </Text>
                  </View>

                  <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Emergency Response Details</Text>
                    
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Contact Number *</Text>
                      <TextInput
                        style={styles.textInput}
                        value={donationForm.contactNumber}
                        onChangeText={(text) => setDonationForm({...donationForm, contactNumber: text})}
                        placeholder="+94 XX XXX XXXX"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Special Requests</Text>
                      <TextInput
                        style={[styles.textInput, styles.textArea]}
                        value={donationForm.specialRequests}
                        onChangeText={(text) => setDonationForm({...donationForm, specialRequests: text})}
                        placeholder="Any special requirements or notes..."
                        placeholderTextColor="#9CA3AF"
                        multiline
                        numberOfLines={3}
                      />
                    </View>

                    <View style={styles.noteContainer}>
                      <Ionicons name="information-circle" size={16} color="#6B7280" />
                      <Text style={styles.noteText}>
                        This is an emergency donation. We'll contact you immediately with urgent instructions for donation.
                      </Text>
                    </View>
                  </View>
                  
                  {/* Bottom padding for scrolling */}
                  <View style={styles.modalBottomPadding} />
                </>
              )}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.rescheduleButton]}
                onPress={closeDonationModal}
              >
                <Text style={styles.rescheduleButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.confirmButton]}
                onPress={handleDonationSubmit}
              >
                <Text style={styles.confirmButtonText}>Respond to Emergency</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    backgroundColor: '#DC2626',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
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
  statusText: {
    color: '#DC2626',
    fontWeight: '600',
  },
  instructionsContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    padding: 24,
    paddingTop: 0,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  rescheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#DC2626',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  // Emergency Modal Styles
  urgencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  criticalBanner: {
    backgroundColor: '#DC2626',
  },
  moderateBanner: {
    backgroundColor: '#F59E0B',
  },
  urgencyText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  timeLeftText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 'auto',
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
  // Donation Modal Styles
  emergencyInfo: {
    backgroundColor: '#FEF3F2',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  emergencyInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  emergencyInfoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  emergencyInfoUrgency: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  noteText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    lineHeight: 16,
  },
  modalBottomPadding: {
    height: 60,
  },
});