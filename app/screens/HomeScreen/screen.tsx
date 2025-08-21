import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import BottomTabBar from "../../../components/organisms/BottomTabBar";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";

// Import existing HomeScreen components
import HomeHeader from "../../../components/organisms/HomeScreen/HomeHeader";
import StatsCard from "../../../components/molecules/HomeScreen/StatsCard";
import ComponentRow from "../../../components/molecules/HomeScreen/ComponentRow";
import EmergenciesSection from "../../../components/organisms/HomeScreen/EmergenciesSection";
import CampaignsSection from "../../../components/organisms/HomeScreen/CampaignsSection";
import AppointmentSection from "../../../components/organisms/HomeScreen/AppointmentSection";

// Import new refactored components
import FloatingButton from "./atoms/FloatingButton";
import AppointmentDetailsModal from "./organisms/AppointmentDetailsModal";
import EmergencyDetailsModal from "./organisms/EmergencyDetailsModal";
import DonationBookingModal from "./organisms/DonationBookingModal";
import RescheduleModal from "./organisms/RescheduleModal";

// Import types and utilities
import {
  Appointment,
  Emergency,
  Campaign,
  DonationFormData,
  RescheduleFormData,
  CalendarData,
} from "./types";
import {
  generateMockData,
  generateCalendarDays,
  getMonthName,
  getAvailableTimeSlots,
} from "./utils";

interface HomeScreenProps {
  navigation?: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  // State management
  const [searchText, setSearchText] = useState<string>("");
  const [upcomingAppointment, setUpcomingAppointment] =
    useState<Appointment | null>(null);

  // Modal states
  const [showAppointmentModal, setShowAppointmentModal] =
    useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [showRescheduleModal, setShowRescheduleModal] =
    useState<boolean>(false);

  // Selection states
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null,
  );

  // Form states
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    contactNumber: "",
    specialRequests: "",
  });

  const [rescheduleForm, setRescheduleForm] = useState<RescheduleFormData>({
    preferredDate: "",
    preferredTime: "",
    reason: "",
  });

  // Calendar states
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Auth and Language
  const { getFirstName, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    loadUpcomingAppointment();
  }, []);

  const loadUpcomingAppointment = async () => {
    try {
      const mockAppointment: Appointment = {
        id: "1",
        date: "July 15, 2025",
        time: "10:00 AM",
        location: "Colombo Blood Bank",
        hospital: "Colombo General Hospital",
        status: "upcoming",
      };
      setUpcomingAppointment(mockAppointment);
    } catch (error) {
      console.error("Failed to load appointment:", error);
    }
  };

  // Navigation handlers
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleNotificationPress = () => {
    if (navigation) {
      navigation.navigate("Notifications");
    } else {
      console.log("Navigate to Notifications screen");
    }
  };

  const handleViewAllEmergencies = () => {
    navigation?.navigate("AllEmergencies");
  };

  const handleViewAllCampaigns = () => {
    navigation?.navigate("AllCampaigns");
  };

  // Modal handlers
  const handleDonateNow = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
    setShowDonationModal(true);
  };

  const handleViewEmergencyDetails = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
    setShowEmergencyModal(true);
  };

  const handleAppointmentDetails = () => {
    setShowAppointmentModal(true);
  };

  const handleReschedule = () => {
    setShowRescheduleModal(true);
  };

  // Modal close handlers
  const closeModal = () => setShowAppointmentModal(false);
  const closeEmergencyModal = () => {
    setShowEmergencyModal(false);
    setSelectedEmergency(null);
  };
  const closeDonationModal = () => {
    setShowDonationModal(false);
    setSelectedEmergency(null);
    setDonationForm({ contactNumber: "", specialRequests: "" });
  };
  const closeRescheduleModal = () => {
    setShowRescheduleModal(false);
    setShowCalendar(false);
    setRescheduleForm({ preferredDate: "", preferredTime: "", reason: "" });
  };

  // Form submission handlers
  const handleDonationSubmit = () => {
    if (!donationForm.contactNumber) {
      Alert.alert(t("home.missing_information"), t("home.contact_number_required"));
      return;
    }

    Alert.alert(
      t("home.emergency_response_submitted"),
      t("home.emergency_response_message"),
      [{ text: t("common.ok"), onPress: closeDonationModal }],
    );
  };

  const handleRescheduleSubmit = () => {
    if (!rescheduleForm.preferredDate || !rescheduleForm.preferredTime) {
      Alert.alert(
        t("home.missing_information"),
        t("home.reschedule_missing_info"),
      );
      return;
    }

    Alert.alert(
      t("home.appointment_rescheduled"),
      t("home.appointment_reschedule_message", {
        date: rescheduleForm.preferredDate,
        time: rescheduleForm.preferredTime
      }),
      [
        {
          text: t("common.ok"),
          onPress: () => {
            closeRescheduleModal();
            loadUpcomingAppointment();
          },
        },
      ],
    );
  };

  // Calendar handlers
  const canNavigatePrevious = () => {
    const today = new Date();
    return (
      selectedMonth > today.getMonth() || selectedYear > today.getFullYear()
    );
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev" && canNavigatePrevious()) {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else if (direction === "next") {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const selectCalendarDate = (date: Date) => {
    setRescheduleForm({
      ...rescheduleForm,
      preferredDate: date.toLocaleDateString(),
      preferredTime: "", // Reset time when date changes
    });
    setShowCalendar(false);
  };

  // Get mock data
  const { emergencies, upcomingCampaigns } = generateMockData();
  const calendarDays = generateCalendarDays(selectedMonth, selectedYear);
  const monthName = getMonthName(selectedMonth);
  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <HomeHeader
            firstName={getFirstName()}
            donorLevel={t("home.silver_donor")}
            searchText={searchText}
            onSearchTextChange={setSearchText}
            onLogout={handleLogout}
          />

          <StatsCard totalDonations={12} />

          <View style={styles.section}>
            <ComponentRow bloodType="O+" lastDonationDays={473} />
          </View>

          <AppointmentSection
            appointment={upcomingAppointment}
            title={t("home.blood_donation")}
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
        </View>
      </ScrollView>

      <FloatingButton
        onPress={handleNotificationPress}
        iconName="notifications"
        hasNotification={true}
      />

      {/* Modals */}
      <AppointmentDetailsModal
        visible={showAppointmentModal}
        appointment={upcomingAppointment}
        onClose={closeModal}
        onReschedule={() => {
          closeModal();
          handleReschedule();
        }}
      />

      <EmergencyDetailsModal
        visible={showEmergencyModal}
        emergency={selectedEmergency}
        onClose={closeEmergencyModal}
        onDonate={() => {
          if (selectedEmergency) {
            handleDonateNow(selectedEmergency);
          }
        }}
      />

      <DonationBookingModal
        visible={showDonationModal}
        emergency={selectedEmergency}
        formData={donationForm}
        onFormChange={setDonationForm}
        onClose={closeDonationModal}
        onSubmit={handleDonationSubmit}
      />

      <RescheduleModal
        visible={showRescheduleModal}
        formData={rescheduleForm}
        onFormChange={setRescheduleForm}
        showCalendar={showCalendar}
        onToggleCalendar={() => setShowCalendar(!showCalendar)}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        calendarDays={calendarDays}
        monthName={monthName}
        canNavigatePrevious={canNavigatePrevious()}
        onPreviousMonth={() => navigateMonth("prev")}
        onNextMonth={() => navigateMonth("next")}
        onDateSelect={selectCalendarDate}
        availableTimeSlots={availableTimeSlots}
        onClose={closeRescheduleModal}
        onSubmit={handleRescheduleSubmit}
      />

      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  bottomPadding: {
    height: 100,
  },
});
