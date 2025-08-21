import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FloatingButtonProps {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  hasNotification?: boolean;
}

export default function FloatingButton({
  onPress,
  iconName,
  hasNotification = false,
}: FloatingButtonProps) {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <Ionicons name={iconName} size={24} color="white" />
      {/* Temporarily disabled notification badge */}
      {/* {hasNotification && <View style={styles.notificationBadge} />} */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "white",
  },
});
