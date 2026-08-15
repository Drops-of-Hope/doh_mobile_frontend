import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { useTheme } from "../ThemeProvider";
import { Text } from "./Text";
import { Icon } from "../Icon";

interface AppBarProps {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  transparent?: boolean;
}

export const AppBar: React.FC<AppBarProps> = ({ title, onBack, right, transparent = false }) => {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: transparent ? "transparent" : theme.color.paper,
          borderBottomColor: transparent ? "transparent" : theme.color.hairline,
        },
      ]}
    >
      <View style={styles.side}>
        {onBack ? (
          <Pressable onPress={onBack} hitSlop={12} style={styles.backBtn}>
            <Icon icon={ChevronLeft} size={24} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>
        {title ? (
          <Text variant="h3" numberOfLines={1}>
            {title}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.rightSide]}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    paddingHorizontal: 8,
    borderBottomWidth: 1.5,
  },
  side: { width: 56, justifyContent: "center" },
  rightSide: { alignItems: "flex-end" },
  center: { flex: 1, alignItems: "center" },
  backBtn: { padding: 8 },
});

export default AppBar;
