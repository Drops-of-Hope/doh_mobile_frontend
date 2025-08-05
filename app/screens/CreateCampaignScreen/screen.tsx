import React, { useState } from "react";
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

// Import refactored components
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";
import FormSection from "./molecules/FormSection";
import InputField from "./atoms/InputField";
import SubmitButton from "./atoms/SubmitButton";

// Import types
import { CreateCampaignScreenProps, LocalCampaignForm } from "./types";

export default function CreateCampaignScreen({
  navigation,
}: CreateCampaignScreenProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LocalCampaignForm>({
    title: "",
    description: "",
    location: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    donationGoal: "",
    contactPerson: user?.name || "",
    contactPhone: "",
    contactEmail: user?.email || "",
    requirements: "",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState<Partial<LocalCampaignForm>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LocalCampaignForm> = {};
    const requiredFields = [
      "title",
      "description",
      "location",
      "address",
      "date",
      "startTime",
      "endTime",
      "donationGoal",
      "contactPerson",
      "contactPhone",
      "contactEmail",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof LocalCampaignForm].trim()) {
        newErrors[field as keyof LocalCampaignForm] = `${field} is required`;
      }
    });

    if (
      formData.donationGoal &&
      (isNaN(Number(formData.donationGoal)) ||
        Number(formData.donationGoal) <= 0)
    ) {
      newErrors.donationGoal = "Please enter a valid donation goal";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const campaignData = {
        ...formData,
        donationGoal: Number(formData.donationGoal),
        organizerId: user?.sub || "",
      };

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
          <InputField
            label="Description"
            value={formData.description}
            onChangeText={(text) => updateFormData("description", text)}
            placeholder="Describe the campaign"
            multiline
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
          <InputField
            label="Full Address"
            value={formData.address}
            onChangeText={(text) => updateFormData("address", text)}
            placeholder="Enter complete address"
            multiline
            error={errors.address}
            required
          />
          <InputField
            label="Date"
            value={formData.date}
            onChangeText={(text) => updateFormData("date", text)}
            placeholder="YYYY-MM-DD"
            error={errors.date}
            required
          />
          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <InputField
                label="Start Time"
                value={formData.startTime}
                onChangeText={(text) => updateFormData("startTime", text)}
                placeholder="09:00 AM"
                error={errors.startTime}
                required
              />
            </View>
            <View style={styles.timeInput}>
              <InputField
                label="End Time"
                value={formData.endTime}
                onChangeText={(text) => updateFormData("endTime", text)}
                placeholder="05:00 PM"
                error={errors.endTime}
                required
              />
            </View>
          </View>
        </FormSection>

        <FormSection title="Goals & Contact">
          <InputField
            label="Donation Goal"
            value={formData.donationGoal}
            onChangeText={(text) => updateFormData("donationGoal", text)}
            placeholder="Number of donations expected"
            keyboardType="numeric"
            error={errors.donationGoal}
            required
          />
          <InputField
            label="Contact Person"
            value={formData.contactPerson}
            onChangeText={(text) => updateFormData("contactPerson", text)}
            placeholder="Contact person name"
            error={errors.contactPerson}
            required
          />
          <InputField
            label="Contact Phone"
            value={formData.contactPhone}
            onChangeText={(text) => updateFormData("contactPhone", text)}
            placeholder="Contact phone number"
            keyboardType="phone-pad"
            error={errors.contactPhone}
            required
          />
          <InputField
            label="Contact Email"
            value={formData.contactEmail}
            onChangeText={(text) => updateFormData("contactEmail", text)}
            placeholder="Contact email address"
            keyboardType="email-address"
            error={errors.contactEmail}
            required
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
