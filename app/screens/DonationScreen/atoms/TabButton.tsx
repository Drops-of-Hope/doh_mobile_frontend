import React from "react";
import { Pressable, View, StyleSheet, ViewStyle } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { Text, Icon, useTheme } from "../../../design";

interface TabButtonProps {
  title: string;
  icon: LucideIcon;
  isActive: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export default function TabButton({ title, icon, isActive, onPress, style }: TabButtonProps) {
  const theme = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.tabButton,
        {
          backgroundColor: isActive ? theme.color.surface : "transparent",
          borderColor: isActive ? theme.color.hairlineStrong : "transparent",
          borderRadius: theme.radius.sm,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Icon icon={icon} size={16} color={isActive ? theme.color.crimson : theme.color.inkMuted} />
        <Text variant="label" tone={isActive ? "crimson" : "inkMuted"}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1.5,
  },
  content: { flexDirection: "row", alignItems: "center", gap: 6 },
});
