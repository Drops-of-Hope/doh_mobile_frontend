import React from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: React.ReactNode;
}

export const Chip: React.FC<ChipProps> = ({ label, selected = false, onPress, icon }) => {
  const theme = useTheme();
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={({ pressed }: any) => [
        styles.chip,
        {
          backgroundColor: selected ? theme.color.crimsonSoft : theme.color.surface,
          borderColor: selected ? theme.color.crimson : theme.color.hairline,
          borderRadius: theme.radius.pill,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon}
      <Text variant="label" tone={selected ? "crimson" : "inkMuted"}>
        {label}
      </Text>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
});

export default Chip;
