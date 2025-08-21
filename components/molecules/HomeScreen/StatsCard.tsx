import React from "react";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StatsNumber from "../../atoms/HomeScreen/StatsNumber";
import StatusIndicator from "../../atoms/HomeScreen/StatusIndicator";
import { useLanguage } from "../../../app/context/LanguageContext";

interface StatsCardProps {
  totalDonations: number;
  statusTitle?: string;
  statusSubtitle?: string;
  statusIcon?: keyof typeof Ionicons.glyphMap;
}

export default function StatsCard({
  totalDonations,
  statusTitle = "Ready to Donate",
  statusSubtitle = "You are eligible to donate",
  statusIcon = "checkmark-circle",
}: StatsCardProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.statsCard}>
      <StatsNumber
        number={totalDonations}
        label={t("home.total_donations")}
        secondaryLabel=""
      />
      <StatusIndicator
        title={statusTitle}
        subtitle={statusSubtitle}
        icon={statusIcon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
});
