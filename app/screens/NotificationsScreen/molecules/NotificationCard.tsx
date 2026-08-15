import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Text, Surface, useTheme } from "../../../design";
import NotificationIcon from "../atoms/NotificationIcon";
import UnreadDot from "../atoms/UnreadDot";
import ActionBadge from "../atoms/ActionBadge";
import { Notification } from "../../../../types/notifications";

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

export default function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const theme = useTheme();
  return (
    <Pressable onPress={() => onPress(notification)}>
      <Surface
        style={[
          styles.notificationCard,
          !notification.isRead && { borderLeftWidth: 4, borderLeftColor: theme.color.crimson },
        ]}
      >
        <View style={styles.notificationHeader}>
          <NotificationIcon type={notification.type} priority={notification.priority} />

          <View style={styles.notificationContent}>
            <View style={styles.notificationTitleRow}>
              <Text variant={notification.isRead ? "bodyBold" : "h3"} style={styles.notificationTitle}>
                {notification.title}
              </Text>
              {!notification.isRead && <UnreadDot />}
            </View>

            <Text variant="body" tone="inkMuted" style={styles.notificationMessage}>
              {notification.message}
            </Text>

            <View style={styles.notificationFooter}>
              <Text variant="caption" tone="inkFaint">
                {notification.timestamp}
              </Text>
              {notification.actionRequired && <ActionBadge />}
            </View>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  notificationCard: {},
  notificationHeader: { flexDirection: "row", alignItems: "flex-start" },
  notificationContent: { flex: 1 },
  notificationTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  notificationTitle: { flex: 1 },
  notificationMessage: { marginBottom: 16, lineHeight: 20 },
  notificationFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
});
