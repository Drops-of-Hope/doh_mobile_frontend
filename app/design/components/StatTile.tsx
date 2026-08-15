import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";

interface StatTileProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

// A single stat within a StatRow — no border of its own, separated by
// hairline dividers drawn by the parent row.
export const StatTile: React.FC<StatTileProps> = ({ value, label, icon }) => (
  <View style={styles.tile}>
    {icon}
    <Text variant="h1" style={styles.value}>
      {value}
    </Text>
    <Text variant="caption" tone="inkMuted">
      {label}
    </Text>
  </View>
);

interface StatRowProps {
  children: React.ReactNode;
}

export const StatRow: React.FC<StatRowProps> = ({ children }) => {
  const theme = useTheme();
  const items = React.Children.toArray(children);
  return (
    <View
      style={[
        styles.row,
        { borderColor: theme.color.hairline, borderRadius: theme.radius.lg, backgroundColor: theme.color.surface },
      ]}
    >
      {items.map((child, i) => (
        <React.Fragment key={i}>
          <View style={styles.cell}>{child}</View>
          {i < items.length - 1 ? <View style={[styles.divider, { backgroundColor: theme.color.hairline }]} /> : null}
        </React.Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: { alignItems: "center", gap: 2 },
  value: { fontSize: 24, lineHeight: 28 },
  row: {
    flexDirection: "row",
    borderWidth: 1.5,
    paddingVertical: 16,
  },
  cell: { flex: 1, alignItems: "center" },
  divider: { width: 1.5, alignSelf: "stretch", marginVertical: 2 },
});

export default StatTile;
