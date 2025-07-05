import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UrgencyBadge, { UrgencyLevel } from '../../atoms/HomeScreen/UrgencyBadge';
import ProgressBar from '../../atoms/HomeScreen/ProgressBar';

export interface Campaign {
  id: number;
  title: string;
  date: string;
  location: string;
  slotsUsed: number;
  totalSlots: number;
  urgency: UrgencyLevel;
}

interface CampaignCardProps {
  campaign: Campaign;
  onPress?: (campaign: Campaign) => void;
}

export default function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  return (
    <View style={styles.campaignCard}>
      <View style={styles.campaignHeader}>
        <UrgencyBadge urgency={campaign.urgency} />
        <Text style={styles.campaignDate}>{campaign.date}</Text>
      </View>
      
      <Text style={styles.campaignTitle}>{campaign.title}</Text>
      
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#8E8E93" />
        <Text style={styles.locationText}>{campaign.location}</Text>
      </View>
      
      <View style={styles.slotsContainer}>
        <Text style={styles.slotsText}>
          {campaign.slotsUsed}/{campaign.totalSlots} slots filled
        </Text>
      </View>
      
      <ProgressBar 
        current={campaign.slotsUsed} 
        total={campaign.totalSlots} 
        urgency={campaign.urgency}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  campaignCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  campaignHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  campaignDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  campaignTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  slotsContainer: {
    marginBottom: 12,
  },
  slotsText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
