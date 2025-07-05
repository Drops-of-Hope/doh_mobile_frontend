import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StatusIndicatorProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  backgroundColor?: string;
}

export default function StatusIndicator({ 
  title, 
  subtitle, 
  icon, 
  iconColor = '#00D2D3',
  backgroundColor = '#00D2D3'
}: StatusIndicatorProps) {
  return (
    <View style={styles.statusRow}>
      <View style={[styles.statusIcon, { backgroundColor }]}>
        <Ionicons name={icon} size={20} color="white" />
      </View>
      <View style={styles.statusContent}>
        <Text style={styles.statusTitle}>{title}</Text>
        <Text style={styles.statusSubtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
