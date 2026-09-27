import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { AppBar, Text, useTheme } from "../../../design";

interface NotificationsHeaderProps {
  unreadCount: number;
  onBack: () => void;
  onMarkAllRead: () => void;
}

export default function NotificationsHeader({ unreadCount, onBack, onMarkAllRead }: NotificationsHeaderProps) {
  const theme = useTheme();
  return (
    <AppBar
      title={unreadCount > 0 ? `Notifications (${unreadCount})` : "Notifications"}
      onBack={onBack}
      right={
        <Pressable onPress={onMarkAllRead} style={styles.markAllButton}>
          <Text variant="label" tone="crimson">
            Mark All Read
          </Text>
        </Pressable>
      }
    />
  );
}

const styles = StyleSheet.create({
  markAllButton: { paddingHorizontal: 4, paddingVertical: 8 },
});
