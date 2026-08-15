import React from "react";
import { View, StyleSheet } from "react-native";
import { TriangleAlert, Megaphone, Calendar, Clock, Trophy, Bell, LucideIcon } from "lucide-react-native";
import { Icon, useTheme } from "../../../design";
import { NotificationType } from "../../../../types/notifications";

interface NotificationIconProps {
  type: NotificationType;
  priority?: "high" | "medium" | "low";
}

const TYPE_ICON: Record<NotificationType, LucideIcon> = {
  emergency: TriangleAlert,
  campaign: Megaphone,
  appointment: Calendar,
  reminder: Clock,
  achievement: Trophy,
} as any;

export default function NotificationIcon({ type, priority = "medium" }: NotificationIconProps) {
  const theme = useTheme();

  const getColor = (): string => {
    if (priority === "high") return theme.color.danger;
    switch (type) {
      case "emergency":
        return theme.color.danger;
      case "campaign":
        return theme.color.info;
      case "appointment":
        return theme.color.crimson;
      case "reminder":
        return theme.color.warning;
      case "achievement":
        return theme.color.badge.DIAMOND;
      default:
        return theme.color.inkMuted;
    }
  };

  const color = getColor();
  const IconComp = TYPE_ICON[type] ?? Bell;

  return (
    <View
      style={[styles.notificationIcon, { backgroundColor: `${color}1A`, borderRadius: theme.radius.md }]}
    >
      <Icon icon={IconComp} size={20} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  notificationIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
});
