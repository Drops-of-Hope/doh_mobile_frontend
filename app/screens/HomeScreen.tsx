import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Text,
  Pressable,
  TextInput,
  Alert,
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
  section: {
    marginBottom: 24,
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