import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import NotificationIcon from '../../atoms/NotificationsScreen/NotificationIcon';
import UnreadDot from '../../atoms/NotificationsScreen/UnreadDot';
import ActionBadge from '../../atoms/NotificationsScreen/ActionBadge';
import { Notification } from '../../../types/notifications';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export default function NotificationCard({ notification, onPress }: NotificationCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !notification.isRead && styles.unreadCard
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationHeader}>
        <NotificationIcon 
          type={notification.type} 
          priority={notification.priority}
        />
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationTitleRow}>
            <Text style={[
              styles.notificationTitle,
              !notification.isRead && styles.unreadTitle
            ]}>
              {notification.title}
            </Text>
            {!notification.isRead && <UnreadDot />}
          </View>
          
          <Text style={styles.notificationMessage}>
            {notification.message}
          </Text>
          
          <View style={styles.notificationFooter}>
            <Text style={styles.notificationTime}>
              {notification.timestamp}
            </Text>
            {notification.actionRequired && <ActionBadge />}
          </View>
        </View>
      </View>

      {notification.priority === 'high' && (
        <View style={styles.highPriorityBorder} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
    borderLeftColor: '#FF4757',
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  highPriorityBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FF4757',
  },
});
