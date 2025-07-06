import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import QRDisplay from "../../components/atoms/Donation/QRDisplay";
import DonationForm from "../../components/organisms/DonationForm";
import AppointmentTab from "../../components/organisms/DonationScreen/AppointmentTab";
import AppointmentBookingForm from "../../components/organisms/DonationScreen/AppointmentBookingForm";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import Button from "../../components/atoms/Button";
import {
  donationService,
  UserProfile,
} from "../../app/services/donationService";

const DonateScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'qr' | 'appointment'>('qr');
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  
  // Mock appointments data
  const [appointments] = useState([
    {
      id: '1',
      hospital: 'City General Hospital',
      date: '2024-01-15',
      time: '10:00 AM',
      location: 'Blood Bank Unit, 3rd Floor',
      status: 'upcoming' as const
    },
    {
      id: '2',
      hospital: 'University Medical Center',
      date: '2023-12-20',
      time: '2:00 PM',
      location: 'Donation Center',
      status: 'completed' as const
    }
  ]);

  const navigation = useNavigation();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const profileData = await donationService.getUserProfile();
      setUserProfile(profileData);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      // Mock data for demo
      setUserProfile({
        id: "1",
        name: "Sabrina Aryan",
        email: "SabrinaAry208@gmail.com",
        uid: "UID123456789",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShowQR = () => {
    setShowQRModal(true);
  };

  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  // Simulate attendance marking (this would come from QR scan at camp)
  const simulateAttendanceMarked = () => {
    setAttendanceMarked(true);
    setShowQRModal(false);
    Alert.alert(
      "Welcome to the Donation Camp!",
      "Your attendance has been marked. Please fill out the health questionnaire to proceed with donation.",
      [
        {
          text: "Fill Form",
          onPress: () => setShowFormModal(true),
        },
      ]
    );
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    Alert.alert(
      "Form Submitted Successfully!",
      "Your health questionnaire has been submitted. Please wait for medical staff to review your information.",
      [{ text: "OK" }]
    );
  };

  const handleFormCancel = () => {
    setShowFormModal(false);
  };

  const handleBookAppointment = () => {
    setShowBookingModal(true);
  };

  const handleBookingModalClose = () => {
    setShowBookingModal(false);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    Alert.alert(
      "Appointment Booked Successfully!",
      "Your appointment has been booked. You will receive a confirmation email shortly.",
      [{ text: "OK" }]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Donation Center</Text>
          <Text style={styles.headerSubtitle}>
            Show your QR code or book an appointment
          </Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'qr' && styles.activeTab]}
            onPress={() => setActiveTab('qr')}
          >
            <View style={styles.tabContent}>
              <Ionicons name="qr-code" size={16} color={activeTab === 'qr' ? '#DC2626' : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'qr' && styles.activeTabText]}>
                QR Code
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'appointment' && styles.activeTab]}
            onPress={() => setActiveTab('appointment')}
          >
            <View style={styles.tabContent}>
              <Ionicons name="calendar" size={16} color={activeTab === 'appointment' ? '#DC2626' : '#6B7280'} />
              <Text style={[styles.tabText, activeTab === 'appointment' && styles.activeTabText]}>
                Appointments
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {activeTab === 'qr' ? (
            <View style={styles.qrContainer}>
              {!attendanceMarked ? (
                <View style={styles.qrContent}>
                  <View style={styles.qrCard}>
                    <Ionicons name="phone-portrait" size={64} color="#DC2626" style={{ marginBottom: 16 }} />
                    <Text style={styles.cardTitle}>Ready to Donate?</Text>
                    <Text style={styles.cardSubtitle}>
                      Show your QR code to the camp staff to mark your attendance
                    </Text>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleShowQR}>
                      <Text style={styles.primaryButtonText}>Show QR Code</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.instructionsCard}>
                    <Text style={styles.instructionsTitle}>Instructions:</Text>
                    <Text style={styles.instructionsText}>
                      1. Show your QR code to the reception staff{"\n"}
                      2. Wait for attendance confirmation{"\n"}
                      3. Fill the health questionnaire{"\n"}
                      4. Proceed with medical screening
                    </Text>
                  </View>
                </View>
              ) : (
                <View style={styles.qrContent}>
                  <View style={styles.successCard}>
                    <Ionicons name="checkmark-circle" size={64} color="#10B981" style={{ marginBottom: 16 }} />
                    <Text style={styles.cardTitle}>Attendance Marked!</Text>
                    <Text style={styles.cardSubtitle}>
                      Please fill out the health questionnaire to continue
                    </Text>

                    <TouchableOpacity style={styles.primaryButton} onPress={() => setShowFormModal(true)}>
                      <Text style={styles.primaryButtonText}>Fill Health Form</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <AppointmentTab 
              appointments={appointments}
              onBookAppointment={handleBookAppointment}
            />
          )}
        </ScrollView>
      </View>

      <BottomTabBar activeTab="donate" />

      {/* QR Code Modal */}
      <Modal
        visible={showQRModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your QR Code</Text>
            <TouchableOpacity onPress={handleCloseQRModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {userProfile && (
            <QRDisplay
              userName={userProfile.name}
              userEmail={userProfile.email}
              userUID={userProfile.uid}
            />
          )}

          <View style={styles.demoTextContainer}>
            <Button
              title="Simulate Attendance Marked"
              onPress={simulateAttendanceMarked}
              variant="outline"
            />
            <Text style={styles.demoText}>
              (For demo purposes - simulates camp staff scanning your QR)
            </Text>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Donation Form Modal */}
      <Modal
        visible={showFormModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleFormCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Health Questionnaire</Text>
              <TouchableOpacity onPress={handleFormCancel} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <DonationForm
                onSubmitSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Appointment Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AppointmentBookingForm
          onClose={handleBookingModalClose}
          onBookingSuccess={handleBookingSuccess}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 12,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    marginLeft: 8,
    textAlign: 'center',
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#DC2626',
  },
  scrollContainer: {
    flex: 1,
  },
  qrContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  qrContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  successCard: {
    backgroundColor: 'white',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 280,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionsCard: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  modalBodyScrollable: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
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
  demoTextContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  demoText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  closeButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DonateScreen;
