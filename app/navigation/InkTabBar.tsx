import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { House, Compass, HeartPulse, CircleUserRound } from "lucide-react-native";
import { useTheme, Text, Icon, DropMark } from "../design";
import { TAB_BAR_PADDING_TOP, TAB_BAR_BORDER_WIDTH } from "../design/useTabBarHeight";

const TAB_ICONS: Record<string, any> = {
  HomeTab: House,
  ExploreTab: Compass,
  ActivitiesTab: HeartPulse,
  ProfileTab: CircleUserRound,
};

const TAB_LABELS: Record<string, string> = {
  HomeTab: "Home",
  ExploreTab: "Explore",
  ActivitiesTab: "Activities",
  ProfileTab: "You",
};

// Custom tab bar: 4 flat tabs + a raised crimson blood-drop FAB in the
// center that jumps to Donate (presented over the tab navigator by the
// root stack, not a tab itself — donating is the app's primary action,
// not a destination you "browse" like the other four).
export default function InkTabBar({ state, navigation }: BottomTabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <View
        style={[
          styles.bar,
          { backgroundColor: theme.color.paper, borderTopColor: theme.color.hairline },
        ]}
      >
        {state.routes.slice(0, 2).map((route, index) => renderTab(route, index))}
        <View style={styles.fabSlot} />
        {state.routes.slice(2).map((route, index) => renderTab(route, index + 2))}
      </View>

      <Pressable
        onPress={() => navigation.navigate("Donate" as never)}
        style={[styles.fab, { backgroundColor: theme.color.crimson, borderColor: theme.color.paper }]}
        accessibilityRole="button"
        accessibilityLabel="Donate"
      >
        <DropMark size={26} color={theme.color.inverse} filled />
      </Pressable>
    </View>
  );

  function renderTab(route: (typeof state.routes)[number], index: number) {
    const isFocused = state.index === index;
    const IconComp = TAB_ICONS[route.name] ?? House;
    const label = TAB_LABELS[route.name] ?? route.name;

    const onPress = () => {
      const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name as never);
      }
    };

    return (
      <Pressable key={route.key} onPress={onPress} style={styles.tab} accessibilityRole="button">
        <Icon icon={IconComp} size={22} color={isFocused ? theme.color.crimson : theme.color.inkFaint} />
        <Text variant="caption" tone={isFocused ? "crimson" : "inkFaint"} style={styles.label}>
          {label}
        </Text>
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  wrap: { position: "absolute", left: 0, right: 0, bottom: 0 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: TAB_BAR_BORDER_WIDTH,
    paddingTop: TAB_BAR_PADDING_TOP,
    paddingHorizontal: 8,
  },
  tab: { flex: 1, alignItems: "center", gap: 3, paddingVertical: 4 },
  label: { fontSize: 10 },
  fabSlot: { width: 64 },
  fab: {
    position: "absolute",
    alignSelf: "center",
    top: -26,
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 6,
  },
});
