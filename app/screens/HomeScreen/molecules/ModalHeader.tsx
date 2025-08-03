import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
  return (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>{title}</Text>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
});
