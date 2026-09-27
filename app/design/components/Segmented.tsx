import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";

export interface SegmentOption {
  label: string;
  value: string;
}

interface SegmentedProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
}

// A tab-like segmented control — distinct from Chip so a screen's primary
// view switch doesn't look identical to its secondary filter row.
export const Segmented: React.FC<SegmentedProps> = ({ options, value, onChange }) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.wrap,
        { borderColor: theme.color.hairline, borderRadius: theme.radius.pill, backgroundColor: theme.color.surface },
      ]}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.segment,
              {
                borderRadius: theme.radius.pill,
                backgroundColor: active ? theme.color.crimsonSoft : "transparent",
              },
            ]}
          >
            <Text variant="label" tone={active ? "crimson" : "inkMuted"}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", borderWidth: 1.5, padding: 3, gap: 3 },
  segment: { flex: 1, alignItems: "center", paddingVertical: 8 },
});

export default Segmented;
