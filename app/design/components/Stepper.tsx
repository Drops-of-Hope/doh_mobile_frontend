import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { Minus, Plus } from "lucide-react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { Icon } from "../Icon";

interface StepperProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  required?: boolean;
}

export const Stepper: React.FC<StepperProps> = ({ label, value, min = 0, max = 9999, step = 1, onChange, required }) => {
  const theme = useTheme();
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="label" tone="inkMuted" style={styles.label}>
          {label}
          {required ? <Text variant="label" tone="crimson"> *</Text> : null}
        </Text>
      ) : null}
      <View
        style={[
          styles.row,
          { borderColor: theme.color.hairline, backgroundColor: theme.color.surfaceSunken, borderRadius: theme.radius.md },
        ]}
      >
        <Pressable onPress={dec} style={styles.btn} hitSlop={8}>
          <Icon icon={Minus} size={18} />
        </Pressable>
        <Text variant="h3">{value}</Text>
        <Pressable onPress={inc} style={styles.btn} hitSlop={8}>
          <Icon icon={Plus} size={18} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { marginBottom: 6 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btn: { padding: 6 },
});

export default Stepper;
