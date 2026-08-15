import React from "react";
import { View, StyleSheet } from "react-native";
import { QrCode, CalendarDays } from "lucide-react-native";
import { useTheme } from "../../../design";
import TabButton from "../atoms/TabButton";
import { TabType } from "../types";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

// Segmented control for the Donate screen's two modes.
export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.tabContainer,
        {
          backgroundColor: theme.color.surfaceSunken,
          borderColor: theme.color.hairline,
          borderRadius: theme.radius.md,
        },
      ]}
    >
      <TabButton
        title="QR Code"
        icon={QrCode}
        isActive={activeTab === "qr"}
        onPress={() => onTabChange("qr")}
      />
      <TabButton
        title="Appointments"
        icon={CalendarDays}
        isActive={activeTab === "appointment"}
        onPress={() => onTabChange("appointment")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginBottom: 16,
    borderWidth: 1.5,
    padding: 4,
  },
});
