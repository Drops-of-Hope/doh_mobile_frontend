import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NotificationType } from "../../../types/notifications";

interface NotificationIconProps {
  type: NotificationType;
  priority?: "high" | "medium" | "low";
}

export default function NotificationIcon({
  type,
  priority = "medium",
}: NotificationIconProps) {
  const getNotificationIcon = (notificationType: NotificationType) => {
    switch (notificationType) {
      case "emergency":
        return "warning";
      case "campaign":
        return "megaphone";
      case "appointment":
        return "calendar";
      case "reminder":
        return "time";
      case "achievement":
        return "trophy";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (
    notificationType: NotificationType,
    priorityLevel: string,
  ) => {
    if (priorityLevel === "high") return "#FF4757";

    switch (notificationType) {
      case "emergency":
        return "#FF4757";
      case "campaign":
        return "#3B82F6";
      case "appointment":
        return "#00D2D3";
      case "reminder":
        return "#F59E0B";
      case "achievement":
        return "#5F27CD";
      default:
        return "#6B7280";
    }
  };

  const iconColor = getNotificationColor(type, priority);

  return (
    <View style={[styles.notificationIcon, { backgroundColor: iconColor }]}>
      <Ionicons name={getNotificationIcon(type)} size={20} color="white" />
    </View>
  );
}

const styles = StyleSheet.create({
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
