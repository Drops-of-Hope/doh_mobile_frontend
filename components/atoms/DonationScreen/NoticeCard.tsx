import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NoticeCardProps {
  title: string;
  message: string;
  type?: "warning" | "info" | "success" | "error";
}

export default function NoticeCard({
  title,
  message,
  type = "warning",
}: NoticeCardProps) {
  const getNoticeStyles = () => {
    switch (type) {
      case "warning":
        return {
          container: styles.warningContainer,
          titleColor: "#EA580C",
          textColor: "#C2410C",
          icon: "warning" as keyof typeof Ionicons.glyphMap,
          iconColor: "#EA580C",
        };
      case "info":
        return {
          container: styles.infoContainer,
          titleColor: "#1D4ED8",
          textColor: "#1E40AF",
          icon: "information-circle" as keyof typeof Ionicons.glyphMap,
          iconColor: "#1D4ED8",
        };
      case "success":
        return {
          container: styles.successContainer,
          titleColor: "#16A34A",
          textColor: "#15803D",
          icon: "checkmark-circle" as keyof typeof Ionicons.glyphMap,
          iconColor: "#16A34A",
        };
      case "error":
        return {
          container: styles.errorContainer,
          titleColor: "#DC2626",
          textColor: "#B91C1C",
          icon: "alert-circle" as keyof typeof Ionicons.glyphMap,
          iconColor: "#DC2626",
        };
      default:
        return {
          container: styles.warningContainer,
          titleColor: "#EA580C",
          textColor: "#C2410C",
          icon: "warning" as keyof typeof Ionicons.glyphMap,
          iconColor: "#EA580C",
        };
    }
  };

  const noticeStyles = getNoticeStyles();

  return (
    <View style={[styles.container, noticeStyles.container]}>
      <View style={styles.header}>
        <Ionicons
          name={noticeStyles.icon}
          size={20}
          color={noticeStyles.iconColor}
        />
        <Text style={[styles.title, { color: noticeStyles.titleColor }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.message, { color: noticeStyles.textColor }]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontWeight: "700",
    fontSize: 16,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  warningContainer: {
    backgroundColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  infoContainer: {
    backgroundColor: "#EFF6FF",
    borderColor: "#DBEAFE",
  },
  successContainer: {
    backgroundColor: "#F0FDF4",
    borderColor: "#BBF7D0",
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
});
