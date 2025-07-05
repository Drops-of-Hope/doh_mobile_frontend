import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import BottomTabBar from "../../components/organisms/BottomTabBar";
import NotificationsHeader from "../../components/molecules/NotificationsScreen/NotificationsHeader";
import NotificationsList from "../../components/organisms/NotificationsScreen/NotificationsList";
import EmptyNotifications from "../../components/molecules/NotificationsScreen/EmptyNotifications";
import { NotificationType, Notification } from "../../types/notifications";

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
      
      <NotificationsHeader 
        unreadCount={unreadCount}
        onMarkAllRead={markAllAsRead}
        onBack={() => navigation?.goBack()}
      />

      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <NotificationsList 
          notifications={notifications}
          onNotificationPress={handleNotificationPress}
        />
      )}

      <BottomTabBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
});