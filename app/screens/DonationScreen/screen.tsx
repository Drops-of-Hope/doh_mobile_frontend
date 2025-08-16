import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";

// Import refactored components
import TabNavigation from "./molecules/TabNavigation";
import QRSection from "./molecules/QRSection";
import AppointmentSection from "./molecules/AppointmentSection";

// Import modal organisms
import QRModal from "./organisms/QRModal";
import DonationFormModal from "./organisms/DonationFormModal";
import AppointmentBookingModal from "./organisms/AppointmentBookingModal";

// Import existing bottom tab bar
import BottomTabBar from "../../../components/organisms/BottomTabBar";

// Import types and utilities
import { TabType, UserProfile, Appointment } from "./types";
import { getMockAppointments, getMockUserProfile } from "./utils";
import { donationService, DonationStatusResponse } from "../../services/donationService";

interface DonationScreenProps {
  navigation?: any;
}

export default function DonationScreen({ navigation }: DonationScreenProps) {
  // State management
  const [activeTab, setActiveTab] = useState<TabType>("qr");
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [donationStatus, setDonationStatus] = useState<DonationStatusResponse | null>(null);
  const [appointments] = useState<Appointment[]>(getMockAppointments());

  // Load user profile and donation status
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setLoading(true);
        // Use mock profile for now since service profile structure is different
        const profile = getMockUserProfile();
        setUserProfile(profile);
        
        // Load donation status if we have a user ID
        if (profile.id) {
          await loadDonationStatus(profile.id);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setUserProfile(getMockUserProfile());
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  // Load donation status
  const loadDonationStatus = async (userId: string) => {
    try {
      const status = await donationService.getDonationStatus(userId);
      setDonationStatus(status);
      setAttendanceMarked(status.attendanceMarked);
    } catch (error) {
      console.error("Failed to load donation status:", error);
      // Set default status on error
      setDonationStatus({
        attendanceMarked: false,
        formStatus: 'not_filled',
        screeningStatus: 'pending',
        eligibleForDonation: userProfile?.eligibleForDonation || false,
      });
    }
  };

  // Modal handlers
  const handleShowQR = () => {
    if (!userProfile?.eligibleForDonation) {
      Alert.alert(
        "Not Eligible",
        "You are currently not eligible for donation. Please check your eligibility status.",
        [{ text: "OK" }]
      );
      return;
    }
    setShowQRModal(true);
  };

  const handleShowForm = () => {
    setShowFormModal(true);
  };

  const handleShowBooking = () => {
    setShowBookingModal(true);
  };

  const handleMarkAttendance = async () => {
    if (attendanceMarked || !userProfile) return;

    // Simulate QR scan process
    Alert.alert(
      "QR Code Scanned",
      "Your QR code has been scanned by staff successfully.",
      [
        {
          text: "Mark Attendance",
          onPress: async () => {
            try {
              // Call API to mark attendance
              const response = await donationService.markAttendance(userProfile.id, 'hospital');
              
              if (response.success) {
                setAttendanceMarked(true);
                setQrScanned(true);
                
                // Reload donation status
                await loadDonationStatus(userProfile.id);
                
                const message = response.campaignTitle 
                  ? `Your attendance at ${response.campaignTitle} has been recorded.`
                  : "Attendance recorded at hospital.";
                
                Alert.alert("Success", message);
              } else {
                Alert.alert("Error", response.message || "Failed to mark attendance");
              }
            } catch (error) {
              console.error("Failed to mark attendance:", error);
              // Fallback to simulate for demo
              setAttendanceMarked(true);
              setQrScanned(true);
              Alert.alert(
                "Success",
                "Your attendance has been marked! You can now fill the donation form."
              );
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleBookAppointment = () => {
    Alert.alert(
      "Appointment Booked",
      "Your appointment has been successfully booked. You will receive a confirmation shortly.",
      [
        {
          text: "OK",
          onPress: () => setShowBookingModal(false),
        },
      ]
    );
  };

  const handleFormSubmit = async () => {
    if (!userProfile) {
      Alert.alert("Error", "User profile not found");
      return;
    }

    try {
      // This will be called from the DonationForm component, but we need to update the status
      await loadDonationStatus(userProfile.id);
      
      Alert.alert(
        "Form Submitted",
        "Application submitted successfully. Please proceed to medical screening.",
        [
          {
            text: "OK",
            onPress: () => setShowFormModal(false),
          },
        ]
      );
    } catch (error) {
      console.error("Form submission error:", error);
      Alert.alert(
        "Form Submitted",
        "Your donation form has been submitted successfully. Thank you for your contribution!",
        [
          {
            text: "OK",
            onPress: () => setShowFormModal(false),
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          {/* Add loading spinner if needed */}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "qr" ? (
          <QRSection
            userProfile={userProfile}
            attendanceMarked={attendanceMarked}
            qrScanned={qrScanned}
            donationStatus={donationStatus}
            onShowQR={handleShowQR}
            onShowForm={handleShowForm}
            onMarkAttendance={handleMarkAttendance}
          />
        ) : (
          <AppointmentSection
            appointments={appointments}
            onShowBooking={handleShowBooking}
          />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Reuse existing modals through wrappers */}
      <QRModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        userProfile={userProfile}
      />

      <DonationFormModal
        visible={showFormModal}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleFormSubmit}
        userId={userProfile?.id}
      />

      <AppointmentBookingModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBookAppointment={handleBookAppointment}
      />

      <BottomTabBar activeTab="donate" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomPadding: {
    height: 100,
  },
});
