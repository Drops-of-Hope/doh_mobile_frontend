import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BackButton from "../atoms/BackButton";

interface NotificationsHeaderProps {
  unreadCount: number;
  onBack: () => void;
  onMarkAllRead: () => void;
}

export default function NotificationsHeader({
  unreadCount,
  onBack,
  onMarkAllRead,
}: NotificationsHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <BackButton onPress={onBack} />

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.markAllButton} onPress={onMarkAllRead}>
          <Text style={styles.markAllButtonText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: "#FAFBFC",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
  headerBadge: {
    backgroundColor: "#FF4757",
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    shadowColor: "#FF4757",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  headerBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  markAllButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  markAllButtonText: {
    color: "#5F27CD",
    fontSize: 14,
    fontWeight: "700",
  },
});
