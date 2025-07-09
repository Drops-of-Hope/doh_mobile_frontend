import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { campaignService } from "../services/campaignService";

interface LocalCampaignForm {
  title: string;
  description: string;
  location: string;
  address: string;
  date: string;
  startTime: string;
  endTime: string;
  donationGoal: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  requirements: string;
  additionalNotes: string;
}

const CreateCampaignScreen: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
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

    if (!formData.title.trim()) {
      newErrors.title = "Campaign title is required";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.date.trim()) {
      newErrors.date = "Date is required";
    }
    if (!formData.startTime.trim()) {
      newErrors.startTime = "Start time is required";
    }
    if (!formData.endTime.trim()) {
      newErrors.endTime = "End time is required";
    }
    if (!formData.donationGoal.trim()) {
      newErrors.donationGoal = "Donation goal is required";
    } else if (
      isNaN(Number(formData.donationGoal)) ||
      Number(formData.donationGoal) <= 0
    ) {
      newErrors.donationGoal = "Please enter a valid donation goal";
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }
    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        t("campaign.validation_error"),
        t("campaign.fill_required_fields")
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Map form data to service format
      const campaignData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        address: formData.address,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        donationGoal: Number(formData.donationGoal),
        contactPerson: formData.contactPerson,
        contactPhone: formData.contactPhone,
        contactEmail: formData.contactEmail,
        requirements: formData.requirements,
        additionalNotes: formData.additionalNotes,
        organizerId: user?.sub || "",
      };

      console.log("Creating campaign:", campaignData);

      const createdCampaign = await campaignService.createCampaign(
        campaignData
      );

      Alert.alert(
        t("campaign.campaign_submitted"),
        t("campaign.campaign_submitted_msg"),
        [
          {
            text: t("common.ok"),
            onPress: () => navigation?.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error("Failed to create campaign:", error);
      Alert.alert(t("common.error"), t("campaign.submit_error"));
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

  const InputField: React.FC<{
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    multiline?: boolean;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
    error?: string;
    required?: boolean;
  }> = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline,
    keyboardType,
    error,
    required,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <TextInput
        style={[
          styles.textInput,
          multiline && styles.textArea,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType || "default"}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t("campaign.create_title")}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>{t("campaign.campaign_info")}</Text>

          <InputField
            label={t("campaign.campaign_title")}
            value={formData.title}
            onChangeText={(text) => updateFormData("title", text)}
            placeholder="Enter campaign title"
            error={errors.title}
            required
          />

          <InputField
            label={t("campaign.description")}
            value={formData.description}
            onChangeText={(text) => updateFormData("description", text)}
            placeholder="Describe the purpose and goals of your campaign"
            multiline
            error={errors.description}
            required
          />

          <Text style={styles.sectionTitle}>
            {t("campaign.location_schedule")}
          </Text>

          <InputField
            label={t("campaign.location_name")}
            value={formData.location}
            onChangeText={(text) => updateFormData("location", text)}
            placeholder="e.g., City Hospital, Community Center"
            error={errors.location}
            required
          />

          <InputField
            label={t("campaign.full_address")}
            value={formData.address}
            onChangeText={(text) => updateFormData("address", text)}
            placeholder="Enter complete address"
            multiline
            error={errors.address}
            required
          />

          <InputField
            label={t("campaign.date")}
            value={formData.date}
            onChangeText={(text) => updateFormData("date", text)}
            placeholder="YYYY-MM-DD"
            error={errors.date}
            required
          />

          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <InputField
                label={t("campaign.start_time")}
                value={formData.startTime}
                onChangeText={(text) => updateFormData("startTime", text)}
                placeholder="09:00 AM"
                error={errors.startTime}
                required
              />
            </View>
            <View style={styles.timeInput}>
              <InputField
                label={t("campaign.end_time")}
                value={formData.endTime}
                onChangeText={(text) => updateFormData("endTime", text)}
                placeholder="05:00 PM"
                error={errors.endTime}
                required
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {t("campaign.goals_requirements")}
          </Text>

          <InputField
            label={t("campaign.donation_goal")}
            value={formData.donationGoal}
            onChangeText={(text) => updateFormData("donationGoal", text)}
            placeholder="Number of donations expected"
            keyboardType="numeric"
            error={errors.donationGoal}
            required
          />

          <InputField
            label={t("campaign.special_requirements")}
            value={formData.requirements}
            onChangeText={(text) => updateFormData("requirements", text)}
            placeholder="Any specific requirements (optional)"
            multiline
            error={errors.requirements}
          />

          <Text style={styles.sectionTitle}>{t("campaign.contact_info")}</Text>

          <InputField
            label={t("campaign.contact_person")}
            value={formData.contactPerson}
            onChangeText={(text) => updateFormData("contactPerson", text)}
            placeholder="Primary contact person"
            error={errors.contactPerson}
            required
          />

          <InputField
            label={t("campaign.contact_phone")}
            value={formData.contactPhone}
            onChangeText={(text) => updateFormData("contactPhone", text)}
            placeholder="Phone number"
            keyboardType="phone-pad"
            error={errors.contactPhone}
            required
          />

          <InputField
            label={t("campaign.contact_email")}
            value={formData.contactEmail}
            onChangeText={(text) => updateFormData("contactEmail", text)}
            placeholder="Email address"
            keyboardType="email-address"
            error={errors.contactEmail}
            required
          />

          <InputField
            label={t("campaign.additional_notes")}
            value={formData.additionalNotes}
            onChangeText={(text) => updateFormData("additionalNotes", text)}
            placeholder="Any additional information (optional)"
            multiline
            error={errors.additionalNotes}
          />

          <View style={styles.submitSection}>
            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#3B82F6"
              />
              <Text style={styles.infoText}>{t("campaign.approval_info")}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Text style={styles.submitButtonText}>
                  {t("campaign.submitting")}
                </Text>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#FFFFFF"
                  />
                  <Text style={styles.submitButtonText}>
                    {t("campaign.submit_for_approval")}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  form: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 24,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  timeRow: {
    flexDirection: "row",
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  submitSection: {
    marginTop: 32,
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1E40AF",
    marginLeft: 8,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: "#FF4757",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#94A3B8",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateCampaignScreen;
