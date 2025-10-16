import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NoticeCard from "../atoms/NoticeCard";
import {
  MedicalEstablishment,
  AppointmentSlot,
  AppointmentBookingRequest,
} from "../../../services/appointmentService";
import {
  District,
  ALL_DISTRICTS,
  formatDistrictName,
} from "../../../../constants";
import { getAppointmentService } from "../../../services/appointmentConfig";
import { useContext } from "react";
import { useAuth } from "../../../context/AuthContext";

interface AppointmentBookingFormProps {
  onClose: () => void;
  onBookingSuccess: () => void;
}

export default function AppointmentBookingForm({
  onClose,
  onBookingSuccess,
}: AppointmentBookingFormProps) {
  const [currentStep, setCurrentStep] = useState<
    "district" | "establishment" | "date" | "time" | "summary"
  >("district");
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(
    null
  );
  const [selectedEstablishment, setSelectedEstablishment] =
    useState<MedicalEstablishment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<AppointmentSlot | null>(
    null
  );

  const [medicalEstablishments, setMedicalEstablishments] = useState<
    MedicalEstablishment[]
  >([]);
  const [availableSlots, setAvailableSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Use all available districts from constants
  const availableDistricts = ALL_DISTRICTS;

  // Get next 7 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        date: date.toISOString().split("T")[0],
        display: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }
    return dates;
  };

  const availableDates = getAvailableDates();

  // Load medical establishments when district is selected
  useEffect(() => {
    if (selectedDistrict) {
      loadMedicalEstablishments();
    }
  }, [selectedDistrict]);

  // Load available slots when establishment and date are selected
  useEffect(() => {
    if (selectedEstablishment && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedEstablishment, selectedDate]);

  const loadMedicalEstablishments = async () => {
    if (!selectedDistrict) return;

    setLoading(true);
    try {
      const service = getAppointmentService();
      const establishments = await service.getMedicalEstablishmentsByDistrict(
        selectedDistrict
      );
      setMedicalEstablishments(establishments);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load medical establishments. Please try again."
      );
      console.error("Error loading medical establishments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableSlots = async () => {
    if (!selectedEstablishment || !selectedDate) return;

    setLoading(true);
    try {
      const service = getAppointmentService();
      const slots = await service.getAvailableSlots(
        selectedEstablishment.id,
        selectedDate
      );
      setAvailableSlots(slots);
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to load available time slots. Please try again."
      );
      console.error("Error loading slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    setSelectedEstablishment(null);
    setSelectedDate("");
    setSelectedSlot(null);
    setCurrentStep("establishment");
  };

  const handleEstablishmentSelect = (establishment: MedicalEstablishment) => {
    setSelectedEstablishment(establishment);
    setSelectedDate("");
    setSelectedSlot(null);
    setCurrentStep("date");
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setCurrentStep("time");
  };

  const handleSlotSelect = (slot: AppointmentSlot) => {
    setSelectedSlot(slot);
    setCurrentStep("summary");
  };

  const { user } = useAuth();
  const handleBookAppointment = async () => {
    if (
      !selectedDistrict ||
      !selectedEstablishment ||
      !selectedDate ||
      !selectedSlot
    ) {
      Alert.alert("Error", "Please complete all selections");
      return;
    }

    setLoading(true);
    try {
      // Get donorId from AuthProvider
      // (Assumes you have AuthProvider set up and provides a user object with a 'sub' property)

      const bookingRequest: AppointmentBookingRequest = {
        appointmentDate: selectedDate,
        slotId: selectedSlot.id,
        donorId: user?.sub ?? "N/A",
        medicalEstablishmentId: selectedSlot.medicalEstablishmentId,
      };

      const service = getAppointmentService();
      await service.createAppointment(bookingRequest);

      Alert.alert(
        "Appointment Booked!",
        `Your appointment has been scheduled for ${selectedDate} at ${selectedSlot.startTime}-${selectedSlot.endTime} at ${selectedEstablishment.name}.\n\nYou will receive a confirmation shortly.`,
        [{ text: "OK", onPress: onBookingSuccess }]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to book appointment. Please try again.");
      console.error("Error booking appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    switch (currentStep) {
      case "establishment":
        setCurrentStep("district");
        setSelectedDistrict(null);
        break;
      case "date":
        setCurrentStep("establishment");
        setSelectedEstablishment(null);
        break;
      case "time":
        setCurrentStep("date");
        setSelectedDate("");
        break;
      case "summary":
        setCurrentStep("time");
        setSelectedSlot(null);
        break;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "district":
        return "Select District";
      case "establishment":
        return "Select Medical Establishment";
      case "date":
        return "Select Date";
      case "time":
        return "Select Time Slot";
      case "summary":
        return "Confirm Appointment";
      default:
        return "Book Appointment";
    }
  };

  const canNavigateToStep = (stepIndex: number): boolean => {
    const steps = ["district", "establishment", "date", "time", "summary"];
    const currentIndex = steps.indexOf(currentStep);

    // Allow navigation to previous steps or current step
    if (stepIndex <= currentIndex) return true;

    // Allow navigation to next step only if previous requirements are met
    switch (stepIndex) {
      case 1: // establishment
        return selectedDistrict !== null;
      case 2: // date
        return selectedDistrict !== null && selectedEstablishment !== null;
      case 3: // time
        return (
          selectedDistrict !== null &&
          selectedEstablishment !== null &&
          selectedDate !== ""
        );
      case 4: // summary
        return (
          selectedDistrict !== null &&
          selectedEstablishment !== null &&
          selectedDate !== "" &&
          selectedSlot !== null
        );
      default:
        return false;
    }
  };

  const handleStepPress = (stepIndex: number) => {
    const steps = [
      "district",
      "establishment",
      "date",
      "time",
      "summary",
    ] as const;

    if (canNavigateToStep(stepIndex)) {
      const targetStep = steps[stepIndex];
      setCurrentStep(targetStep);

      // Clear subsequent selections when navigating backwards
      if (stepIndex < steps.indexOf(currentStep)) {
        switch (stepIndex) {
          case 0: // district
            setSelectedDistrict(null);
            setSelectedEstablishment(null);
            setSelectedDate("");
            setSelectedSlot(null);
            break;
          case 1: // establishment
            setSelectedEstablishment(null);
            setSelectedDate("");
            setSelectedSlot(null);
            break;
          case 2: // date
            setSelectedDate("");
            setSelectedSlot(null);
            break;
          case 3: // time
            setSelectedSlot(null);
            break;
        }
      }
    }
  };

  const renderStepIndicator = () => {
    const steps = ["district", "establishment", "date", "time", "summary"];
    const stepLabels = ["District", "Hospital", "Date", "Time", "Summary"];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <View style={styles.stepIndicator}>
        <View style={styles.stepContainer}>
          {steps.map((step, index) => (
            <React.Fragment key={step}>
              <TouchableOpacity
                style={styles.stepItem}
                onPress={() => handleStepPress(index)}
                disabled={!canNavigateToStep(index)}
              >
                <View
                  style={[
                    styles.stepCircle,
                    index <= currentIndex
                      ? styles.stepCircleActive
                      : styles.stepCircleInactive,
                    index === currentIndex && styles.stepCircleCurrent,
                    !canNavigateToStep(index) && styles.stepCircleDisabled,
                  ]}
                >
                  {index < currentIndex ? (
                    <Ionicons name="checkmark" size={16} color="white" />
                  ) : (
                    <Text
                      style={[
                        styles.stepNumber,
                        index <= currentIndex
                          ? styles.stepNumberActive
                          : styles.stepNumberInactive,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    index <= currentIndex
                      ? styles.stepLabelActive
                      : styles.stepLabelInactive,
                    index === currentIndex && styles.stepLabelCurrent,
                  ]}
                >
                  {stepLabels[index]}
                </Text>
              </TouchableOpacity>
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    index < currentIndex
                      ? styles.stepLineActive
                      : styles.stepLineInactive,
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>
    );
  };

  const renderDistrictSelection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="location" size={24} color="#DC2626" />
        <Text style={styles.sectionTitle}>Choose your preferred district</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Select the district where you'd like to donate blood. We'll show you
        available hospitals/blood banks in that area.
      </Text>
      <View style={styles.districtGrid}>
        {availableDistricts.map((district) => (
          <TouchableOpacity
            key={district}
            style={[styles.districtCard]}
            onPress={() => handleDistrictSelect(district)}
            activeOpacity={0.7}
          >
            <View style={styles.districtIconContainer}>
              <Ionicons name="location-outline" size={20} color="#DC2626" />
            </View>
            <Text style={styles.districtText}>
              {formatDistrictName(district)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderEstablishmentSelection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="medical" size={24} color="#DC2626" />
        <Text style={styles.sectionTitle}>Select Medical Establishment</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Medical establishments in{" "}
        {selectedDistrict ? formatDistrictName(selectedDistrict) : ""}
      </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>
            Loading medical establishments...
          </Text>
        </View>
      ) : medicalEstablishments.length > 0 ? (
        <View style={styles.establishmentList}>
          {medicalEstablishments.map((establishment) => (
            <TouchableOpacity
              key={establishment.id}
              style={styles.establishmentCard}
              onPress={() => handleEstablishmentSelect(establishment)}
              activeOpacity={0.7}
            >
              <View style={styles.establishmentIconContainer}>
                <Ionicons
                  name={establishment.isBloodBank ? "medical" : "business"}
                  size={24}
                  color="#DC2626"
                />
              </View>
              <View style={styles.establishmentInfo}>
                <Text style={styles.establishmentName}>
                  {establishment.name}
                </Text>
                <Text style={styles.establishmentAddress}>
                  {establishment.address}
                </Text>
                <View style={styles.establishmentMeta}>
                  <View style={styles.capacityBadge}>
                    <Ionicons name="people-outline" size={12} color="#6B7280" />
                    <Text style={styles.capacityText}>
                      Capacity: {establishment.bloodCapacity}
                    </Text>
                  </View>
                  {establishment.isBloodBank && (
                    <View style={styles.bloodBankBadge}>
                      <Text style={styles.bloodBankText}>Blood Bank</Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="medical-outline" size={48} color="#9CA3AF" />
          <Text style={styles.emptyStateTitle}>
            No Medical Establishments Found
          </Text>
          <Text style={styles.emptyStateText}>
            There are no medical establishments available in this district.
          </Text>
        </View>
      )}
    </View>
  );

  const renderDateSelection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="calendar" size={24} color="#DC2626" />
        <Text style={styles.sectionTitle}>Choose Date</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Select your preferred date for the appointment. Available dates are
        shown for the next 7 days.
      </Text>
      <View style={styles.dateGrid}>
        {availableDates.map((dateOption) => (
          <TouchableOpacity
            key={dateOption.date}
            style={[
              styles.dateCard,
              selectedDate === dateOption.date && styles.selectedDateCard,
            ]}
            onPress={() => handleDateSelect(dateOption.date)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.dateIconContainer,
                selectedDate === dateOption.date && {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={16}
                color={selectedDate === dateOption.date ? "white" : "#DC2626"}
              />
            </View>
            <Text
              style={[
                styles.dateText,
                selectedDate === dateOption.date && styles.selectedDateText,
              ]}
            >
              {dateOption.display}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTimeSlotSelection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="time" size={24} color="#DC2626" />
        <Text style={styles.sectionTitle}>Select Time Slot</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Available time slots for{" "}
        {new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
        . Each slot shows the number of available appointments.
      </Text>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Loading available slots...</Text>
        </View>
      ) : availableSlots.length > 0 ? (
        <View style={styles.timeSlotGrid}>
          {availableSlots.map((slot) => (
            <TouchableOpacity
              key={slot.id}
              style={[
                styles.timeSlotCard,
                selectedSlot?.id === slot.id && styles.selectedTimeSlotCard,
              ]}
              onPress={() => handleSlotSelect(slot)}
              activeOpacity={0.7}
            >
              <View style={styles.timeSlotIconContainer}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={selectedSlot?.id === slot.id ? "white" : "#DC2626"}
                />
              </View>
              <Text
                style={[
                  styles.slotTimeText,
                  selectedSlot?.id === slot.id && styles.selectedTimeText,
                ]}
              >
                {slot.startTime} - {slot.endTime}
              </Text>
              <View
                style={[
                  styles.tokenBadge,
                  selectedSlot?.id === slot.id && styles.selectedTokenBadge,
                ]}
              >
                <Text
                  style={[
                    styles.tokenText,
                    selectedSlot?.id === slot.id && styles.selectedTokenText,
                  ]}
                >
                  {(slot.tokenNumber || slot.donorsPerSlot || 0)} slots available
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noSlotsContainer}>
          <Ionicons name="time-outline" size={48} color="#9CA3AF" />
          <Text style={styles.noSlotsText}>No available slots</Text>
          <Text style={styles.noSlotsSubtext}>
            Please try selecting a different date
          </Text>
        </View>
      )}
    </View>
  );

  const renderSummary = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="checkmark-circle" size={24} color="#DC2626" />
        <Text style={styles.sectionTitle}>Appointment Summary</Text>
      </View>
      <Text style={styles.sectionSubtitle}>
        Please review your appointment details before confirming.
      </Text>

      <View style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Ionicons name="location" size={20} color="#DC2626" />
          <Text style={styles.summaryLabel}>District:</Text>
          <Text style={styles.summaryValue}>
            {selectedDistrict ? formatDistrictName(selectedDistrict) : ""}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="medical" size={20} color="#DC2626" />
          <Text style={styles.summaryLabel}>Place:</Text>
          <Text style={styles.summaryValue}>{selectedEstablishment?.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="calendar" size={20} color="#DC2626" />
          <Text style={styles.summaryLabel}>Date:</Text>
          <Text style={styles.summaryValue}>
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Ionicons name="time" size={20} color="#DC2626" />
          <Text style={styles.summaryLabel}>Time:</Text>
          <Text style={styles.summaryValue}>
            {selectedSlot?.startTime} - {selectedSlot?.endTime}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.bookButton, loading && styles.bookButtonDisabled]}
        onPress={handleBookAppointment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="white" />
            <Text style={styles.buttonText}>Confirm Appointment</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={currentStep === "district" ? onClose : goBack}
        >
          <Ionicons
            name={currentStep === "district" ? "close" : "arrow-back"}
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getStepTitle()}</Text>
        <View style={{ width: 24 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <NoticeCard
          title="Important Notice"
          message="This appointment is purely for blood donation purposes and not for health checkups, medical consultations, or any other medical activities."
          type="warning"
        />

        <View style={styles.formContainer}>
          {currentStep === "district" && renderDistrictSelection()}
          {currentStep === "establishment" && renderEstablishmentSelection()}
          {currentStep === "date" && renderDateSelection()}
          {currentStep === "time" && renderTimeSlotSelection()}
          {currentStep === "summary" && renderSummary()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  stepIndicator: {
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  stepItem: {
    alignItems: "center",
    minWidth: 50,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stepCircleActive: {
    backgroundColor: "#DC2626",
  },
  stepCircleInactive: {
    backgroundColor: "#E5E7EB",
  },
  stepCircleCurrent: {
    backgroundColor: "#DC2626",
    transform: [{ scale: 1.1 }],
  },
  stepCircleDisabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "700",
  },
  stepNumberActive: {
    color: "white",
  },
  stepNumberInactive: {
    color: "#9CA3AF",
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#DC2626",
  },
  stepLabelInactive: {
    color: "#9CA3AF",
  },
  stepLabelCurrent: {
    color: "#DC2626",
    fontWeight: "700",
  },
  stepLine: {
    width: 30,
    height: 2,
    marginHorizontal: 6,
    marginBottom: 20,
  },
  stepLineActive: {
    backgroundColor: "#DC2626",
  },
  stepLineInactive: {
    backgroundColor: "#E5E7EB",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 20,
  },
  // District Selection Styles
  districtGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  districtCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    minHeight: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  districtIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  districtText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  // Establishment Selection Styles
  establishmentList: {
    gap: 12,
  },
  establishmentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  establishmentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  establishmentInfo: {
    flex: 1,
  },
  establishmentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  establishmentAddress: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
  },
  establishmentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  capacityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  capacityText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  bloodBankBadge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bloodBankText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  // Date Selection Styles
  dateGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  dateCard: {
    width: "30%",
    maxWidth: 100,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    minHeight: 70,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedDateCard: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
    transform: [{ scale: 1.02 }],
  },
  dateIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  dateText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    lineHeight: 14,
  },
  selectedDateText: {
    color: "white",
  },
  // Time Slot Selection Styles
  timeSlotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  timeSlotCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    minHeight: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTimeSlotCard: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
    transform: [{ scale: 1.02 }],
  },
  timeSlotIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  slotTimeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },
  selectedTimeText: {
    color: "white",
  },
  tokenBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedTokenBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  tokenText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  selectedTokenText: {
    color: "white",
  },
  // Loading and Empty States
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  loadingText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  noSlotsContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  noSlotsText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 16,
    marginBottom: 8,
  },
  noSlotsSubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  // Summary Section
  summarySection: {
    marginTop: 32,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    minWidth: 80,
  },
  summaryValue: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
    fontWeight: "500",
  },
  bookButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  // Legacy styles (keeping for compatibility)
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  selectedCard: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    marginTop: 8,
  },
  selectedText: {
    color: "white",
  },
  slotTokenText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
});
