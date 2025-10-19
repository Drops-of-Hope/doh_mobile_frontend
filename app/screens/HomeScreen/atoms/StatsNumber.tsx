import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatsNumberProps {
  number: number;
  label: string;
  secondaryLabel?: string;
}

export default function StatsNumber({
  number,
  label,
  secondaryLabel,
}: StatsNumberProps) {
  return (
    <View style={styles.statsCenter}>
      <Text style={styles.statsNumber}>{number}</Text>
      <View style={styles.statsLabelContainer}>
        <Text style={styles.statsLabel}>{label}</Text>
        {secondaryLabel && (
          <Text style={styles.statsLabel}>{secondaryLabel}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 24,
    width: "100%",
  },
  statsNumber: {
    fontSize: 64,
    fontWeight: "900",
    color: "#dc2626", // Red color for blood donation theme
    marginRight: 20,
    lineHeight: 70,
  },
  statsLabelContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    flex: 1,
  },
  statsLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    lineHeight: 24,
  },
});
