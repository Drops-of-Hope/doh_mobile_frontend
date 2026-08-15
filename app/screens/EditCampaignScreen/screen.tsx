import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { campaignService } from "../../services/campaignService";

import { Screen, AppBar, Field, Button, Text, useTheme } from "../../design";

import { logger } from "../../utils/logger";
interface EditCampaignScreenProps {
  navigation?: any;
  route?: {
    params: {
      campaignId: string;
    };
  };
}

interface Campaign {
  id: string;
  title: string;
  description: string;
  location: string;
  address?: string;
  date?: string;
  startTime: string;
  endTime: string;
  donationGoal?: number;
  contactPerson?: string;
  contactPhone?: string;
  contactEmail?: string;
  requirements?: string;
  additionalNotes?: string;
}

interface FormData {
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

export default function EditCampaignScreen({
  navigation,
  route,
}: EditCampaignScreenProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const theme = useTheme();
  const { campaignId } = route?.params || {};

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    address: "",
    date: "",
    startTime: "",
    endTime: "",
    donationGoal: "",
    contactPerson: "",
    contactPhone: "",
    contactEmail: "",
    requirements: "",
    additionalNotes: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId]);

  const loadCampaign = async () => {
    if (!campaignId) return;

    try {
      setIsLoading(true);

      // Load campaign details
      const campaignData = await campaignService.getCampaignDetails(campaignId);
      setCampaign(campaignData);

      // Check permissions
      const permissions = await campaignService.checkCampaignPermissions(campaignId);
      setCanEdit(permissions.canEdit);

      // Extract time from ISO string without timezone conversion
      const extractTime = (isoString: string) => {
        if (!isoString) return "";
        // Extract "HH:MM" from "2025-07-05T09:30:00" or "2025-07-05T09:30:00.000Z"
        return isoString.split('T')[1]?.substring(0, 5) || "";
      };

      // Populate form with campaign data
      setFormData({
        title: campaignData.title || "",
        description: campaignData.description || "",
        location: campaignData.location || "",
        address: campaignData.address || "",
        date: campaignData.date ? new Date(campaignData.date).toISOString().split('T')[0] : "",
        startTime: extractTime(campaignData.startTime || ""),
        endTime: extractTime(campaignData.endTime || ""),
        donationGoal: campaignData.donationGoal?.toString() || "",
        contactPerson: campaignData.contactPerson || "",
        contactPhone: campaignData.contactPhone || "",
        contactEmail: campaignData.contactEmail || "",
        requirements: campaignData.requirements || "",
        additionalNotes: campaignData.additionalNotes || "",
      });

      if (!permissions.canEdit) {
        Alert.alert(
          "Cannot Edit",
          permissions.reasons.join(", ") || "This campaign cannot be edited.",
          [{ text: "OK", onPress: () => navigation?.goBack() }]
        );
      }
    } catch (error) {
      logger.error("Failed to load campaign:", error);

      // Handle specific error cases
      let errorMessage = "Failed to load campaign details.";
      let errorTitle = "Error";

      if (error && typeof error === 'object' && 'message' in error) {
        const errorMsg = error.message as string;
        if (errorMsg.includes('not found')) {
          errorTitle = "Campaign Not Found";
          errorMessage = "The campaign you're trying to edit could not be found. It may have been deleted or you may not have permission to access it.";
        } else if (errorMsg.includes('permissions')) {
          errorTitle = "Permission Error";
          errorMessage = "You don't have permission to edit this campaign.";
        }
      }

      Alert.alert(errorTitle, errorMessage, [
        { text: "OK", onPress: () => navigation?.goBack() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

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

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = "Start time is required";
    }

    if (!formData.endTime) {
      newErrors.endTime = "End time is required";
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = "End time must be after start time";
    }

    if (!formData.donationGoal || parseInt(formData.donationGoal) <= 0) {
      newErrors.donationGoal = "Donation goal must be greater than 0";
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }

    if (!formData.contactPhone.trim()) {
      newErrors.contactPhone = "Contact phone is required";
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = "Contact email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm() || !campaignId || !canEdit) return;

    try {
      setIsSaving(true);

      const updateData = {
        id: campaignId,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        donationGoal: parseInt(formData.donationGoal),
        contactPerson: formData.contactPerson.trim(),
        contactPhone: formData.contactPhone.trim(),
        contactEmail: formData.contactEmail.trim(),
        requirements: formData.requirements.trim(),
        additionalNotes: formData.additionalNotes.trim(),
      };

      await campaignService.updateCampaign(campaignId, updateData);

      Alert.alert(
        "Success",
        "Campaign updated successfully!",
        [{ text: "OK", onPress: () => navigation?.goBack() }]
      );
    } catch (error: any) {
      logger.error("Failed to update campaign:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update campaign. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => navigation?.goBack();

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  if (isLoading) {
    return (
      <Screen edges={["top", "bottom"]}>
        <AppBar title="Edit Campaign" onBack={handleBack} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.color.crimson} />
          <Text variant="body" tone="inkMuted" style={styles.centeredText}>
            Loading campaign...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!canEdit) {
    return (
      <Screen edges={["top", "bottom"]}>
        <AppBar title="Edit Campaign" onBack={handleBack} />
        <View style={styles.centered}>
          <Text variant="body" tone="inkMuted">
            This campaign cannot be edited
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen keyboardAvoiding scroll edges={["top", "bottom"]}>
      <AppBar title="Edit Campaign" onBack={handleBack} />

      <View style={styles.form}>
        <Field
          label="Campaign Title"
          value={formData.title}
          onChangeText={(text) => updateField("title", text)}
          placeholder="Enter campaign title"
          maxLength={100}
          error={errors.title}
          required
        />

        <Field
          label="Description"
          value={formData.description}
          onChangeText={(text) => updateField("description", text)}
          placeholder="Describe the campaign"
          multiline
          maxLength={500}
          error={errors.description}
          required
        />

        <Field
          label="Location"
          value={formData.location}
          onChangeText={(text) => updateField("location", text)}
          placeholder="Enter location"
          maxLength={100}
          error={errors.location}
          required
        />

        <Field
          label="Address"
          value={formData.address}
          onChangeText={(text) => updateField("address", text)}
          placeholder="Enter full address"
          maxLength={200}
          error={errors.address}
          required
        />

        <Field
          label="Date"
          value={formData.date}
          onChangeText={(text) => updateField("date", text)}
          placeholder="YYYY-MM-DD"
          error={errors.date}
          required
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Field
              label="Start Time"
              value={formData.startTime}
              onChangeText={(text) => updateField("startTime", text)}
              placeholder="HH:MM"
              error={errors.startTime}
              required
            />
          </View>

          <View style={styles.halfField}>
            <Field
              label="End Time"
              value={formData.endTime}
              onChangeText={(text) => updateField("endTime", text)}
              placeholder="HH:MM"
              error={errors.endTime}
              required
            />
          </View>
        </View>

        <Field
          label="Donation Goal"
          value={formData.donationGoal}
          onChangeText={(text) => updateField("donationGoal", text)}
          placeholder="Enter target number"
          keyboardType="numeric"
          error={errors.donationGoal}
          required
        />

        <Field
          label="Contact Person"
          value={formData.contactPerson}
          onChangeText={(text) => updateField("contactPerson", text)}
          placeholder="Enter contact person name"
          maxLength={100}
          error={errors.contactPerson}
          required
        />

        <Field
          label="Contact Phone"
          value={formData.contactPhone}
          onChangeText={(text) => updateField("contactPhone", text)}
          placeholder="Enter contact phone number"
          keyboardType="phone-pad"
          maxLength={20}
          error={errors.contactPhone}
          required
        />

        <Field
          label="Contact Email"
          value={formData.contactEmail}
          onChangeText={(text) => updateField("contactEmail", text)}
          placeholder="Enter contact email"
          keyboardType="email-address"
          maxLength={100}
          autoCapitalize="none"
          error={errors.contactEmail}
          required
        />

        <Field
          label="Requirements"
          value={formData.requirements}
          onChangeText={(text) => updateField("requirements", text)}
          placeholder="Special requirements (optional)"
          multiline
          maxLength={300}
        />

        <Field
          label="Additional Notes"
          value={formData.additionalNotes}
          onChangeText={(text) => updateField("additionalNotes", text)}
          placeholder="Additional notes (optional)"
          multiline
          maxLength={300}
        />

        <Button
          title="Update Campaign"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredText: {
    marginTop: 16,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
});
