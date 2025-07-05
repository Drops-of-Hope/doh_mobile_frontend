import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import UrgencyBadge, { UrgencyLevel } from '../../atoms/HomeScreen/UrgencyBadge';
import ProgressBar from '../../atoms/HomeScreen/ProgressBar';
import ActionButton from '../../atoms/HomeScreen/ActionButton';

export interface Emergency {
  id: number;
  hospital: string;
  bloodType: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
  timeLeft: string;
}

interface EmergencyCardProps {
  emergency: Emergency;
  onDonate: (emergency: Emergency) => void;
  onViewDetails?: (emergency: Emergency) => void;
}

export default function EmergencyCard({ emergency, onDonate, onViewDetails }: EmergencyCardProps) {
  return (
    <View style={styles.emergencyCard}>
      <View style={styles.emergencyHeader}>
        <UrgencyBadge urgency={emergency.urgency} />
        <Text style={styles.timeLeft}>{emergency.timeLeft}</Text>
      </View>
      
      <Text style={styles.emergencyHospital}>{emergency.hospital}</Text>
      
      <View style={styles.bloodTypeContainer}>
        <Text style={styles.bloodTypeText}>{emergency.bloodType}</Text>
        <Text style={styles.slotsText}>
          {emergency.slotsUsed}/{emergency.totalSlots} slots filled
        </Text>
      </View>
      
      <ProgressBar 
        current={emergency.slotsUsed} 
        total={emergency.totalSlots} 
        urgency={emergency.urgency}
      />

      <View style={styles.emergencyActions}>
        <ActionButton
          title="Donate Now"
          onPress={() => onDonate(emergency)}
          variant="primary"
          icon="heart"
          style={{ flex: 2 }}
        />
        
        <ActionButton
          title="View Details"
          onPress={() => onViewDetails?.(emergency)}
          variant="secondary"
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emergencyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeLeft: {
    fontSize: 12,
    color: '#FF4757',
    fontWeight: '700',
  },
  emergencyHospital: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  bloodTypeContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  bloodTypeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  slotsText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  emergencyActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
});
