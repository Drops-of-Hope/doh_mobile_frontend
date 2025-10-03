// Profile Completion Screen - For users who need to complete their profile after auth
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthUser } from '../hooks/useAuthUser';
import { District } from '../../constants/districts';

interface ProfileCompletionScreenProps {
  userId: string;
  onComplete: (userInfo: any) => void;
  onSkip?: () => void;
}

const ProfileCompletionScreen: React.FC<ProfileCompletionScreenProps> = ({
  userId,
  onComplete,
  onSkip,
}) => {
  const [nic, setNic] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A_POSITIVE');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('COLOMBO');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [showBloodGroupPicker, setShowBloodGroupPicker] = useState(false);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);

  const { completeUserProfile, isProcessing, error } = useAuthUser();

  const getBloodGroupLabel = (value: string) => {
    const group = bloodGroups.find(g => g.value === value);
    return group ? group.label : value;
  };

  const getDistrictLabel = (value: string) => {
    const dist = districtOptions.find(d => d.value === value);
    return dist ? dist.label : value;
  };

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
    console.log("🔄 Starting profile completion...");
    console.log("👤 User ID being sent to backend:", userId);
    
    // Validate required fields
    if (!nic || !bloodGroup || !address || !city || !district) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const profileData = {
        nic,
        bloodGroup,
        address,
        city,
        district,
        phoneNumber: phoneNumber || undefined,
        emergencyContact: emergencyContact || undefined,
      };
      
      console.log("📋 Profile data being sent:", profileData);
      
      const userInfo = await completeUserProfile(userId, profileData);
      
      console.log("✅ Profile completion response:", userInfo);

      if (userInfo) {
        Alert.alert('Success', 'Profile completed successfully!', [
          { text: 'OK', onPress: () => onComplete(userInfo) },
        ]);
      }
    } catch (error: any) {
      console.error("❌ Profile completion error:", error);
      Alert.alert('Error', error.message || 'Failed to complete profile');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide additional information to complete your blood donation profile
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>NIC Number *</Text>
          <TextInput
            style={styles.input}
            value={nic}
            onChangeText={setNic}
            placeholder="Enter your NIC number"
            maxLength={12}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Blood Group *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowBloodGroupPicker(!showBloodGroupPicker)}
          >
            <Text style={styles.pickerButtonText}>
              {getBloodGroupLabel(bloodGroup)}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          
          {showBloodGroupPicker && (
            <View style={styles.dropdownContainer}>
              {bloodGroups.map(group => (
                <TouchableOpacity
                  key={group.value}
                  style={[
                    styles.dropdownItem,
                    bloodGroup === group.value && styles.selectedDropdownItem
                  ]}
                  onPress={() => {
                    setBloodGroup(group.value);
                    setShowBloodGroupPicker(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    bloodGroup === group.value && styles.selectedDropdownItemText
                  ]}>
                    {group.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={address}
            onChangeText={setAddress}
            placeholder="Enter your address"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>City *</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Enter your city"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>District *</Text>
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => setShowDistrictPicker(!showDistrictPicker)}
          >
            <Text style={styles.pickerButtonText}>
              {getDistrictLabel(district)}
            </Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          
          {showDistrictPicker && (
            <View style={styles.dropdownContainer}>
              {districtOptions.map(dist => (
                <TouchableOpacity
                  key={dist.value}
                  style={[
                    styles.dropdownItem,
                    district === dist.value && styles.selectedDropdownItem
                  ]}
                  onPress={() => {
                    setDistrict(dist.value);
                    setShowDistrictPicker(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    district === dist.value && styles.selectedDropdownItemText
                  ]}>
                    {dist.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            maxLength={10}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Emergency Contact</Text>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            maxLength={10}
            onChangeText={setEmergencyContact}
            placeholder="Enter emergency contact number"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={handleComplete}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Complete Profile</Text>
          )}
        </TouchableOpacity>

        {onSkip && (
          <TouchableOpacity
            style={[styles.button, styles.skipButton]}
            onPress={onSkip}
            disabled={isProcessing}
          >
            <Text style={[styles.buttonText, styles.skipButtonText]}>Skip for Now</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  form: {
    marginBottom: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  errorContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffe6e6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#cc0000',
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: '#FF6B6B',
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF6B6B',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButtonText: {
    color: '#FF6B6B',
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  pickerArrow: {
    fontSize: 12,
    color: '#666',
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 5,
    maxHeight: 150,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedDropdownItem: {
    backgroundColor: '#FF6B6B',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedDropdownItemText: {
    color: '#fff',
  },
});

export default ProfileCompletionScreen;
