// Profile Completion Screen - shown by AppNavigator as a root screen whenever the backend
// says profileStatus === "incomplete". Talks to the backend directly and refreshes
// AuthContext's profile afterwards; the navigator swaps to the tabs on its own once
// profileStatus flips to "complete" (see AppNavigator.tsx).
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import authUserService from '../../services/authUserService';
import ValidationUtils from '../../utils/ValidationUtils';

import { Screen, Field, Select, Button, Text } from '../../design';

import { logger } from "../../utils/logger";

const ProfileCompletionScreen: React.FC = () => {
  const { user, refreshBackendUser, logout } = useAuth();
  const userId = user?.sub || '';

  const [nic, setNic] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A_POSITIVE');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('COLOMBO');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bloodGroups = [
    { label: 'A+', value: 'A_POSITIVE' },
    { label: 'A-', value: 'A_NEGATIVE' },
    { label: 'B+', value: 'B_POSITIVE' },
    { label: 'B-', value: 'B_NEGATIVE' },
    { label: 'AB+', value: 'AB_POSITIVE' },
    { label: 'AB-', value: 'AB_NEGATIVE' },
    { label: 'O+', value: 'O_POSITIVE' },
    { label: 'O-', value: 'O_NEGATIVE' },
  ];

  const districtOptions = [
    { label: 'Colombo', value: 'COLOMBO' },
    { label: 'Gampaha', value: 'GAMPAHA' },
    { label: 'Kalutara', value: 'KALUTARA' },
    { label: 'Kandy', value: 'KANDY' },
    { label: 'Matale', value: 'MATALE' },
    { label: 'Nuwara Eliya', value: 'NUWARA_ELIYA' },
    { label: 'Galle', value: 'GALLE' },
    { label: 'Matara', value: 'MATARA' },
    { label: 'Hambantota', value: 'HAMBANTOTA' },
    { label: 'Jaffna', value: 'JAFFNA' },
    { label: 'Kilinochchi', value: 'KILINOCHCHI' },
    { label: 'Mannar', value: 'MANNAR' },
    { label: 'Kurunegala', value: 'KURUNEGALA' },
    { label: 'Puttalam', value: 'PUTTALAM' },
    { label: 'Anuradhapura', value: 'ANURADHAPURA' },
    { label: 'Polonnaruwa', value: 'POLONNARUWA' },
    { label: 'Badulla', value: 'BADULLA' },
    { label: 'Monaragala', value: 'MONARAGALA' },
    { label: 'Ratnapura', value: 'RATNAPURA' },
    { label: 'Kegalle', value: 'KEGALLE' },
    { label: 'Trincomalee', value: 'TRINCOMALEE' },
    { label: 'Batticaloa', value: 'BATTICALOA' },
    { label: 'Ampara', value: 'AMPARA' },
    { label: 'Mullaitivu', value: 'MULLAITIVU' },
    { label: 'Vavuniya', value: 'VAVUNIYA' },
  ];

  const handleComplete = async () => {
    // Comprehensive validation using ValidationUtils
    const formData = {
      nic,
      bloodGroup,
      address,
      city,
      district,
      phoneNumber: phoneNumber || undefined,
      emergencyContact: emergencyContact || undefined,
    };

    const requiredFields = ['nic', 'bloodGroup', 'address', 'city', 'district'];
    const validation = ValidationUtils.validateForm(formData, requiredFields);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    // Clear any previous validation errors
    setValidationErrors({});
    setError(null);
    setIsProcessing(true);

    try {
      const profileData = {
        nic: nic.trim(),
        bloodGroup,
        address: address.trim(),
        city: city.trim(),
        district,
        phoneNumber: phoneNumber ? ValidationUtils.cleanPhoneNumber(phoneNumber) : undefined,
        emergencyContact: emergencyContact ? ValidationUtils.cleanPhoneNumber(emergencyContact) : undefined,
      };

      await authUserService.completeProfile(userId, profileData);
      // Re-fetch profile status from the server; AppNavigator swaps to the tabs once
      // profileStatus flips to "complete".
      await refreshBackendUser();
    } catch (err: any) {
      logger.error("Profile completion error:", err);
      const message = err?.message || 'Failed to complete profile';
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'You need to complete your profile to use the app. Sign out instead?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  return (
    <Screen keyboardAvoiding scroll edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text variant="h1" style={styles.title}>Complete Your Profile</Text>
        <Text variant="body" tone="inkMuted">
          Please provide additional information to complete your blood donation profile
        </Text>
      </View>

      <View style={styles.form}>
        <Field
          label="NIC Number"
          value={nic}
          onChangeText={(text) => {
            setNic(text);
            if (validationErrors.nic) {
              const newErrors = { ...validationErrors };
              delete newErrors.nic;
              setValidationErrors(newErrors);
            }
          }}
          placeholder="Enter your NIC number"
          maxLength={12}
          error={validationErrors.nic}
          required
        />

        <Select
          label="Blood Group"
          value={bloodGroup}
          onChange={setBloodGroup}
          options={bloodGroups}
          required
        />

        <Field
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          multiline
          required
        />

        <Field
          label="City"
          value={city}
          onChangeText={setCity}
          placeholder="Enter your city"
          required
        />

        <Select
          label="District"
          value={district}
          onChange={setDistrict}
          options={districtOptions}
          required
        />

        <Field
          label="Phone Number"
          value={phoneNumber}
          maxLength={10}
          onChangeText={(text) => {
            // Only allow digits and ensure it starts with 0
            const cleaned = text.replace(/\D/g, '');
            if (cleaned.length === 0 || cleaned.startsWith('0')) {
              setPhoneNumber(cleaned);
              if (validationErrors.phoneNumber) {
                const newErrors = { ...validationErrors };
                delete newErrors.phoneNumber;
                setValidationErrors(newErrors);
              }
            }
          }}
          placeholder="0771234567"
          keyboardType="phone-pad"
          error={validationErrors.phoneNumber}
        />

        <Field
          label="Emergency Contact"
          value={emergencyContact}
          maxLength={10}
          onChangeText={(text) => {
            // Only allow digits and ensure it starts with 0
            const cleaned = text.replace(/\D/g, '');
            if (cleaned.length === 0 || cleaned.startsWith('0')) {
              setEmergencyContact(cleaned);
              if (validationErrors.emergencyContact) {
                const newErrors = { ...validationErrors };
                delete newErrors.emergencyContact;
                setValidationErrors(newErrors);
              }
            }
          }}
          placeholder="0771234567"
          keyboardType="phone-pad"
          error={validationErrors.emergencyContact}
        />
      </View>

      {error ? (
        <Text variant="body" tone="danger" align="center" style={styles.globalError}>
          {error}
        </Text>
      ) : null}

      <View style={styles.buttonContainer}>
        <Button
          title="Complete Profile"
          onPress={handleComplete}
          loading={isProcessing}
          disabled={isProcessing}
        />

        <Button
          title="Sign out"
          variant="outline"
          onPress={handleSignOut}
          disabled={isProcessing}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  form: {
    marginBottom: 8,
  },
  globalError: {
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 12,
  },
});

export default ProfileCompletionScreen;
