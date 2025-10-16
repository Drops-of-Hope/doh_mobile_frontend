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
import BottomTabBar from "../shared/organisms/BottomTabBar";

// Import types and utilities
import { TabType, UserProfile, Appointment } from "./types";
import { getUserAppointments } from "./utils";
import { useAuth } from "../../context/AuthContext";
import { donationService } from "../../services/donationService";
import { registerForPushNotifications, registerPushTokenWithBackend, setupNotificationHandlers } from "../../services/pushService";

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
  const [appointments, setAppointments] = useState<{
    upcoming: Appointment[];
    history: Appointment[];
  }>({ upcoming: [], history: [] });
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  // Load user appointments
  const loadUserAppointments = async () => {
    if (!userProfile?.id) {
      console.log("No user profile ID available, skipping appointment load");
      return;
    }
    
    try {
      setAppointmentsLoading(true);
      console.log("Loading appointments for user:", userProfile.id);
      const appointmentData = await getUserAppointments(userProfile.id);
      console.log("Appointment data loaded:", appointmentData);
      setAppointments(appointmentData);
    } catch (error) {
      console.error("Error loading user appointments:", error);
      // Set empty appointments instead of showing error for new users
      setAppointments({ upcoming: [], history: [] });
      
      // Only show error if it's a real network/server issue
      if (error instanceof Error && 
          !error.message.includes("404") && 
          !error.message.includes("not found") &&
          !error.message.includes("Network request failed")) {
        Alert.alert(
          "Error",
          "Failed to load appointments. Please try again later.",
          [{ text: "OK" }]
        );
      }
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Load user profile
  // Refresh auth state once on mount. Calling this repeatedly when `user`
  // changes caused a feedback loop (refresh -> setUser -> effect -> refresh).
  useEffect(() => {
    (async () => {
      try {
        await refreshAuthState();
        // Register push token and set up notification handler once
        const token = await registerForPushNotifications();
        if (token) await registerPushTokenWithBackend(token);
        const cleanup = setupNotificationHandlers((payload) => {
          if (payload?.type === "CAMPAIGN_ATTENDANCE") {
            setAttendanceMarked(true);
            setQrScanned(true);
          }
        });
        return () => cleanup?.();
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

  // Load appointments when user profile is available
  useEffect(() => {
    if (userProfile?.id) {
      loadUserAppointments();
    }
  }, [userProfile?.id]);

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

  const handleBookAppointment = () => {
    // Close the booking modal - success message is handled by AppointmentBookingForm
    setShowBookingModal(false);
    // Refresh appointments to show the new booking
    loadUserAppointments();
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

  const handleStartTimer = () => {
    setIsTimerStarted(true);
    // Navigate to the timer screen
    navigation?.navigate('DonationTimer');
  };

  const handleQRSuccess = () => {
    setAttendanceMarked(true);
    setQrScanned(true);
    setShowQRModal(false);
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
            qrScanned={qrScanned}
            onStartTimer={handleStartTimer}
            isTimerStarted={isTimerStarted}
          />
        ) : (
          <AppointmentSection
            appointments={[...appointments.upcoming, ...appointments.history]}
            upcomingAppointments={appointments.upcoming}
            appointmentHistory={appointments.history}
            loading={appointmentsLoading}
            onShowBooking={handleShowBooking}
            onRefresh={loadUserAppointments}
          />
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Reuse existing modals through wrappers */}
      <QRModal
        visible={showQRModal}
        onClose={() => setShowQRModal(false)}
        userProfile={userProfile}
        onSuccess={handleQRSuccess}
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
