import React, { useState } from "react";
import { Alert } from "react-native";
import { Screen, AppBar } from "../../design";

// Import refactored components
import StatsOverview from "./molecules/StatsOverview";
import EmergencyList from "./molecules/EmergencyList";

// Reuse organisms from HomeScreen
import EmergencyDetailsModal from "../HomeScreen/organisms/EmergencyDetailsModal";
import DonationBookingModal from "../HomeScreen/organisms/DonationBookingModal";

// Import types and utilities
import { Emergency, DonationFormData } from "./types";
import { getAllEmergencies, getEmergencyStats } from "./utils";

interface AllEmergenciesScreenProps {
  navigation?: any;
}

export default function AllEmergenciesScreen({
  navigation,
}: AllEmergenciesScreenProps) {
  // State management
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(
    null,
  );
  const [donationForm, setDonationForm] = useState<DonationFormData>({
    contactNumber: "",
    specialRequests: "",
  });

  // Navigation handlers
  const handleBack = () => {
    if (navigation) {
      navigation.goBack();
    }
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

  // Modal close handlers
  const closeEmergencyModal = () => {
    setShowEmergencyModal(false);
    setSelectedEmergency(null);
  };

  const closeDonationModal = () => {
    setShowDonationModal(false);
    setSelectedEmergency(null);
    setDonationForm({
      contactNumber: "",
      specialRequests: "",
    });
  };

  // Form submission handler
  const handleDonationSubmit = () => {
    if (!donationForm.contactNumber) {
      Alert.alert("Error", "Please provide your contact number");
      return;
    }

    Alert.alert(
      "Emergency Donation Registered!",
      `Thank you for responding to this emergency! We'll contact you immediately at ${donationForm.contactNumber} with instructions for immediate donation.`,
      [
        {
          text: "OK",
          onPress: () => {
            closeDonationModal();
          },
        },
      ],
    );
  };

  // Get data
  const allEmergencies = getAllEmergencies();
  const stats = getEmergencyStats(allEmergencies);

  return (
    <Screen scroll>
      <AppBar title="All Emergencies" onBack={handleBack} />

      <StatsOverview stats={stats} />

      <EmergencyList
        emergencies={allEmergencies}
        onDonate={handleDonateNow}
        onViewDetails={handleViewEmergencyDetails}
      />

      {/* Modals */}
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
    </Screen>
  );
}
