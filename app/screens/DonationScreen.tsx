import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { useNavigation } from "@react-navigation/native";
import QRDisplay from "../../components/atoms/Donation/QRDisplay";
import DonationForm from "../../components/organisms/DonationForm";
import AppointmentTab from "../../components/organisms/DonationScreen/AppointmentTab";
import BottomTabBar from "../../components/organisms/BottomTabBar";
import Button from "../../components/atoms/Button";
import {
  donationService,
  UserProfile,
} from "../../app/services/donationService";

const StyledView = styled(View);
const StyledSafeAreaView = styled(SafeAreaView);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

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

  if (loading) {
    return (
      <StyledSafeAreaView className="flex-1 bg-white">
        <StyledView className="flex-1 justify-center items-center">
          <StyledText className="text-lg text-gray-600">Loading...</StyledText>
        </StyledView>
      </StyledSafeAreaView>
    );
  }

  return (
    <StyledSafeAreaView className="flex-1 bg-white">
      <StyledView className="flex-1 pt-10">
        {/* Header */}
        <StyledView className="px-6 py-4 border-b border-gray-200">
          <StyledText className="text-2xl font-bold text-gray-800">
            Donation Center
          </StyledText>
          <StyledText className="text-sm text-gray-600 mt-1">
            Show your QR code or book an appointment
          </StyledText>
        </StyledView>

        {/* Tab Navigation */}
        <StyledView className="flex-row bg-gray-100 mx-6 mt-4 rounded-xl p-1.5 shadow-sm border border-gray-200">
          <StyledTouchableOpacity 
            className={`flex-1 py-3 px-4 rounded-lg ${activeTab === 'qr' ? 'bg-white shadow-md border border-red-100' : ''}`}
            onPress={() => setActiveTab('qr')}
          >
            <StyledText className={`text-center font-semibold ${activeTab === 'qr' ? 'text-red-600' : 'text-gray-500'}`}>
              🏥 QR Code
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity 
            className={`flex-1 py-3 px-4 rounded-lg ${activeTab === 'appointment' ? 'bg-white shadow-md border border-red-100' : ''}`}
            onPress={() => setActiveTab('appointment')}
          >
            <StyledText className={`text-center font-semibold ${activeTab === 'appointment' ? 'text-red-600' : 'text-gray-500'}`}>
              📅 Appointments
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Main Content */}
        <StyledView className="flex-1">
          {activeTab === 'qr' ? (
            <StyledView className="flex-1 px-6 py-8">
              {!attendanceMarked ? (
                <StyledView className="flex-1 justify-center items-center">
                  <StyledView className="bg-blue-50 p-8 rounded-2xl border border-blue-200 items-center mb-8">
                    <StyledText className="text-6xl mb-4">📱</StyledText>
                    <StyledText className="text-xl font-semibold text-gray-800 text-center mb-2">
                      Ready to Donate?
                    </StyledText>
                    <StyledText className="text-gray-600 text-center mb-6 max-w-xs">
                      Show your QR code to the camp staff to mark your attendance
                    </StyledText>

                    <Button title="Show QR Code" onPress={handleShowQR} />
                  </StyledView>

                  <StyledView className="bg-gray-50 p-6 rounded-xl border border-gray-200 w-full">
                    <StyledText className="text-lg font-semibold text-gray-800 mb-2">
                      Instructions:
                    </StyledText>
                    <StyledText className="text-gray-600 text-sm leading-6">
                      1. Show your QR code to the reception staff{"\n"}
                      2. Wait for attendance confirmation{"\n"}
                      3. Fill the health questionnaire{"\n"}
                      4. Proceed with medical screening
                    </StyledText>
                  </StyledView>
                </StyledView>
              ) : (
                <StyledView className="flex-1 justify-center items-center">
                  <StyledView className="bg-green-50 p-8 rounded-2xl border border-green-200 items-center mb-8">
                    <StyledText className="text-6xl mb-4">✅</StyledText>
                    <StyledText className="text-xl font-semibold text-gray-800 text-center mb-2">
                      Attendance Marked!
                    </StyledText>
                    <StyledText className="text-gray-600 text-center mb-6 max-w-xs">
                      Please fill out the health questionnaire to continue
                    </StyledText>

                    <Button
                      title="Fill Health Form"
                      onPress={() => setShowFormModal(true)}
                    />
                  </StyledView>
                </StyledView>
              )}
            </StyledView>
          ) : (
            <AppointmentTab 
              appointments={appointments}
              onBookAppointment={handleBookAppointment}
            />
          )}
        </StyledView>

        <BottomTabBar activeTab="donate" />

        {/* QR Code Modal */}
        <Modal
          visible={showQRModal}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <StyledSafeAreaView className="flex-1 bg-white">
            <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <StyledText className="text-lg font-semibold">
                Your QR Code
              </StyledText>
              <StyledTouchableOpacity onPress={handleCloseQRModal}>
                <StyledText className="text-red-600 font-medium">
                  Close
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            {userProfile && (
              <QRDisplay
                userName={userProfile.name}
                userEmail={userProfile.email}
                userUID={userProfile.uid}
              />
            )}

            <StyledView className="p-4">
              <Button
                title="Simulate Attendance Marked"
                onPress={simulateAttendanceMarked}
                variant="outline"
              />
              <StyledText className="text-xs text-gray-500 text-center mt-2">
                (For demo purposes - simulates camp staff scanning your QR)
              </StyledText>
            </StyledView>
          </StyledSafeAreaView>
        </Modal>

        {/* Donation Form Modal */}
        <Modal
          visible={showFormModal}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <StyledSafeAreaView className="flex-1 bg-white">
            <StyledView className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <StyledText className="text-lg font-semibold">
                Health Questionnaire
              </StyledText>
              <StyledTouchableOpacity onPress={handleFormCancel}>
                <StyledText className="text-red-600 font-medium">
                  Cancel
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            <DonationForm
              onSubmitSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </StyledSafeAreaView>
        </Modal>
      </StyledView>
    </StyledSafeAreaView>
  );
};

export default DonateScreen;
