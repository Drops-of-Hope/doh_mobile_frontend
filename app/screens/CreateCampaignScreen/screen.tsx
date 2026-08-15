import React, { useState, useEffect } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { campaignService } from "../../services/campaignService";
import { appointmentService, MedicalEstablishment } from "../../services/appointmentService";
import { District } from "../../../constants/districts";
import { getDatabaseUserId } from "../../utils/userIdUtils";

import { Screen, AppBar, Field, Select, Stepper, TimeField, Button, Text } from "../../design";

// Import refactored components
import FormSection from "./molecules/FormSection";
import DateSelector from "./atoms/DateSelector";

// Import types
import { CreateCampaignScreenProps, LocalCampaignForm, FormErrors } from "./types";

import { logger } from "../../utils/logger";
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
      let allEstablishments: MedicalEstablishment[] = [];

      // Try to load from API first
      try {
        const establishments = await appointmentService.getMedicalEstablishmentsByDistrict(District.COLOMBO);
        allEstablishments = establishments;
      } catch (apiError) {
        // Try different districts
        const districts = [District.COLOMBO, District.KANDY, District.GALLE, District.GAMPAHA];

        for (const district of districts) {
          try {
            const establishments = await appointmentService.getMedicalEstablishmentsByDistrict(district);
            allEstablishments.push(...establishments);
          } catch (districtError) {
            // Ignore and continue trying other districts
          }
        }
      }

      // If we got some establishments, use them
      if (allEstablishments.length > 0) {
        setMedicalEstablishments(allEstablishments);
        return;
      }

      // No establishments found
      setMedicalEstablishments([]);
    } catch (error) {
      logger.error("Failed to load medical establishments:", error);
      // Set empty array on error
      setMedicalEstablishments([]);
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

    // Time validation (24-hour format HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    } else if (!timeRegex.test(formData.startTime)) {
      newErrors.startTime = "Invalid time format (HH:mm expected)";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    } else if (!timeRegex.test(formData.endTime)) {
      newErrors.endTime = "Invalid time format (HH:mm expected)";
    }

    // Check if end time is after start time (at least 1 hour difference)
    if (formData.startTime && formData.endTime && timeRegex.test(formData.startTime) && timeRegex.test(formData.endTime)) {
      const [startHour, startMin] = formData.startTime.split(':').map(Number);
      const [endHour, endMin] = formData.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (endMinutes <= startMinutes) {
        newErrors.endTime = "End time must be after start time";
      } else if (endMinutes - startMinutes < 60) {
        newErrors.endTime = "Campaign must be at least 1 hour long";
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

      // Create date string in YYYY-MM-DD format
      const dateStr = `${formData.year}-${formData.month.padStart(2, '0')}-${formData.day.padStart(2, '0')}`;

      // Combine date and time without timezone conversion
      // Store as ISO string but in local time (no UTC conversion)
      const startDateTime = `${dateStr}T${formData.startTime}:00`;
      const endDateTime = `${dateStr}T${formData.endTime}:00`;

      const campaignData = {
        title: formData.title.trim(),
        type: formData.type as "MOBILE" | "FIXED",
        description: formData.description.trim(),
        motivation: formData.motivation.trim(),
        location: formData.location.trim(),
        startTime: startDateTime,
        endTime: endDateTime,
        expectedDonors: Number(formData.expectedDonors),
        contactPersonName: formData.contactPersonName.trim(),
        contactPersonPhone: formData.contactPersonPhone.trim(),
        medicalEstablishmentId: formData.medicalEstablishmentId,
        organizerId: databaseUserId, // Use database user ID instead of auth sub
        isApproved: false,
        requirements: formData.requirements ? { notes: formData.requirements.trim() } : {},
      };

      await campaignService.createCampaign(campaignData);

      Alert.alert(
        "✅ Campaign Submitted Successfully",
        "The blood bank will review your form and get back to you shortly.",
        [
          {
            text: "OK",
            onPress: () => navigation?.goBack(),
            style: "default"
          },
        ]
      );
    } catch (error) {
      logger.error("Failed to create campaign:", error);
      Alert.alert(
        "❌ Error",
        "Failed to create campaign. Please try again.",
        [{ text: "OK", style: "default" }]
      );
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
    <Screen keyboardAvoiding scroll edges={["top", "bottom"]}>
      <AppBar title={t("campaign.create_title")} onBack={handleBack} />

      <View style={styles.content}>
        <FormSection title="Campaign Information">
          <Field
            label="Campaign Title"
            value={formData.title}
            onChangeText={(text) => updateFormData("title", text)}
            placeholder="Enter campaign title"
            error={errors.title}
            required
          />

          <Select
            label="Campaign Type"
            value={formData.type}
            onChange={(value) => updateFormData("type", value)}
            options={[
              { label: "Fixed Location", value: "FIXED" },
              { label: "Mobile Campaign", value: "MOBILE" },
            ]}
            placeholder="Select campaign type"
            error={errors.type}
            required
          />

          <Field
            label="Motivation"
            value={formData.motivation}
            onChangeText={(text) => updateFormData("motivation", text)}
            placeholder="Why is this campaign important?"
            multiline
            maxLength={255}
            error={errors.motivation}
            required
          />

          <Field
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
          <Field
            label="Location Name"
            value={formData.location}
            onChangeText={(text) => updateFormData("location", text)}
            placeholder="e.g., City Hospital"
            error={errors.location}
            required
          />
          <Select
            label="Medical Establishment"
            value={formData.medicalEstablishmentId}
            onChange={(value) => updateFormData("medicalEstablishmentId", value)}
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
              <TimeField
                label="Start Time"
                value={formData.startTime}
                onChange={(time) => updateFormData("startTime", time)}
                error={errors.startTime}
                required
              />
            </View>
            <View style={styles.timeInput}>
              <TimeField
                label="End Time"
                value={formData.endTime}
                onChange={(time) => updateFormData("endTime", time)}
                error={errors.endTime}
                required
              />
            </View>
          </View>
        </FormSection>

        <FormSection title="Goals & Contact">
          <Stepper
            label="Expected Donors"
            value={Number(formData.expectedDonors) || 1}
            onChange={(value) => updateFormData("expectedDonors", value.toString())}
            min={1}
            max={9999}
            step={1}
            required
          />
          {errors.expectedDonors ? (
            <Text variant="caption" tone="danger" style={styles.stepperError}>
              {errors.expectedDonors}
            </Text>
          ) : null}
          <Field
            label="Contact Person Name"
            value={formData.contactPersonName}
            onChangeText={(text) => updateFormData("contactPersonName", text)}
            placeholder="Contact person name"
            error={errors.contactPersonName}
            required
          />
          <Field
            label="Contact Phone"
            value={formData.contactPersonPhone}
            onChangeText={(text) => updateFormData("contactPersonPhone", text)}
            placeholder="0712345678"
            keyboardType="phone-pad"
            maxLength={10}
            error={errors.contactPersonPhone}
            required
          />

          <Field
            label="Requirements"
            value={formData.requirements}
            onChangeText={(text) => updateFormData("requirements", text)}
            placeholder="Special requirements (optional)"
            multiline
            error={errors.requirements}
          />
        </FormSection>

        <Button
          title="Create Campaign"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  stepperError: {
    marginTop: -10,
    marginBottom: 16,
    marginLeft: 2,
  },
});
