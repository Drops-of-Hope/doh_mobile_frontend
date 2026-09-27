import React from "react";
import { View, StyleSheet } from "react-native";
import NotificationCard from "../molecules/NotificationCard";
import { Notification } from "../../../../types/notifications";

interface NotificationsListProps {
  notifications: Notification[];
  onNotificationPress: (notification: Notification) => void;
}

// Rendered inside NotificationsScreen's own scrolling <Screen>.
export default function NotificationsList({ notifications, onNotificationPress }: NotificationsListProps) {
  return (
    <View style={styles.notificationsContainer}>
      {notifications.map((notification) => (
        <NotificationCard key={notification.id} notification={notification} onPress={onNotificationPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  notificationsContainer: { gap: 12 },
});
