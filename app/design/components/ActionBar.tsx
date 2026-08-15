import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "../ThemeProvider";
import { useTabBarHeight } from "../useTabBarHeight";

interface ActionBarProps {
  children: React.ReactNode;
}

// A footer that sits above the app's tab bar as a real layout sibling
// (never absolutely positioned), for screens whose primary action must stay
// reachable regardless of scroll position — e.g. Save/Discard on a form.
export const ActionBar: React.FC<ActionBarProps> = ({ children }) => {
  const theme = useTheme();
  const tabBarHeight = useTabBarHeight();

  return (
    <View
      style={[
        styles.wrap,
        {
          borderTopColor: theme.color.hairline,
          backgroundColor: theme.color.paper,
          paddingHorizontal: theme.space.xl,
          paddingTop: theme.space.md,
          paddingBottom: theme.space.md + tabBarHeight,
        },
      ]}
    >
      <View style={styles.row}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { borderTopWidth: 1.5 },
  row: { flexDirection: "row", gap: 12 },
});

export default ActionBar;
