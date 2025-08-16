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
import { getMockAppointments } from "./utils";
import { useAuth } from "../../context/AuthContext";
import { donationService } from "../../services/donationService";

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
  const { user, isAuthenticated, refreshAuthState, getFullName } = useAuth();
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [appointments] = useState<Appointment[]>(getMockAppointments());

  // Load user profile
  // Refresh auth state once on mount. Calling this repeatedly when `user`
  // changes caused a feedback loop (refresh -> setUser -> effect -> refresh).
  useEffect(() => {
    (async () => {
      try {
        await refreshAuthState();
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Map the auth user to the local UserProfile whenever the auth user changes.
  useEffect(() => {
    const mapAuthUserToProfile = () => {
      setLoading(true);
      try {
        if (!user) {
          setUserProfile(null);
          return;
        }

        // Map fields from AuthContext user to screen UserProfile
        const mapped: UserProfile = {
          id: user.sub || user.id || "",
          name: user.name || getFullName(),
          email: user.email || user.username || "",
          bloodType: user.blood_group || user.bloodGroup || "O+",
          lastDonationDate: user.last_donation_date || undefined,
          totalDonations: (user as any).totalDonations || 0,
          eligibleForDonation: (user as any).eligibleForDonation ?? true,
        };

        setUserProfile(mapped);
      } catch (error) {
        console.error("Error mapping auth user to profile:", error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };

    mapAuthUserToProfile();
  }, [user, isAuthenticated]);

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

  const handleMarkAttendance = () => {
    if (attendanceMarked) return;

    // Simulate QR scan process
    Alert.alert(
      "QR Code Scanned",
      "Your QR code has been scanned by staff successfully.",
      [
        {
          text: "Mark Attendance",
          onPress: () => {
            setAttendanceMarked(true);
            Alert.alert(
              "Success",
              "Your attendance has been marked! You can now fill the donation form."
            );
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

  const handleFormSubmit = () => {
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
