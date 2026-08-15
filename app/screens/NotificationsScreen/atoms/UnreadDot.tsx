import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../../../design";

export default function UnreadDot() {
  const theme = useTheme();
  return <View style={[styles.unreadDot, { backgroundColor: theme.color.crimson }]} />;
}

const styles = StyleSheet.create({
  unreadDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
});
