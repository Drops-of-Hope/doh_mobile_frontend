import React, { useState } from "react";
import { View, TextInput, TextInputProps, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";

interface FieldProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Field: React.FC<FieldProps> = ({
  label,
  helperText,
  error,
  required,
  leftIcon,
  rightIcon,
  style,
  onFocus,
  onBlur,
  multiline,
  ...rest
}) => {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  const borderColor = error ? theme.color.danger : focused ? theme.color.crimson : theme.color.hairline;
  const bg = error ? theme.color.dangerSoft : focused ? theme.color.surface : theme.color.surfaceSunken;

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
          styles.inputRow,
          {
            borderColor,
            backgroundColor: bg,
            borderRadius: theme.radius.md,
            minHeight: multiline ? 96 : 48,
            alignItems: multiline ? "flex-start" : "center",
          },
        ]}
      >
        {leftIcon ? <View style={styles.icon}>{leftIcon}</View> : null}
        <TextInput
          style={[
            styles.input,
            { color: theme.color.ink, textAlignVertical: multiline ? "top" : "center" },
            style,
          ]}
          placeholderTextColor={theme.color.inkFaint}
          multiline={multiline}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {rightIcon ? <View style={styles.icon}>{rightIcon}</View> : null}
      </View>
      {error ? (
        <Text variant="caption" tone="danger" style={styles.helper}>
          {error}
        </Text>
      ) : helperText ? (
        <Text variant="caption" tone="inkFaint" style={styles.helper}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { marginBottom: 6 },
  inputRow: {
    flexDirection: "row",
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  icon: { marginHorizontal: 4 },
  helper: { marginTop: 6, marginLeft: 2 },
});

export default Field;
