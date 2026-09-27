import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { MapPin, CalendarDays } from "lucide-react-native";
import { Sheet, Field, Button, Icon, useTheme } from "../../../design";
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
  const theme = useTheme();
  const [filterLocation, setFilterLocation] = useState(initialFilters.location);
  const [filterDate, setFilterDate] = useState(initialFilters.date);

  useEffect(() => {
    if (visible) {
      setFilterLocation(initialFilters.location);
      setFilterDate(initialFilters.date);
    }
  }, [visible, initialFilters.location, initialFilters.date]);

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
    <Sheet visible={visible} onClose={onClose} title="Filter Campaigns">
      <Field
        label="Location"
        placeholder="Enter location (e.g., Colombo)"
        value={filterLocation}
        onChangeText={setFilterLocation}
        leftIcon={<Icon icon={MapPin} size={18} color={theme.color.inkFaint} />}
      />
      <Field
        label="Date"
        placeholder="Enter date (YYYY-MM-DD)"
        value={filterDate}
        onChangeText={setFilterDate}
        leftIcon={<Icon icon={CalendarDays} size={18} color={theme.color.inkFaint} />}
      />

      <View style={styles.buttonRow}>
        <View style={styles.buttonHalf}>
          <Button title="Clear All" variant="outline" onPress={handleClear} />
        </View>
        <View style={styles.buttonHalf}>
          <Button title="Apply Filters" variant="solid" onPress={handleApply} />
        </View>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  buttonHalf: {
    flex: 1,
  },
});
