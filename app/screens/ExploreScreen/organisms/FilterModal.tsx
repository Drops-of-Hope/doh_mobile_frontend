import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FilterCriteria } from "../types";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterCriteria) => void;
  onClear: () => void;
  initialFilters: FilterCriteria;
}

export default function FilterModal({
  visible,
  onClose,
  onApply,
  onClear,
  initialFilters,
}: FilterModalProps) {
  const [filterLocation, setFilterLocation] = useState(initialFilters.location);
  const [filterDate, setFilterDate] = useState(initialFilters.date);

  const handleApply = () => {
    onApply({
      location: filterLocation,
      date: filterDate,
    });
    onClose();
  };

  const handleClear = () => {
    setFilterLocation("");
    setFilterDate("");
    onClear();
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Campaigns</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.filterLabel}>Location</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Enter location (e.g., Colombo)"
              value={filterLocation}
              onChangeText={setFilterLocation}
              placeholderTextColor="#999"
            />

            <Text style={styles.filterLabel}>Date</Text>
            <TextInput
              style={styles.filterInput}
              placeholder="Enter date (YYYY-MM-DD)"
              value={filterDate}
              onChangeText={setFilterDate}
              placeholderTextColor="#999"
            />
          </ScrollView>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
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
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    maxHeight: 400,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    marginTop: 16,
  },
  filterInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  modalButtons: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "#3B82F6",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
