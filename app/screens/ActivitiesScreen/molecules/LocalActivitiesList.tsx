import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../../../../constants/theme';
import { LocalActivity } from '../../../services/localActivityService';

interface LocalActivityCardProps {
  activity: LocalActivity;
  onPress?: (activity: LocalActivity) => void;
}

function LocalActivityCard({ activity, onPress }: LocalActivityCardProps) {
  const getActivityIcon = (type: LocalActivity['type']) => {
    switch (type) {
      case 'appointment_created':
        return 'calendar';
      case 'campaign_created':
        return 'add-circle';
      case 'campaign_joined':
        return 'people';
      case 'donation_completed':
        return 'heart';
      case 'profile_updated':
        return 'person';
      default:
        return 'information-circle';
    }
  };

  const getActivityColor = (type: LocalActivity['type']) => {
    switch (type) {
      case 'appointment_created':
        return COLORS.INFO;
      case 'campaign_created':
        return COLORS.SUCCESS;
      case 'campaign_joined':
        return COLORS.PRIMARY;
      case 'donation_completed':
        return COLORS.PRIMARY;
      case 'profile_updated':
        return COLORS.SECONDARY;
      default:
        return COLORS.TEXT_SECONDARY;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      // Ensure diffInMinutes is a valid number
      if (isNaN(diffInMinutes)) {
        return 'Just now';
      }
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      // Ensure hours is a valid number
      if (isNaN(hours)) {
        return 'Recently';
      }
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      // Ensure days is a valid number
      if (isNaN(days)) {
        return 'Recently';
      }
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(activity)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: getActivityColor(activity.type) + '20' }]}>
          <Ionicons
            name={getActivityIcon(activity.type) as any}
            size={20}
            color={getActivityColor(activity.type)}
          />
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.title}>{activity.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {activity.description}
          </Text>
          <Text style={styles.timestamp}>{formatDate(activity.timestamp)}</Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={16}
          color={COLORS.TEXT_MUTED}
        />
      </View>
    </TouchableOpacity>
  );
}

interface LocalActivitiesListProps {
  activities: LocalActivity[];
  onActivityPress?: (activity: LocalActivity) => void;
  emptyMessage?: string;
}

export default function LocalActivitiesList({
  activities,
  onActivityPress,
  emptyMessage = "No activities found",
}: LocalActivitiesListProps) {
  if (activities.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="time-outline" size={48} color={COLORS.TEXT_MUTED} />
        <Text style={styles.emptyTitle}>No Activities</Text>
        <Text style={styles.emptyMessage}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {activities.map((activity) => (
        <LocalActivityCard
          key={activity.id}
          activity={activity}
          onPress={onActivityPress}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.BACKGROUND,
    marginHorizontal: SPACING.MD,
    marginVertical: SPACING.XS,
    borderRadius: BORDER_RADIUS.MD,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.MD,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.LG,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.MD,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.TEXT_PRIMARY,
    marginBottom: SPACING.XS,
  },
  description: {
    fontSize: 14,
    color: COLORS.TEXT_SECONDARY,
    lineHeight: 20,
    marginBottom: SPACING.XS,
  },
  timestamp: {
    fontSize: 12,
    color: COLORS.TEXT_MUTED,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.XXL,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.TEXT_SECONDARY,
    marginTop: SPACING.MD,
    marginBottom: SPACING.SM,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.TEXT_MUTED,
    textAlign: 'center',
    paddingHorizontal: SPACING.XL,
  },
});