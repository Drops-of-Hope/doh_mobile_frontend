import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusBadgeProps {
  type: 'donation' | 'checkup';
}

export default function StatusBadge({ type }: StatusBadgeProps) {
  const getStatusColors = (activityType: string) => {
    switch (activityType) {
      case "donation":
        return { text: '#FF4757', bg: '#FFF5F5' };
      case "checkup":
        return { text: '#00D2D3', bg: '#F0FDFA' };
      default:
        return { text: '#6B7280', bg: '#F8F9FA' };
    }
  };

  const getStatusIcon = (activityType: string) => {
    switch (activityType) {
      case "donation":
        return "heart";
      case "checkup":
        return "medical";
      default:
        return "checkmark-circle";
    }
  };

  const statusColors = getStatusColors(type);
  const statusIcon = getStatusIcon(type);

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
      <Ionicons name={statusIcon as any} size={14} color={statusColors.text} style={styles.statusIcon} />
      <Text style={[styles.statusText, { color: statusColors.text }]}>
        {type === 'donation' ? 'Blood Donation' : 'Health Checkup'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
