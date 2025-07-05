import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Alert 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NoticeCard from '../../atoms/DonationScreen/NoticeCard';

interface AppointmentBookingFormProps {
  onClose: () => void;
  onBookingSuccess: () => void;
}

export default function AppointmentBookingForm({ onClose, onBookingSuccess }: AppointmentBookingFormProps) {
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const regions = [
    "Western Province",
    "Central Province", 
    "Southern Province",
    "Northern Province",
    "Eastern Province",
  ];

  const hospitals: { [key: string]: string[] } = {
    "Western Province": [
      "National Hospital of Sri Lanka",
      "Colombo General Hospital", 
      "Negombo Hospital",
    ],
    "Central Province": ["Kandy General Hospital", "Peradeniya Hospital"],
  };

  const timeSlots = [
    "9:00 AM",
    "10:00 AM", 
    "11:00 AM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  const handleBookAppointment = () => {
    if (!selectedRegion || !selectedHospital || !selectedDate || !selectedTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    Alert.alert(
      "Appointment Booked!",
      `Your appointment has been scheduled for ${selectedDate} at ${selectedTime} at ${selectedHospital}. You will receive a confirmation shortly.`,
      [{ text: "OK", onPress: onBookingSuccess }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <NoticeCard
          title="Important Notice" 
          message="This appointment is purely for blood donation purposes."
          type="warning"
        />

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Appointment Details</Text>

          {/* Region Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Region</Text>
            <View style={styles.optionsContainer}>
              {regions.map((region) => (
                <TouchableOpacity
                  key={region}
                  style={[
                    styles.regionButton,
                    selectedRegion === region ? styles.selected : styles.unselected,
                  ]}
                  onPress={() => {
                    setSelectedRegion(region);
                    setSelectedHospital("");
                  }}
                >
                  <Text style={selectedRegion === region ? styles.selectedText : styles.unselectedText}>
                    {region}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Hospital Selection */}
          {selectedRegion && (
            <View style={styles.section}>
              <Text style={styles.label}>Select Hospital/Blood Bank</Text>
              <View>
                {(hospitals[selectedRegion] || []).map((hospital: string) => (
                  <TouchableOpacity
                    key={hospital}
                    style={[
                      styles.hospitalButton,
                      selectedHospital === hospital ? styles.selectedHospital : styles.unselectedHospital,
                    ]}
                    onPress={() => setSelectedHospital(hospital)}
                  >
                    <Text style={selectedHospital === hospital ? styles.selectedText : styles.unselectedText}>
                      {hospital}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setSelectedDate("2025-07-15")}
            >
              <Text style={styles.dateText}>
                {selectedDate || "Tap to select date"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Time Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>Select Time</Text>
            <View style={styles.optionsContainer}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time ? styles.selected : styles.unselected,
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text style={selectedTime === time ? styles.selectedText : styles.unselectedText}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={handleBookAppointment}>
            <Text style={styles.buttonText}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#374151',
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  regionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  hospitalButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  dateButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  selected: {
    backgroundColor: '#DC2626',
  },
  unselected: {
    backgroundColor: '#E5E7EB',
  },
  selectedHospital: {
    borderColor: '#DC2626',
    backgroundColor: '#FEF2F2',
  },
  unselectedHospital: {
    borderColor: '#E5E7EB',
  },
  selectedText: {
    color: 'white',
    fontWeight: '600',
  },
  unselectedText: {
    color: '#374151',
    fontWeight: '500',
  },
  dateText: {
    color: '#374151',
  },
  bookButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
