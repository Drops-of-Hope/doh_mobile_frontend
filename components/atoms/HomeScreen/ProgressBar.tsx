import React from 'react';
import { View, StyleSheet } from 'react-native';
import { UrgencyLevel } from './UrgencyBadge';

interface ProgressBarProps {
  current: number;
  total: number;
  urgency?: UrgencyLevel;
}

export default function ProgressBar({ current, total, urgency = 'Moderate' }: ProgressBarProps) {
  const getProgressColor = (level: UrgencyLevel): string => {
    switch(level) {
      case 'Critical': return '#FF4757';
      case 'Moderate': return '#3B82F6';
      case 'Low': return '#00D2D3';
      default: return '#3B82F6';
    }
  };

  const progressWidth = (current / total) * 100;
  const progressColor = getProgressColor(urgency);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${progressWidth}%`,
              backgroundColor: progressColor
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
