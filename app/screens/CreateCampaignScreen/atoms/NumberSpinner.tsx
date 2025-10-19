import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS } from "../../../../constants/theme";

interface NumberSpinnerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
  required?: boolean;
}

export default function NumberSpinner({
  label,
  value,
  onChange,
  min = 1,
  max = 9999,
  step = 1,
  error,
  required = false,
}: NumberSpinnerProps) {
  const numericValue = parseInt(value, 10) || min;

  const handleIncrement = () => {
    const newValue = Math.min(numericValue + step, max);
    onChange(newValue.toString());
  };

  const handleDecrement = () => {
    const newValue = Math.max(numericValue - step, min);
    onChange(newValue.toString());
  };

  const handleTextChange = (text: string) => {
    // Allow empty string while typing
    if (text === "") {
      onChange("");
      return;
    }

    // Only allow numbers
    const numValue = parseInt(text.replace(/[^0-9]/g, ""), 10);
    
    if (!isNaN(numValue)) {
      // Apply min/max constraints
      const constrainedValue = Math.max(min, Math.min(max, numValue));
      onChange(constrainedValue.toString());
    }
  };

  const showLargeNumberWarning = numericValue > 100;

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      </View>

      <View style={[styles.spinnerContainer, error && styles.spinnerContainerError]}>
        <TouchableOpacity
          style={[styles.button, numericValue <= min && styles.buttonDisabled]}
          onPress={handleDecrement}
          disabled={numericValue <= min}
        >
          <Ionicons
            name="remove"
            size={24}
            color={numericValue <= min ? COLORS.TEXT_MUTED : COLORS.PRIMARY}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          placeholder={min.toString()}
          placeholderTextColor={COLORS.TEXT_MUTED}
          textAlign="center"
        />

        <TouchableOpacity
          style={[styles.button, numericValue >= max && styles.buttonDisabled]}
          onPress={handleIncrement}
          disabled={numericValue >= max}
        >
          <Ionicons
            name="add"
            size={24}
            color={numericValue >= max ? COLORS.TEXT_MUTED : COLORS.PRIMARY}
          />
        </TouchableOpacity>
      </View>

      {showLargeNumberWarning && !error && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={16} color={COLORS.WARNING} />
          <Text style={styles.warningText}>
            You are expecting a large number of donors ({numericValue}). Please make sure you entered the right amount.
          </Text>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.MD,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.XS,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
  },
  required: {
    color: COLORS.ERROR,
    fontSize: 14,
  },
  spinnerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    borderRadius: BORDER_RADIUS.MD,
    backgroundColor: COLORS.BACKGROUND,
    overflow: "hidden",
  },
  spinnerContainerError: {
    borderColor: COLORS.ERROR,
  },
  button: {
    padding: SPACING.SM + SPACING.XS,
    backgroundColor: COLORS.BACKGROUND_SECONDARY,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 50,
  },
  buttonDisabled: {
    backgroundColor: COLORS.BACKGROUND_TERTIARY,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.TEXT_PRIMARY,
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.MD,
    textAlign: "center",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: SPACING.XS,
    marginTop: SPACING.XS,
    padding: SPACING.SM,
    backgroundColor: `${COLORS.WARNING}15`,
    borderRadius: BORDER_RADIUS.SM,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.WARNING,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: COLORS.WARNING,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.ERROR,
    marginTop: SPACING.XS,
    marginLeft: SPACING.XS,
  },
});
