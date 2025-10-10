import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import DashboardHeader from "./CampaignDashboardScreen/molecules/DashboardHeader";
import { campaignService } from "../services/campaignService";

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

      // Populate form with campaign data
      setFormData({
        title: campaignData.title || "",
        description: campaignData.description || "",
        location: campaignData.location || "",
        address: campaignData.address || "",
        date: campaignData.date ? new Date(campaignData.date).toISOString().split('T')[0] : "",
        startTime: campaignData.startTime || "",
        endTime: campaignData.endTime || "",
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
      console.error("Failed to load campaign:", error);
      
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
      console.error("Failed to update campaign:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update campaign. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => navigation?.goBack();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader
          title="Edit Campaign"
          onBack={handleBack}
          onAdd={() => {}}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#DC2626" />
          <Text style={styles.loadingText}>Loading campaign...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!canEdit) {
    return (
      <SafeAreaView style={styles.container}>
        <DashboardHeader
          title="Edit Campaign"
          onBack={handleBack}
          onAdd={() => {}}
        />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>This campaign cannot be edited</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <DashboardHeader
        title="Edit Campaign"
        onBack={handleBack}
        onAdd={() => {}}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          {/* Campaign Title */}
          <View style={styles.field}>
            <Text style={styles.label}>Campaign Title *</Text>
            <TextInput
              style={[styles.input, errors.title && styles.inputError]}
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              placeholder="Enter campaign title"
              maxLength={100}
            />
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.description && styles.inputError]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Describe the campaign"
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
              placeholder="Enter location"
              maxLength={100}
            />
            {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
          </View>

          {/* Address */}
          <View style={styles.field}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter full address"
              maxLength={200}
            />
            {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}
          </View>

          {/* Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={[styles.input, errors.date && styles.inputError]}
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              placeholder="YYYY-MM-DD"
            />
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
          </View>

          {/* Time Fields */}
          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Start Time *</Text>
              <TextInput
                style={[styles.input, errors.startTime && styles.inputError]}
                value={formData.startTime}
                onChangeText={(text) => setFormData({ ...formData, startTime: text })}
                placeholder="HH:MM"
              />
              {errors.startTime && <Text style={styles.errorText}>{errors.startTime}</Text>}
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>End Time *</Text>
              <TextInput
                style={[styles.input, errors.endTime && styles.inputError]}
                value={formData.endTime}
                onChangeText={(text) => setFormData({ ...formData, endTime: text })}
                placeholder="HH:MM"
              />
              {errors.endTime && <Text style={styles.errorText}>{errors.endTime}</Text>}
            </View>
          </View>

          {/* Donation Goal */}
          <View style={styles.field}>
            <Text style={styles.label}>Donation Goal *</Text>
            <TextInput
              style={[styles.input, errors.donationGoal && styles.inputError]}
              value={formData.donationGoal}
              onChangeText={(text) => setFormData({ ...formData, donationGoal: text })}
              placeholder="Enter target number"
              keyboardType="numeric"
            />
            {errors.donationGoal && <Text style={styles.errorText}>{errors.donationGoal}</Text>}
          </View>

          {/* Contact Person */}
          <View style={styles.field}>
            <Text style={styles.label}>Contact Person *</Text>
            <TextInput
              style={[styles.input, errors.contactPerson && styles.inputError]}
              value={formData.contactPerson}
              onChangeText={(text) => setFormData({ ...formData, contactPerson: text })}
              placeholder="Enter contact person name"
              maxLength={100}
            />
            {errors.contactPerson && <Text style={styles.errorText}>{errors.contactPerson}</Text>}
          </View>

          {/* Contact Phone */}
          <View style={styles.field}>
            <Text style={styles.label}>Contact Phone *</Text>
            <TextInput
              style={[styles.input, errors.contactPhone && styles.inputError]}
              value={formData.contactPhone}
              onChangeText={(text) => setFormData({ ...formData, contactPhone: text })}
              placeholder="Enter contact phone number"
              keyboardType="phone-pad"
              maxLength={20}
            />
            {errors.contactPhone && <Text style={styles.errorText}>{errors.contactPhone}</Text>}
          </View>

          {/* Contact Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Contact Email *</Text>
            <TextInput
              style={[styles.input, errors.contactEmail && styles.inputError]}
              value={formData.contactEmail}
              onChangeText={(text) => setFormData({ ...formData, contactEmail: text })}
              placeholder="Enter contact email"
              keyboardType="email-address"
              maxLength={100}
              autoCapitalize="none"
            />
            {errors.contactEmail && <Text style={styles.errorText}>{errors.contactEmail}</Text>}
          </View>

          {/* Requirements */}
          <View style={styles.field}>
            <Text style={styles.label}>Requirements</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.requirements}
              onChangeText={(text) => setFormData({ ...formData, requirements: text })}
              placeholder="Special requirements (optional)"
              multiline
              numberOfLines={3}
              maxLength={300}
            />
          </View>

          {/* Additional Notes */}
          <View style={styles.field}>
            <Text style={styles.label}>Additional Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.additionalNotes}
              onChangeText={(text) => setFormData({ ...formData, additionalNotes: text })}
              placeholder="Additional notes (optional)"
              multiline
              numberOfLines={3}
              maxLength={300}
            />
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Update Campaign</Text>
            )}
          </TouchableOpacity>
        </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    paddingVertical: 20,
  },
  field: {
    marginBottom: 20,
  },
  halfField: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  inputError: {
    borderColor: "#DC2626",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    marginTop: 4,
  },
  saveButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});