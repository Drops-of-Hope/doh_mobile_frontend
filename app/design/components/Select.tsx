import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { Icon } from "../Icon";
import { Sheet } from "./Sheet";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export const Select: React.FC<SelectProps> = ({ label, placeholder = "Select", value, options, onChange, error, required }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <View style={styles.wrap}>
      {label ? (
        <Text variant="label" tone="inkMuted" style={styles.label}>
          {label}
          {required ? <Text variant="label" tone="crimson"> *</Text> : null}
        </Text>
      ) : null}
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.control,
          {
            borderColor: error ? theme.color.danger : theme.color.hairline,
            backgroundColor: theme.color.surfaceSunken,
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <Text variant="body" tone={selected ? "ink" : "inkFaint"}>
          {selected ? selected.label : placeholder}
        </Text>
        <Icon icon={ChevronDown} size={18} color={theme.color.inkMuted} />
      </Pressable>
      {error ? (
        <Text variant="caption" tone="danger" style={styles.helper}>
          {error}
        </Text>
      ) : null}

      <Sheet visible={open} onClose={() => setOpen(false)} title={label || placeholder}>
        {options.map((opt) => (
          <Pressable
            key={opt.value}
            onPress={() => {
              onChange(opt.value);
              setOpen(false);
            }}
            style={[styles.option, { borderBottomColor: theme.color.hairline }]}
          >
            <Text variant="body">{opt.label}</Text>
            {opt.value === value ? <Icon icon={Check} size={18} color={theme.color.crimson} /> : null}
          </Pressable>
        ))}
      </Sheet>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { marginBottom: 6 },
  control: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    minHeight: 48,
  },
  helper: { marginTop: 6, marginLeft: 2 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
});

export default Select;
