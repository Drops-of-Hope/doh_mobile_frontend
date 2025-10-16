import React, { useState, useEffect, useRef } from "react";
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
import { notificationService } from "../../services/notificationService";

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
  
  // Polling state for attendance verification
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingComplete, setPollingComplete] = useState(false);
  const [canRetry, setCanRetry] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimerRef = useRef<NodeJS.Timeout | null>(null);

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
  // Refresh auth state once on mount
  useEffect(() => {
    refreshAuthState();
  }, []);

  // Polling function to check for attendance notification
  const pollForAttendanceNotification = async () => {
    if (!userProfile?.id) {
      console.log("⚠️ No user ID available for polling");
      return false;
    }

    try {
      console.log(`🔍 Polling attempt ${pollingAttempts + 1}/3 for attendance notification`);
      console.log(`🔍 User ID: ${userProfile.id}`);
      
      const notification = await notificationService.getLatestNotificationByType(
        userProfile.id,
        "DONATION_ELIGIBLE"
      );
      
      console.log("📬 Notification received:", JSON.stringify(notification, null, 2));
      console.log("📬 Notification type:", notification?.type);
      console.log("📬 Notification title:", notification?.title);
      
      if (notification && notification.title === "QR scanned") {
        console.log("✅ Attendance notification found!", notification);
        setAttendanceMarked(true);
        setQrScanned(true);
        setIsPolling(false);
        setPollingComplete(true);
        
        // Clear polling interval
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        
        return true;
      } else {
        console.log("❌ Notification not found or doesn't match criteria");
        if (notification) {
          console.log(`   - Has notification: YES`);
          console.log(`   - Title match: ${notification.title} === "QR scanned" ? ${notification.title === "QR scanned"}`);
        } else {
          console.log(`   - Has notification: NO`);
        }
      }
      
      return false;
    } catch (error) {
      console.error("❌ Error polling for notification:", error);
      return false;
    }
  };

  // Start polling after QR shown
  const startPolling = () => {
    console.log("🚀 Starting attendance polling (3 attempts, 3s intervals)");
    setIsPolling(true);
    setPollingAttempts(0);
    setPollingComplete(false);
    setCanRetry(false);
    
    let attempts = 0;
    const maxAttempts = 3;
    
    // Poll immediately
    pollForAttendanceNotification().then((found) => {
      if (found) return;
      
      attempts++;
      setPollingAttempts(attempts);
      
      // Set up interval for remaining attempts
      pollingIntervalRef.current = setInterval(async () => {
        if (attempts >= maxAttempts) {
          // Polling failed, enable retry
          console.log("⏱️ Polling complete - no notification found");
          setIsPolling(false);
          setPollingComplete(true);
          startRetryCountdown();
          
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          return;
        }
        
        const found = await pollForAttendanceNotification();
        if (!found) {
          attempts++;
          setPollingAttempts(attempts);
        }
      }, 3000); // 3 second intervals
    });
  };

  // Start countdown for retry button
  const startRetryCountdown = () => {
    const countdownDuration = 10; // 10 seconds
    setRetryCountdown(countdownDuration);
    setCanRetry(false);
    
    let remaining = countdownDuration;
    retryTimerRef.current = setInterval(() => {
      remaining--;
      setRetryCountdown(remaining);
      
      if (remaining <= 0) {
        setCanRetry(true);
        if (retryTimerRef.current) {
          clearInterval(retryTimerRef.current);
          retryTimerRef.current = null;
        }
      }
    }, 1000);
  };

  // Handle retry polling
  const handleRetryPolling = () => {
    if (canRetry) {
      startPolling();
    }
  };

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (retryTimerRef.current) {
        clearInterval(retryTimerRef.current);
      }
    };
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
    console.log("📱 Opening QR Modal for user:", userProfile?.id);
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

  const handleQRClose = () => {
    setShowQRModal(false);
    // Only start polling if we haven't already started or completed polling
    if (!isPolling && !pollingComplete && !attendanceMarked) {
      console.log("🔔 QR Modal closed, starting polling...");
      startPolling();
    } else {
      console.log("⏭️ QR Modal closed, but polling already in progress or completed");
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
            onShowQR={handleShowQR}
            onShowForm={handleShowForm}
            qrScanned={qrScanned}
            onStartTimer={handleStartTimer}
            isTimerStarted={isTimerStarted}
            isPolling={isPolling}
            pollingAttempts={pollingAttempts}
            pollingComplete={pollingComplete}
            canRetry={canRetry}
            retryCountdown={retryCountdown}
            onRetryPolling={handleRetryPolling}
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
        onClose={handleQRClose}
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
