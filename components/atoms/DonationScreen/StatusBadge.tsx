import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusBadgeProps {
  status: 'upcoming' | 'completed' | 'cancelled';
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'upcoming':
        return {
          container: styles.statusUpcoming,
          text: styles.statusTextUpcoming
        };
      case 'completed':
        return {
          container: styles.statusCompleted,
          text: styles.statusTextCompleted
        };
      case 'cancelled':
        return {
          container: styles.statusCancelled,
          text: styles.statusTextCancelled
        };
      default:
        return {
          container: styles.statusUpcoming,
          text: styles.statusTextUpcoming
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <View style={statusStyles.container}>
      <Text style={statusStyles.text}>
        {status.toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusUpcoming: {
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTextUpcoming: {
    color: '#1E40AF',
    fontSize: 10,
    fontWeight: '700',
  },
  statusCompleted: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTextCompleted: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '700',
  },
  statusCancelled: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTextCancelled: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '700',
  },
});
