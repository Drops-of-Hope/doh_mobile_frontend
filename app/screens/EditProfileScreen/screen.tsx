import React, { useState, useEffect, useRef } from "react";
import { View, Alert, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { Screen, AppBar, Field, Button, ActionBar, SectionHeader, UserAvatar, useTheme } from "../../design";
import ValidationUtils from "../../utils/ValidationUtils";

import { logger } from "../../utils/logger";
interface EditProfileScreenProps {
  navigation?: any;
  onBack?: () => void;
  onClose?: () => void;
}

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bloodType: string;
  nic: string;
  address: string;
  emergencyContact: string;
}

const EMPTY_FORM: ProfileFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  bloodType: "",
  nic: "",
  address: "",
  emergencyContact: "",
};

export default function EditProfileScreen({
  navigation,
  onBack,
  onClose,
}: EditProfileScreenProps) {
  const theme = useTheme();
  const { user, refreshBackendUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>(EMPTY_FORM);
  const [initialData, setInitialData] = useState<ProfileFormData>(EMPTY_FORM);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  // Set right before a programmatic goBack() that already got its own
  // confirmation (Discard, or a successful Save) so 'beforeRemove' doesn't
  // ask the user to confirm a second time.
  const bypassLeaveGuard = useRef(false);

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  const isDirty = JSON.stringify(formData) !== JSON.stringify(initialData);

  // Load user data from backend using getUserProfile
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);

        // Fetch full user profile from backend
        const userProfile = await userService.getUserProfile();

        if (userProfile) {
          // Split name into first and last
          const nameParts = userProfile.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          const loaded: ProfileFormData = {
            firstName,
            lastName,
            email: userProfile.email,
            phoneNumber: userProfile.userDetails?.phoneNumber || "",
            bloodType: formatBloodTypeForDisplay(userProfile.bloodGroup) || "",
            nic: userProfile.nic || "",
            address: userProfile.userDetails?.address || "",
            emergencyContact: userProfile.userDetails?.emergencyContact || "",
          };

          setFormData(loaded);
          setInitialData(loaded);
          setAvatarUrl(userProfile.profileImageUrl ?? null);
        }
      } catch (error) {
        logger.error("Error loading user data:", error);
        Alert.alert("Error", "Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Prompt before leaving with unsaved changes, whether via back button or
  // Android hardware back — both route through 'beforeRemove'.
  useEffect(() => {
    if (!navigation?.addListener) return;

    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (!isDirty || bypassLeaveGuard.current) return;
      e.preventDefault();
      Alert.alert(
        "Discard changes?",
        "You have unsaved changes. Are you sure you want to discard them?",
        [
          { text: "Keep editing", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => navigation.dispatch(e.data.action) },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, isDirty]);

  // Helper function to format blood type for display (A_POSITIVE -> A+)
  const formatBloodTypeForDisplay = (bloodType: string | undefined): string => {
    if (!bloodType) return "";

    const bloodTypeMap: Record<string, string> = {
      A_POSITIVE: "A+",
      A_NEGATIVE: "A-",
      B_POSITIVE: "B+",
      B_NEGATIVE: "B-",
      AB_POSITIVE: "AB+",
      AB_NEGATIVE: "AB-",
      O_POSITIVE: "O+",
      O_NEGATIVE: "O-",
    };

    return bloodTypeMap[bloodType] || bloodType;
  };

  const validateForm = (): boolean => {
    const requiredFields = ["firstName", "lastName", "email", "phoneNumber"];

    // Use enhanced validation with specific field validation
    const validation = ValidationUtils.validateForm(formData, requiredFields);

    // Additional custom validations
    const customErrors: Partial<ProfileFormData> = {};

    // Emergency contact validation (optional - just phone number format check if provided)
    if (formData.emergencyContact && formData.emergencyContact.trim()) {
      const emergencyContactValidation = ValidationUtils.validatePhoneNumber(formData.emergencyContact);
      if (!emergencyContactValidation.isValid) {
        customErrors.emergencyContact = emergencyContactValidation.error;
      }
    }

    // Combine validation errors
    const allErrors = { ...validation.errors, ...customErrors };
    setErrors(allErrors);

    return Object.keys(allErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare update data for API
      const updateData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
      };

      // Call the real API
      await userService.updateProfile(updateData);

      // Keep AuthContext's cached profile (name, etc.) in sync with the write.
      await refreshBackendUser();

      Alert.alert("Success", "Profile updated successfully", [
        {
          text: "OK",
          onPress: () => {
            bypassLeaveGuard.current = true;
            handleBack();
          },
        },
      ]);
    } catch (error) {
      logger.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (!isDirty) {
      handleBack();
      return;
    }
    Alert.alert(
      "Discard changes?",
      "You have unsaved changes. Are you sure you want to discard them?",
      [
        { text: "Keep editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            bypassLeaveGuard.current = true;
            setFormData(initialData);
            handleBack();
          },
        },
      ]
    );
  };

  const updateFormData = (field: keyof ProfileFormData, value: string) => {
    let processedValue = value;

    // Apply specific processing for phone numbers
    if (field === "phoneNumber" || field === "emergencyContact") {
      // Keep only digits and limit to 10 characters starting with 0
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length === 0 || cleaned.startsWith("0")) {
        processedValue = cleaned.slice(0, 10);
      } else {
        return; // Don't update if it doesn't start with 0
      }
    }

    // Update form data
    setFormData((prev) => ({ ...prev, [field]: processedValue }));

    // Clear validation error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation for certain fields
    setTimeout(() => {
      if (field === "email" && processedValue.trim()) {
        const emailValidation = ValidationUtils.validateEmail(processedValue);
        if (!emailValidation.isValid) {
          setErrors((prev) => ({ ...prev, [field]: emailValidation.error }));
        }
      } else if ((field === "phoneNumber" || field === "emergencyContact") && processedValue.length >= 10) {
        const phoneValidation = ValidationUtils.validatePhoneNumber(processedValue);
        if (!phoneValidation.isValid) {
          setErrors((prev) => ({ ...prev, [field]: phoneValidation.error }));
        }
      }
    }, 500); // Debounce validation
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else if (onBack) {
      onBack();
    } else {
      navigation?.goBack();
    }
  };

  return (
    <Screen keyboardAvoiding>
      <AppBar title="Edit Profile" onBack={handleBack} />

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <Field label="Loading..." editable={false} placeholder="Loading profile data..." value="" onChangeText={() => {}} />
        </View>
      ) : (
        <>
          <ScrollView style={styles.flex} showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            <View style={styles.avatarRow}>
              <UserAvatar
                url={avatarUrl}
                name={`${formData.firstName} ${formData.lastName}`}
                seed={user?.sub}
                size={88}
              />
              <Button
                title="Change avatar"
                variant="ghost"
                fullWidth={false}
                onPress={() => navigation?.navigate("AvatarPicker")}
              />
            </View>

            <SectionHeader title="Personal Information" />
            <Field
              label="First Name"
              value={formData.firstName}
              onChangeText={(text: string) => updateFormData("firstName", text)}
              placeholder="Enter first name"
              error={errors.firstName}
              required
              helperText="Your legal first name"
            />
            <Field
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text: string) => updateFormData("lastName", text)}
              placeholder="Enter last name"
              error={errors.lastName}
              required
              helperText="Your legal last name"
            />
            <Field
              label="Email"
              value={formData.email}
              onChangeText={(text: string) => updateFormData("email", text)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              required
              helperText="We'll use this for important account notifications"
            />
            <Field
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text: string) => updateFormData("phoneNumber", text.replace(/\s/g, ""))}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              error={errors.phoneNumber}
              required
              helperText="Your primary contact number"
            />

            <View style={[styles.sectionSpacing, { borderTopColor: theme.color.hairline }]}>
              <SectionHeader title="Medical Information" />
            </View>
            <Field label="NIC" value={formData.nic} editable={false} placeholder="Your NIC number" helperText="NIC cannot be changed (set during profile completion)" />
            <Field
              label="Blood Type"
              value={formData.bloodType}
              editable={false}
              placeholder="Your blood type"
              helperText="Blood type cannot be changed (set during profile completion)"
            />
            <Field
              label="Address"
              value={formData.address}
              onChangeText={(text: string) => updateFormData("address", text)}
              placeholder="Enter your complete address"
              multiline
              error={errors.address}
              helperText="Your current residential address"
            />

            <View style={[styles.sectionSpacing, { borderTopColor: theme.color.hairline }]}>
              <SectionHeader title="Emergency Contact" />
            </View>
            <Field
              label="Emergency Contact Number"
              value={formData.emergencyContact}
              onChangeText={(text: string) => updateFormData("emergencyContact", text.replace(/\s/g, ""))}
              placeholder="Enter emergency contact number"
              keyboardType="phone-pad"
              error={errors.emergencyContact}
              helperText="Someone we can contact in case of emergency"
            />
          </ScrollView>

          <ActionBar>
            <View style={styles.actionFlex}>
              <Button title="Discard" variant="outline" disabled={!isDirty} onPress={handleDiscard} />
            </View>
            <View style={styles.actionFlex}>
              <Button
                title="Save Changes"
                variant="solid"
                disabled={!isDirty}
                loading={isSubmitting}
                onPress={handleSubmit}
              />
            </View>
          </ActionBar>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  loadingWrap: {
    padding: 20,
  },
  form: {
    padding: 20,
    paddingBottom: 32,
  },
  avatarRow: {
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  sectionSpacing: {
    marginTop: 8,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1.5,
  },
  actionFlex: {
    flex: 1,
  },
});
