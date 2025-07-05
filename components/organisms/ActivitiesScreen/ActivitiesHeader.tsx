import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ActivitiesHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function ActivitiesHeader({ 
  title = "My Donation Activities",
  subtitle = "Track your donation history and status"
}: ActivitiesHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <Text style={styles.headerSubtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FAFBFC',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
});
