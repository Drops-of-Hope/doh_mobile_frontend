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
    if (priority === 'high') return '#FF4757';
    
    switch (type) {
      case 'emergency':
        return '#FF4757';
      case 'campaign':
        return '#3B82F6';
      case 'appointment':
        return '#00D2D3';
      case 'reminder':
        return '#F59E0B';
      case 'achievement':
        return '#5F27CD';
      default:
        return '#6B7280';
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
          <View style={[styles.notificationIcon, { backgroundColor: iconColor }]}>
            <Ionicons 
              name={getNotificationIcon(notification.type)} 
              size={20} 
              color="white" 
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
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
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
              <Ionicons name="notifications-off" size={48} color="#9CA3AF" />
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
    backgroundColor: '#FAFBFC',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FAFBFC',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: '#FF4757',
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    shadowColor: '#FF4757',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  markAllButtonText: {
    color: '#5F27CD',
    fontSize: 14,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  notificationsContainer: {
    gap: 12,
  },
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
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  unreadDot: {
    width: 10,
    height: 10,
    backgroundColor: '#FF4757',
    borderRadius: 5,
    marginLeft: 8,
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
  actionBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  highPriorityBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#FF4757',
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
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 24,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 24,
  },
});