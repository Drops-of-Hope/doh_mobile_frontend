import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { campaignService } from "../../services/campaignService";
import { appointmentService, MedicalEstablishment } from "../../services/appointmentService";
import { District } from "../../../constants/districts";
import { getDatabaseUserId } from "../../utils/userIdUtils";

// Import refactored components
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";
import FormSection from "./molecules/FormSection";
import InputField from "./atoms/InputField";
import DropdownField from "./atoms/DropdownField";
import DateSelector from "./atoms/DateSelector";
import SubmitButton from "./atoms/SubmitButton";

// Import types
import { CreateCampaignScreenProps, LocalCampaignForm, FormErrors } from "./types";

export default function CreateCampaignScreen({
  navigation,
}: CreateCampaignScreenProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingEstablishments, setLoadingEstablishments] = useState(true);
  const [medicalEstablishments, setMedicalEstablishments] = useState<MedicalEstablishment[]>([]);
  const [formData, setFormData] = useState<LocalCampaignForm>({
    title: "",
    type: "",
    description: "",
    motivation: "",
    location: "",
    day: "",
    month: "",
    year: "",
    startTime: "",
    endTime: "",
    expectedDonors: "",
    contactPersonName: user?.name || "",
    contactPersonPhone: "",
    medicalEstablishmentId: "",
    requirements: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Load medical establishments on component mount
  useEffect(() => {
    loadMedicalEstablishments();
  }, []);

  const loadMedicalEstablishments = async () => {
    try {
      setLoadingEstablishments(true);
      console.log("Loading medical establishments...");
      let allEstablishments: MedicalEstablishment[] = [];
      
      // Try to load from API first
      try {
        const establishments = await appointmentService.getMedicalEstablishmentsByDistrict(District.COLOMBO);
        console.log("Loaded establishments from API:", establishments);
        allEstablishments = establishments;
      } catch (apiError) {
        console.log("API call failed, trying to load all establishments...");
        
        // Try different districts
        const districts = [District.COLOMBO, District.KANDY, District.GALLE, District.GAMPAHA];
        
        for (const district of districts) {
          try {
            const establishments = await appointmentService.getMedicalEstablishmentsByDistrict(district);
            allEstablishments.push(...establishments);
          } catch (districtError) {
            console.log(`Failed to load from ${district}:`, districtError);
          }
        }
      }
      
      // If we got some establishments, use them
      if (allEstablishments.length > 0) {
        console.log("Successfully loaded establishments:", allEstablishments.length);
        setMedicalEstablishments(allEstablishments);
        return;
      }
      
      // Fallback to mock data if no establishments loaded
      console.log("Using fallback medical establishments");
      const fallbackEstablishments: MedicalEstablishment[] = [
        { 
          id: "establishment-1", 
          name: "Central Hospital Colombo", 
          address: "Colombo 08", 
          region: "Western", 
          email: "central@hospital.lk", 
          bloodCapacity: 100, 
          isBloodBank: true 
        },
        { 
          id: "establishment-2", 
          name: "Kandy General Hospital", 
          address: "Kandy", 
          region: "Central", 
          email: "kandy@hospital.lk", 
          bloodCapacity: 80, 
          isBloodBank: true 
        },
        { 
          id: "establishment-3", 
          name: "Galle Teaching Hospital", 
          address: "Galle", 
          region: "Southern", 
          email: "galle@hospital.lk", 
          bloodCapacity: 60, 
          isBloodBank: true 
        },
        { 
          id: "establishment-4", 
          name: "Negombo Base Hospital", 
          address: "Negombo", 
          region: "Western", 
          email: "negombo@hospital.lk", 
          bloodCapacity: 40, 
          isBloodBank: true 
        },
        { 
          id: "establishment-5", 
          name: "Matara General Hospital", 
          address: "Matara", 
          region: "Southern", 
          email: "matara@hospital.lk", 
          bloodCapacity: 50, 
          isBloodBank: true 
        },
      ];
      
      setMedicalEstablishments(fallbackEstablishments);
    } catch (error) {
      console.error("Failed to load medical establishments:", error);
      
      // Even if everything fails, provide some basic options
      setMedicalEstablishments([
        { 
          id: "default-1", 
          name: "Central Hospital", 
          address: "Colombo", 
          region: "Western", 
          email: "central@hospital.lk", 
          bloodCapacity: 100, 
          isBloodBank: true 
        },
      ]);
    } finally {
      setLoadingEstablishments(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Basic required field validation
    if (!formData.title.trim()) {
      newErrors.title = "Campaign title is required";
    }

    if (!formData.type) {
      newErrors.type = "Campaign type is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = "Motivation is required";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.medicalEstablishmentId) {
      newErrors.medicalEstablishmentId = "Medical establishment is required";
    }

    // Date validation
    if (!formData.day || !formData.month || !formData.year) {
      newErrors.day = "Please select a complete date";
    } else {
      const selectedDate = new Date(
        parseInt(formData.year),
        parseInt(formData.month) - 1,
        parseInt(formData.day)
      );
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 28); // 4 weeks ahead

      if (selectedDate < minDate) {
        newErrors.day = "Date must be at least 4 weeks from today";
      }
    }

    // Time validation (24-hour format)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    
    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    } else if (!timeRegex.test(formData.startTime)) {
      newErrors.startTime = "Use 24-hour format (HH:MM)";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (!timeRegex.test(formData.endTime)) {
      newErrors.endTime = "Use 24-hour format (HH:MM)";
    }

    // Check if end time is after start time
    if (formData.startTime && formData.endTime && timeRegex.test(formData.startTime) && timeRegex.test(formData.endTime)) {
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      if (endMinutes <= startMinutes) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (!formData.expectedDonors || isNaN(Number(formData.expectedDonors)) || Number(formData.expectedDonors) <= 0) {
      newErrors.expectedDonors = "Please enter a valid expected donors count";
    }

    if (!formData.contactPersonName.trim()) {
      newErrors.contactPersonName = "Contact person name is required";
    }

    // Phone validation: exactly 10 digits starting with 0
    if (!formData.contactPersonPhone.trim()) {
      newErrors.contactPersonPhone = "Contact phone is required";
    } else if (!/^0[0-9]{9}$/.test(formData.contactPersonPhone)) {
      newErrors.contactPersonPhone = "Phone must be 10 digits starting with 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the actual database user ID
      const databaseUserId = await getDatabaseUserId();
      
      if (!databaseUserId) {
        Alert.alert("Error", "Unable to identify user. Please log in again.");
        return;
      }

      console.log('Creating campaign with database user ID:', databaseUserId);
      console.log('Auth sub was:', user?.sub);

      // Create proper date objects for startTime and endTime
      const campaignDate = new Date(
        parseInt(formData.year),
        parseInt(formData.month) - 1,
        parseInt(formData.day)
      );

      // Parse time and create proper datetime objects
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      
      const startDateTime = new Date(campaignDate);
      startDateTime.setHours(startHour, startMin, 0, 0);
      
      const endDateTime = new Date(campaignDate);
      endDateTime.setHours(endHour, endMin, 0, 0);
      
      const campaignData = {
        title: formData.title.trim(),
        type: formData.type as "MOBILE" | "FIXED",
        description: formData.description.trim(),
        motivation: formData.motivation.trim(),
        location: formData.location.trim(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        expectedDonors: Number(formData.expectedDonors),
        contactPersonName: formData.contactPersonName.trim(),
        contactPersonPhone: formData.contactPersonPhone.trim(),
        medicalEstablishmentId: formData.medicalEstablishmentId,
        organizerId: databaseUserId, // Use database user ID instead of auth sub
        isApproved: false,
        requirements: formData.requirements ? JSON.parse(`{"notes": "${formData.requirements.trim()}"}`) : {},
      };

      console.log('Campaign data being sent:', campaignData);

      await campaignService.createCampaign(campaignData);
      Alert.alert("Success", "Campaign created successfully", [
        { text: "OK", onPress: () => navigation?.goBack() },
      ]);
    } catch (error) {
      console.error("Failed to create campaign:", error);
      Alert.alert("Error", "Failed to create campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof LocalCampaignForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBack = () => navigation?.goBack();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <DashboardHeader
        title={t("campaign.create_title")}
        onBack={handleBack}
        onAdd={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <FormSection title="Campaign Information">
          <InputField
            label="Campaign Title"
            value={formData.title}
            onChangeText={(text) => updateFormData("title", text)}
            placeholder="Enter campaign title"
            error={errors.title}
            required
          />
          
          <DropdownField
            label="Campaign Type"
            value={formData.type}
            onValueChange={(value) => updateFormData("type", value)}
            options={[
              { label: "Fixed Location", value: "FIXED" },
              { label: "Mobile Campaign", value: "MOBILE" },
            ]}
            placeholder="Select campaign type"
            error={errors.type}
            required
          />
          
          <InputField
            label="Motivation"
            value={formData.motivation}
            onChangeText={(text) => updateFormData("motivation", text)}
            placeholder="Why is this campaign important?"
            multiline
            maxLength={255}
            error={errors.motivation}
            required
          />
          
          <InputField
            label="Description"
            value={formData.description}
            onChangeText={(text) => updateFormData("description", text)}
            placeholder="Describe the campaign"
            multiline
            maxLength={255}
            error={errors.description}
            required
          />
        </FormSection>

        <FormSection title="Location & Schedule">
          <InputField
            label="Location Name"
            value={formData.location}
            onChangeText={(text) => updateFormData("location", text)}
            placeholder="e.g., City Hospital"
            error={errors.location}
            required
          />
          <DropdownField
            label="Medical Establishment"
            value={formData.medicalEstablishmentId}
            onValueChange={(value) => updateFormData("medicalEstablishmentId", value)}
            options={medicalEstablishments.map(est => ({
              label: `${est.name} - ${est.address}`,
              value: est.id
            }))}
            placeholder={loadingEstablishments ? "Loading establishments..." : "Select medical establishment"}
            error={errors.medicalEstablishmentId}
            required
          />
          
          <DateSelector
            day={formData.day}
            month={formData.month}
            year={formData.year}
            onDayChange={(value) => updateFormData("day", value)}
            onMonthChange={(value) => updateFormData("month", value)}
            onYearChange={(value) => updateFormData("year", value)}
            error={errors.day}
          />
          
          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <InputField
                label="Start Time"
                value={formData.startTime}
                onChangeText={(text) => updateFormData("startTime", text)}
                placeholder="08:00"
                error={errors.startTime}
                required
              />
            </View>
            <View style={styles.timeInput}>
              <InputField
                label="End Time"
                value={formData.endTime}
                onChangeText={(text) => updateFormData("endTime", text)}
                placeholder="17:00"
                error={errors.endTime}
                required
              />
            </View>
          </View>
        </FormSection>

        <FormSection title="Goals & Contact">
          <InputField
            label="Expected Donors"
            value={formData.expectedDonors}
            onChangeText={(text) => updateFormData("expectedDonors", text)}
            placeholder="Number of donors expected"
            keyboardType="numeric"
            error={errors.expectedDonors}
            required
          />
          <InputField
            label="Contact Person Name"
            value={formData.contactPersonName}
            onChangeText={(text) => updateFormData("contactPersonName", text)}
            placeholder="Contact person name"
            error={errors.contactPersonName}
            required
          />
          <InputField
            label="Contact Phone"
            value={formData.contactPersonPhone}
            onChangeText={(text) => updateFormData("contactPersonPhone", text)}
            placeholder="0712345678"
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.contactPersonPhone}
            required
          />
          
          <InputField
            label="Requirements"
            value={formData.requirements}
            onChangeText={(text) => updateFormData("requirements", text)}
            placeholder="Special requirements (optional)"
            multiline
            error={errors.requirements}
          />
        </FormSection>

        <SubmitButton
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          title="Create Campaign"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
});
