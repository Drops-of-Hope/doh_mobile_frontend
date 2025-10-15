import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface LogoutButtonProps {
  onPress: () => void;
  title?: string;
}

export default function LogoutButton({ onPress, title = "Log Out" }: LogoutButtonProps) {
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={onPress}>
      <Ionicons name="log-out-outline" size={20} color={COLORS.BACKGROUND} />
      <Text style={styles.logoutText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoutButton: {
    backgroundColor: COLORS.ERROR,
    marginHorizontal: SPACING.MD,
    marginVertical: SPACING.MD,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: BORDER_RADIUS.LG,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    color: COLORS.BACKGROUND,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: SPACING.SM,
  },
});