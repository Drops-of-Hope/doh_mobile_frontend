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
  nic: string;
  address: string;
  emergencyContact: string;
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
    nic: "",
    address: "",
    emergencyContact: "",
  });

  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  // Load user data from backend using getUserProfile
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch full user profile from backend
        console.log("📥 Fetching user profile from backend...");
        const userProfile = await userService.getUserProfile();
        console.log("✅ User profile received:", userProfile);

        if (userProfile) {
          // Split name into first and last
          const nameParts = userProfile.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ") || "";

          setFormData({
            firstName,
            lastName,
            email: userProfile.email,
            phoneNumber: userProfile.userDetails?.phoneNumber || "",
            bloodType: formatBloodTypeForDisplay(userProfile.bloodGroup) || "",
            nic: userProfile.nic || "",
            address: userProfile.userDetails?.address || "",
            emergencyContact: userProfile.userDetails?.emergencyContact || "",
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        Alert.alert("Error", "Failed to load profile data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Helper function to format blood type for display (A_POSITIVE -> A+)
  const formatBloodTypeForDisplay = (bloodType: string | undefined): string => {
    if (!bloodType) return "";
    
    const bloodTypeMap: Record<string, string> = {
      'A_POSITIVE': 'A+', 'A_NEGATIVE': 'A-',
      'B_POSITIVE': 'B+', 'B_NEGATIVE': 'B-',
      'AB_POSITIVE': 'AB+', 'AB_NEGATIVE': 'AB-',
      'O_POSITIVE': 'O+', 'O_NEGATIVE': 'O-'
    };
    
    return bloodTypeMap[bloodType] || bloodType;
  };

  // Helper function to format blood type for backend (A+ -> A_POSITIVE)
  const formatBloodTypeForBackend = (bloodType: string): string => {
    const bloodTypeMap: Record<string, string> = {
      'A+': 'A_POSITIVE', 'A-': 'A_NEGATIVE',
      'B+': 'B_POSITIVE', 'B-': 'B_NEGATIVE',
      'AB+': 'AB_POSITIVE', 'AB-': 'AB_NEGATIVE',
      'O+': 'O_POSITIVE', 'O-': 'O_NEGATIVE'
    };
    
    return bloodTypeMap[bloodType.toUpperCase()] || bloodType;
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      "firstName",
      "lastName", 
      "email",
      "phoneNumber",
    ];

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
    if (field === 'phoneNumber' || field === 'emergencyContact') {
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
      } else if ((field === 'phoneNumber' || field === 'emergencyContact') && processedValue.length >= 10) {
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
              label="NIC"
              value={formData.nic}
              onChangeText={() => {}}
              placeholder="Your NIC number"
              editable={false}
              helpText="NIC cannot be changed (set during profile completion)"
            />
            <EnhancedInputField
              label="Blood Type"
              value={formData.bloodType}
              onChangeText={() => {}}
              placeholder="Your blood type"
              editable={false}
              helpText="Blood type cannot be changed (set during profile completion)"
            />
            <EnhancedInputField
              label="Address"
              value={formData.address}
              onChangeText={(text: string) => updateFormData("address", text)}
              placeholder="Enter your complete address"
              multiline
              error={errors.address}
              helpText="Your current residential address"
            />
          </FormSection>

          <FormSection title="Emergency Contact">
            <PhoneInputField
              label="Emergency Contact Number"
              value={formData.emergencyContact}
              onChangeText={(text: string) => updateFormData("emergencyContact", text.replace(/\s/g, ''))}
              error={errors.emergencyContact}
              helpText="Someone we can contact in case of emergency"
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
