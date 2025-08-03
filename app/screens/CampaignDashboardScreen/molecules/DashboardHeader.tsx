import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HeaderButton from "../atoms/HeaderButton";
import { DashboardHeaderProps } from "../types";

export default function DashboardHeader({
  title,
  onBack,
  onAdd,
}: DashboardHeaderProps) {
  return (
    <View style={styles.header}>
      <HeaderButton icon="arrow-back" onPress={onBack} />

      <Text style={styles.headerTitle}>{title}</Text>

      <HeaderButton icon="add" color="#FF4757" onPress={onAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
});
