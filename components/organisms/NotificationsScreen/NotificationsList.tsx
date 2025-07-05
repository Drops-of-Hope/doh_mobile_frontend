import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import NotificationCard from '../../molecules/NotificationsScreen/NotificationCard';
import { Notification } from '../../../types/notifications';

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationPress: (notification: Notification) => void;
}

export default function NotificationsList({ notifications, onNotificationPress }: NotificationsListProps) {
  return (
    <ScrollView 
      style={styles.scrollView} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.notificationsContainer}>
        {notifications.map((notification) => (
          <NotificationCard 
            key={notification.id} 
            notification={notification} 
            onPress={onNotificationPress}
          />
        ))}
      </View>
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  notificationsContainer: {
    gap: 12,
  },
  bottomPadding: {
    height: 24,
  },
});
