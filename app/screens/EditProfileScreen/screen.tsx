import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Alert,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useAuthUser } from "../../hooks/useAuthUser";
import DashboardHeader from "../CampaignDashboardScreen/molecules/DashboardHeader";
import FormSection from "../CreateCampaignScreen/molecules/FormSection";
import InputField from "../CreateCampaignScreen/atoms/InputField";
import SubmitButton from "../CreateCampaignScreen/atoms/SubmitButton";

interface EditProfileScreenProps {
  navigation?: any;
  onBack?: () => void;
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
          const nameParts = storedUserData.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
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
          const nameParts = user.name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          setFormData(prev => ({
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
    const newErrors: Partial<ProfileFormData> = {};
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "bloodType",
    ];

    requiredFields.forEach((field) => {
      if (!formData[field as keyof ProfileFormData].trim()) {
        newErrors[field as keyof ProfileFormData] = `${field} is required`;
      }
    });

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
      // Simulate profile update
      console.log("Updating profile:", formData);
      Alert.alert("Success", "Profile updated successfully", [
        { text: "OK", onPress: () => handleBack() },
      ]);
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigation?.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />

      <DashboardHeader
        title="Edit Profile"
        onBack={handleBack}
        onAdd={() => {}}
      />

      {isLoading ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <FormSection title="Loading Profile Data...">
            <InputField
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
          <InputField
            label="First Name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData("firstName", text)}
            placeholder="Enter first name"
            error={errors.firstName}
            required
          />
          <InputField
            label="Last Name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData("lastName", text)}
            placeholder="Enter last name"
            error={errors.lastName}
            required
          />
          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData("email", text)}
            placeholder="Enter email address"
            keyboardType="email-address"
            error={errors.email}
            required
          />
          <InputField
            label="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => updateFormData("phoneNumber", text)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.phoneNumber}
            required
          />
        </FormSection>

        <FormSection title="Medical Information">
          <InputField
            label="Blood Type"
            value={formData.bloodType}
            onChangeText={(text) => updateFormData("bloodType", text)}
            placeholder="e.g., O+, A-, B+, AB-"
            error={errors.bloodType}
            required
          />
          <InputField
            label="Address"
            value={formData.address}
            onChangeText={(text) => updateFormData("address", text)}
            placeholder="Enter your address"
            multiline
            error={errors.address}
          />
        </FormSection>

        <FormSection title="Emergency Contact">
          <InputField
            label="Emergency Contact Name"
            value={formData.emergencyContact}
            onChangeText={(text) => updateFormData("emergencyContact", text)}
            placeholder="Enter emergency contact name"
            error={errors.emergencyContact}
          />
          <InputField
            label="Emergency Contact Phone"
            value={formData.emergencyPhone}
            onChangeText={(text) => updateFormData("emergencyPhone", text)}
            placeholder="Enter emergency contact phone"
            keyboardType="phone-pad"
            error={errors.emergencyPhone}
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
