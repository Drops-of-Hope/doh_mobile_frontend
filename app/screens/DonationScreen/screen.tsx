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

  // Load user appointments
  const loadUserAppointments = async () => {
    if (!userProfile?.id) return;
    
    try {
      setAppointmentsLoading(true);
      const appointmentData = await getUserAppointments(userProfile.id);
      setAppointments(appointmentData);
    } catch (error) {
      console.error("Error loading user appointments:", error);
      Alert.alert(
        "Error",
        "Failed to load appointments. Please try again.",
        [{ text: "OK" }]
      );
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
