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
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Emergency } from '../../components/molecules/HomeScreen/EmergencyCard';
import EmergencyCard from '../../components/molecules/HomeScreen/EmergencyCard';

interface AllEmergenciesScreenProps {
  navigation?: any;
}

export default function AllEmergenciesScreen({ navigation }: AllEmergenciesScreenProps) {
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [donationForm, setDonationForm] = useState({
    contactNumber: '',
    specialRequests: '',
  });

  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
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

    Alert.alert(
      'Emergency Donation Registered!',
      `Thank you for responding to this emergency! We'll contact you immediately at ${donationForm.contactNumber} with instructions for immediate donation.`,
      [
        {
          text: 'OK',
          onPress: () => {
            closeDonationModal();
          }
        }
      ]
    );
  };

  // Extended list of emergencies - Only showing emergencies compatible with O+ donor
  const allEmergencies: Emergency[] = [
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
    },
    {
      id: 3,
      hospital: 'Kandy Teaching Hospital',
      bloodType: 'O+ Needed',
      slotsUsed: 2,
      totalSlots: 6,
      urgency: 'Moderate',
      timeLeft: '8 hours left',
      description: 'O+ blood type needed for surgery patient. Limited stock available and surgery scheduled tomorrow morning.',
      contactNumber: '+94 81 234 5678',
      address: '789 Peradeniya Road, Kandy',
      requirements: 'Minimum 450ml donation, Age 18-65, Weight above 50kg'
    },
    {
      id: 4,
      hospital: 'Galle District Hospital',
      bloodType: 'AB+ Needed',
      slotsUsed: 1,
      totalSlots: 4,
      urgency: 'Low',
      timeLeft: '12 hours left',
      description: 'AB+ blood needed for planned surgery. Patient scheduled for operation and needs blood backup.',
      contactNumber: '+94 91 234 5678',
      address: '321 Galle Road, Galle',
      requirements: 'Minimum 450ml donation, Age 18-65, Weight above 50kg'
    },
    {
      id: 5,
      hospital: 'Jaffna Teaching Hospital',
      bloodType: 'O+ Needed',
      slotsUsed: 4,
      totalSlots: 5,
      urgency: 'Critical',
      timeLeft: '1 hour left',
      description: 'O+ blood urgently needed for trauma patient. Emergency surgery in progress.',
      contactNumber: '+94 21 234 5678',
      address: '654 Hospital Street, Jaffna',
      requirements: 'Minimum 450ml donation, Age 18-65, Weight above 50kg'
    },
    {
      id: 6,
      hospital: 'Anuradhapura Teaching Hospital',
      bloodType: 'AB+ Needed',
      slotsUsed: 1,
      totalSlots: 3,
      urgency: 'Moderate',
      timeLeft: '6 hours left',
      description: 'AB+ blood type needed for maternal emergency. Expecting mother requires blood support for safe delivery.',
      contactNumber: '+94 25 234 5678',
      address: '987 Old Road, Anuradhapura',
      requirements: 'Minimum 450ml donation, Age 18-65, Weight above 50kg'
    },
    {
      id: 7,
      hospital: 'Batticaloa District Hospital',
      bloodType: 'O+ Needed',
      slotsUsed: 0,
      totalSlots: 3,
      urgency: 'Low',
      timeLeft: '24 hours left',
      description: 'O+ blood needed for scheduled surgery tomorrow. Elective procedure requires blood backup availability.',
      contactNumber: '+94 65 234 5678',
      address: '159 Coastal Road, Batticaloa',
      requirements: 'Minimum 450ml donation, Age 18-65, Weight above 50kg'
    },
  ];

  // Calculate statistics
  const getEmergencyStats = () => {
    const critical = allEmergencies.filter(e => e.urgency === 'Critical').length;
    const moderate = allEmergencies.filter(e => e.urgency === 'Moderate').length;
    const low = allEmergencies.filter(e => e.urgency === 'Low').length;
    
    return { critical, moderate, low, total: allEmergencies.length };
  };

  const stats = getEmergencyStats();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Emergencies</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            {allEmergencies.length} active emergencies need your help
          </Text>

          {/* Statistics Section */}
          <View style={styles.statsSection}>
            <Text style={styles.statsTitle}>Emergency Breakdown</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={[styles.statIndicator, styles.criticalIndicator]} />
                <Text style={styles.statNumber}>{stats.critical}</Text>
                <Text style={styles.statLabel}>Critical</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIndicator, styles.moderateIndicator]} />
                <Text style={styles.statNumber}>{stats.moderate}</Text>
                <Text style={styles.statLabel}>Moderate</Text>
              </View>
              <View style={styles.statCard}>
                <View style={[styles.statIndicator, styles.lowIndicator]} />
                <Text style={styles.statNumber}>{stats.low}</Text>
                <Text style={styles.statLabel}>Low</Text>
              </View>
            </View>
          </View>

          <View style={styles.emergenciesContainer}>
            {allEmergencies.map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
                onDonate={handleDonateNow}
                onViewDetails={handleViewEmergencyDetails}
              />
            ))}
          </View>
        </View>
      </ScrollView>

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
    paddingBottom: 16,
    backgroundColor: '#FAFBFC',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    paddingTop: 60, // Adjusted for status bar height
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  // Statistics Section Styles
  statsSection: {
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  criticalIndicator: {
    backgroundColor: '#DC2626',
  },
  moderateIndicator: {
    backgroundColor: '#F59E0B',
  },
  lowIndicator: {
    backgroundColor: '#10B981',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emergenciesContainer: {
    gap: 16,
  },
  // Modal styles - copied from HomeScreen
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
