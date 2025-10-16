import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useAuthUser } from "../../hooks/useAuthUser";
import { userService } from "../../services/userService";
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";
import FormSection from "../CreateCampaignScreen/molecules/FormSection";
import SubmitButton from "../CreateCampaignScreen/atoms/SubmitButton";
import EnhancedInputField from "../shared/atoms/EnhancedInputField";
import PhoneInputField from "../shared/atoms/PhoneInputField";
import ValidationUtils from "../../utils/ValidationUtils";

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
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export default function EditProfileScreen({
  navigation,
  onBack,
  onClose,
}: EditProfileScreenProps) {
  const { user } = useAuth();
  const { getStoredUserData } = useAuthUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bloodType: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  // Load user data from auth service
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const storedUserData = await getStoredUserData();

        if (storedUserData) {
          // Split name into first and last
          const nameParts = storedUserData.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setFormData({
            firstName,
            lastName,
            email: storedUserData.email,
            phoneNumber: "", // We don't have phone in stored data
            bloodType: storedUserData.bloodGroup || "",
            address: "", // We don't have address in stored data
            emergencyContact: "",
            emergencyPhone: "",
          });
        } else if (user) {
          // Fallback to AuthContext user data
          const nameParts = user.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setFormData((prev) => ({
            ...prev,
            firstName,
            lastName,
            email: user.email,
          }));
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const validateForm = (): boolean => {
    const requiredFields = [
      "firstName",
      "lastName", 
      "email",
      "phoneNumber",
      "bloodType",
    ];

    // Use enhanced validation with specific field validation
    const validation = ValidationUtils.validateForm(formData, requiredFields);
    
    // Additional custom validations
    const customErrors: Partial<ProfileFormData> = {};
    
    // Blood type validation (convert display format to enum format)
    if (formData.bloodType) {
      const bloodTypeMap: Record<string, string> = {
        'A+': 'A_POSITIVE', 'A-': 'A_NEGATIVE',
        'B+': 'B_POSITIVE', 'B-': 'B_NEGATIVE', 
        'AB+': 'AB_POSITIVE', 'AB-': 'AB_NEGATIVE',
        'O+': 'O_POSITIVE', 'O-': 'O_NEGATIVE'
      };
      
      const enumValue = bloodTypeMap[formData.bloodType.toUpperCase()];
      if (!enumValue) {
        customErrors.bloodType = "Please select a valid blood type (A+, A-, B+, B-, AB+, AB-, O+, O-)";
      }
    }
    
    // Emergency phone validation (optional but if provided, must be valid)
    if (formData.emergencyPhone && formData.emergencyPhone.trim()) {
      const emergencyPhoneValidation = ValidationUtils.validatePhoneNumber(formData.emergencyPhone);
      if (!emergencyPhoneValidation.isValid) {
        customErrors.emergencyPhone = emergencyPhoneValidation.error;
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
      const updatedProfile = await userService.updateProfile(updateData);
      
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => handleBack() },
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof ProfileFormData, value: string) => {
    let processedValue = value;
    
    // Apply specific processing for phone numbers
    if (field === 'phoneNumber' || field === 'emergencyPhone') {
      // Keep only digits and limit to 10 characters starting with 0
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length === 0 || cleaned.startsWith('0')) {
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
      if (field === 'email' && processedValue.trim()) {
        const emailValidation = ValidationUtils.validateEmail(processedValue);
        if (!emailValidation.isValid) {
          setErrors(prev => ({ ...prev, [field]: emailValidation.error }));
        }
      } else if ((field === 'phoneNumber' || field === 'emergencyPhone') && processedValue.length >= 10) {
        const phoneValidation = ValidationUtils.validatePhoneNumber(processedValue);
        if (!phoneValidation.isValid) {
          setErrors(prev => ({ ...prev, [field]: phoneValidation.error }));
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
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

        <DashboardHeader
          title="Edit Profile"
          onBack={handleBack}
        />

      {isLoading ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <FormSection title="Loading Profile Data...">
            <EnhancedInputField
              label="Loading..."
              value=""
              onChangeText={() => {}}
              placeholder="Loading profile data..."
            />
          </FormSection>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <FormSection title="Personal Information">
            <EnhancedInputField
              label="First Name"
              value={formData.firstName}
              onChangeText={(text: string) => updateFormData("firstName", text)}
              placeholder="Enter first name"
              error={errors.firstName}
              required
              helpText="Your legal first name"
            />
            <EnhancedInputField
              label="Last Name"
              value={formData.lastName}
              onChangeText={(text: string) => updateFormData("lastName", text)}
              placeholder="Enter last name"
              error={errors.lastName}
              required
              helpText="Your legal last name"
            />
            <EnhancedInputField
              label="Email"
              value={formData.email}
              onChangeText={(text: string) => updateFormData("email", text)}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              required
              helpText="We'll use this for important account notifications"
            />
            <PhoneInputField
              label="Phone Number"
              value={formData.phoneNumber}
              onChangeText={(text: string) => updateFormData("phoneNumber", text.replace(/\s/g, ''))}
              error={errors.phoneNumber}
              required
              helpText="Your primary contact number"
            />
          </FormSection>

          <FormSection title="Medical Information">
            <EnhancedInputField
              label="Blood Type"
              value={formData.bloodType}
              onChangeText={(text: string) => updateFormData("bloodType", text)}
              placeholder="e.g., O+, A-, B+, AB-"
              error={errors.bloodType}
              required
              helpText="Select your blood type (important for donation matching)"
            />
            <EnhancedInputField
              label="Address"
              value={formData.address}
              onChangeText={(text: string) => updateFormData("address", text)}
              placeholder="Enter your complete address"
              multiline
              error={errors.address}
              helpText="Your current residential address (minimum 10 characters)"
            />
          </FormSection>

          <FormSection title="Emergency Contact">
            <EnhancedInputField
              label="Emergency Contact Name"
              value={formData.emergencyContact}
              onChangeText={(text: string) => updateFormData("emergencyContact", text)}
              placeholder="Enter emergency contact name"
              error={errors.emergencyContact}
              helpText="Someone we can contact in case of emergency"
            />
            <PhoneInputField
              label="Emergency Contact Phone"
              value={formData.emergencyPhone}
              onChangeText={(text: string) => updateFormData("emergencyPhone", text.replace(/\s/g, ''))}
              error={errors.emergencyPhone}
              helpText="Emergency contact's phone number"
            />
          </FormSection>

          <SubmitButton
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            title="Update Profile"
          />
        </ScrollView>
      )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
});
