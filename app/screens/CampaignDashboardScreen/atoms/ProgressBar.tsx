import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ProgressBarProps } from "../types";
import { formatProgressPercentage } from "../utils";

export default function ProgressBar({ progress, color }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.progressBarContainer}>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${clampedProgress}%`, backgroundColor: color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>
        {formatProgressPercentage(progress)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    marginRight: 12,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    minWidth: 50,
  },
});
