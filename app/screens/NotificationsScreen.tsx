import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BottomTabBar from "../../components/organisms/BottomTabBar";

// Define types
type NotificationType = 'emergency' | 'campaign' | 'appointment' | 'reminder' | 'achievement';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
  actionRequired?: boolean;
}

export default function NotificationsScreen({ navigation }: { navigation?: any }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'emergency',
      title: 'Urgent Blood Request',
      message: 'City General Hospital needs O+ blood donors urgently. 2 hours remaining.',
      timestamp: '2 min ago',
      isRead: false,
      priority: 'high',
      actionRequired: true
    },
    {
      id: 2,
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your blood donation appointment is scheduled for tomorrow at 10:00 AM.',
      timestamp: '1 hour ago',
      isRead: false,
      priority: 'medium'
    },
    {
      id: 3,
      type: 'campaign',
      title: 'New Campaign Available',
      message: 'University Blood Drive campaign is now open for registration.',
      timestamp: '3 hours ago',
      isRead: true,
      priority: 'medium'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Milestone Reached!',
      message: 'Congratulations! You have completed 12 donations and earned Silver Donor status.',
      timestamp: '1 day ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: 5,
      type: 'reminder',
      title: 'Health Check Reminder',
      message: 'Remember to maintain your health before your next donation.',
      timestamp: '2 days ago',
      isRead: true,
      priority: 'low'
    },
    {
      id: 6,
      type: 'emergency',
      title: 'Emergency Resolved',
      message: 'Thank you! The emergency request at Negombo General Hospital has been fulfilled.',
      timestamp: '3 days ago',
      isRead: true,
      priority: 'medium'
    }
  ]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'emergency':
        return 'warning';
      case 'campaign':
        return 'megaphone';
      case 'appointment':
        return 'calendar';
      case 'reminder':
        return 'time';
      case 'achievement':
        return 'trophy';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: NotificationType, priority: string) => {
    if (priority === 'high') return '#dc2626';
    
    switch (type) {
      case 'emergency':
        return '#dc2626';
      case 'campaign':
        return '#2563eb';
      case 'appointment':
        return '#059669';
      case 'reminder':
        return '#d97706';
      case 'achievement':
        return '#7c3aed';
      default:
        return '#6b7280';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);
    
    // Handle different notification actions
    switch (notification.type) {
      case 'emergency':
        // Navigate to emergency details or donation flow
        console.log('Navigate to emergency donation');
        break;
      case 'appointment':
        // Navigate to appointment details
        console.log('Navigate to appointment details');
        break;
      case 'campaign':
        // Navigate to campaign details
        console.log('Navigate to campaign details');
        break;
      default:
        console.log('Notification opened:', notification.title);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const iconColor = getNotificationColor(notification.type, notification.priority);
    
    return (
      <TouchableOpacity
        style={[
          styles.notificationCard,
          !notification.isRead && styles.unreadCard
        ]}
        onPress={() => handleNotificationPress(notification)}
        activeOpacity={0.7}
      >
        <View style={styles.notificationHeader}>
          <View style={[styles.notificationIcon, { backgroundColor: `${iconColor}15` }]}>
            <Ionicons 
              name={getNotificationIcon(notification.type)} 
              size={20} 
              color={iconColor} 
            />
          </View>
          
          <View style={styles.notificationContent}>
            <View style={styles.notificationTitleRow}>
              <Text style={[
                styles.notificationTitle,
                !notification.isRead && styles.unreadTitle
              ]}>
                {notification.title}
              </Text>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </View>
            
            <Text style={styles.notificationMessage}>
              {notification.message}
            </Text>
            
            <View style={styles.notificationFooter}>
              <Text style={styles.notificationTime}>
                {notification.timestamp}
              </Text>
              {notification.actionRequired && (
                <View style={styles.actionBadge}>
                  <Text style={styles.actionBadgeText}>Action Required</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {notification.priority === 'high' && (
          <View style={styles.highPriorityBorder} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllButtonText}>Mark All Read</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notifications List */}
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="notifications-off" size={48} color="#9ca3af" />
            </View>
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptyMessage}>
              You're all caught up! We'll notify you when there's something new.
            </Text>
          </View>
        ) : (
          <View style={styles.notificationsContainer}>
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </View>
        )}
        
        <View style={styles.bottomPadding} />
      </ScrollView>

      <BottomTabBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(243, 244, 246, 0.6)',
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  headerBadge: {
    backgroundColor: '#dc2626',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markAllButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  notificationsContainer: {
    gap: 12,
  },
  notificationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 231, 235, 0.5)',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  unreadDot: {
    width: 8,
    height: 8,
    backgroundColor: '#dc2626',
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actionBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  actionBadgeText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#92400e',
  },
  highPriorityBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#dc2626',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});