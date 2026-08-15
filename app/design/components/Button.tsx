import React from "react";
import { Pressable, ActivityIndicator, View, StyleSheet, PressableProps, GestureResponderEvent } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";

type Variant = "solid" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends Omit<PressableProps, "style"> {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  onPress?: (e: GestureResponderEvent) => void;
}

const SIZE_MAP: Record<Size, { vPad: number; hPad: number; fontVariant: "label" | "body" | "h3" }> = {
  sm: { vPad: 8, hPad: 14, fontVariant: "label" },
  md: { vPad: 13, hPad: 18, fontVariant: "body" },
  lg: { vPad: 16, hPad: 22, fontVariant: "h3" },
};

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "solid",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  icon,
  onPress,
  ...rest
}) => {
  const theme = useTheme();
  const dims = SIZE_MAP[size];
  const isDisabled = disabled || loading;

  const palette = {
    solid: { bg: theme.color.crimson, border: theme.color.crimson, text: theme.color.inverse },
    outline: { bg: "transparent", border: theme.color.crimson, text: theme.color.crimson },
    ghost: { bg: "transparent", border: "transparent", text: theme.color.ink },
    danger: { bg: "transparent", border: theme.color.danger, text: theme.color.danger },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isDisabled ? theme.color.surfaceSunken : palette.bg,
          borderColor: isDisabled ? theme.color.hairline : palette.border,
          borderWidth: variant === "ghost" ? 0 : 1.5,
          paddingVertical: dims.vPad,
          paddingHorizontal: dims.hPad,
          borderRadius: theme.radius.md,
          alignSelf: fullWidth ? "stretch" : "flex-start",
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={isDisabled ? theme.color.inkFaint : palette.text} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            variant={dims.fontVariant === "body" ? "bodyBold" : dims.fontVariant}
            style={{ color: isDisabled ? theme.color.inkFaint : palette.text }}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

export default Button;
