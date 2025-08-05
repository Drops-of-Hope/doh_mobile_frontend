import React from "react";
import { View, Text, StyleSheet } from "react-native";
import HeaderButton from "../atoms/HeaderButton";

interface AppointmentHeaderProps {
  title: string;
  onBack?: () => void;
  onAdd?: () => void;
}

export default function AppointmentHeader({
  title,
  onBack,
  onAdd,
}: AppointmentHeaderProps) {
  return (
    <View style={styles.header}>
      <HeaderButton icon="arrow-back" onPress={onBack} />

      <Text style={styles.headerTitle}>{title}</Text>

      <HeaderButton
        icon="add"
        color="#FFFFFF"
        backgroundColor="#5F27CD"
        onPress={onAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: "#FAFBFC",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1F2937",
    letterSpacing: -0.5,
  },
});
