import React from "react";
import { View, StyleSheet } from "react-native";
import TabButton from "../../atoms/DonationScreen/TabButton";

interface TabNavigatorProps {
  activeTab: "campaign" | "appointment";
  onTabChange: (tab: "campaign" | "appointment") => void;
}

export default function TabNavigator({
  activeTab,
  onTabChange,
}: TabNavigatorProps) {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TabButton
          title="At Campaign"
          icon="heart-outline"
          isActive={activeTab === "campaign"}
          onPress={() => onTabChange("campaign")}
        />
        <TabButton
          title="Book Appointment"
          icon="calendar-outline"
          isActive={activeTab === "appointment"}
          onPress={() => onTabChange("appointment")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "#dc2626",
    borderRadius: 12,
    overflow: "hidden",
  },
});
