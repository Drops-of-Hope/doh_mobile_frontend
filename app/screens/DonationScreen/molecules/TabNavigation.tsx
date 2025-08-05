import React from "react";
import { View, StyleSheet } from "react-native";
import TabButton from "../atoms/TabButton";
import { TabType } from "../types";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  return (
    <View style={styles.tabContainer}>
      <TabButton
        title="QR Code"
        icon="qr-code"
        isActive={activeTab === "qr"}
        onPress={() => onTabChange("qr")}
      />
      <TabButton
        title="Appointments"
        icon="calendar"
        isActive={activeTab === "appointment"}
        onPress={() => onTabChange("appointment")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
    margin: 16,
    borderRadius: 16,
    padding: 4,
  },
});
