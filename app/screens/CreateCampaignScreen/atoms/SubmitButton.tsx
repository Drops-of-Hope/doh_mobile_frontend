import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SubmitButtonProps } from "../types";

export default function SubmitButton({
  onSubmit,
  isSubmitting,
  title,
}: SubmitButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
      onPress={onSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={styles.submitButtonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
