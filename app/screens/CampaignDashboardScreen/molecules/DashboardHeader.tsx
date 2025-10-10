import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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

      {onAdd ? (
        <TouchableOpacity style={styles.createButton} onPress={onAdd}>
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 80 }} />
      )}
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
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E53E3E",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
