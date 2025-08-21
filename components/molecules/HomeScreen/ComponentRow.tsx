import React from "react";
import { View, StyleSheet } from "react-native";
import ComponentInfoCard from "../../atoms/HomeScreen/ComponentInfoCard";
import { useLanguage } from "../../../app/context/LanguageContext";

interface ComponentRowProps {
  bloodType: string;
  lastDonationDays: number;
}

export default function ComponentRow({
  bloodType,
  lastDonationDays,
}: ComponentRowProps) {
  const { t } = useLanguage();

  return (
    <View style={styles.componentRow}>
      <ComponentInfoCard
        title={t("home.blood_type")}
        subtitle="O+ Universal donor"
        value={bloodType}
        icon="water"
        iconColor="#FF4757"
      />
      <ComponentInfoCard
        title={t("home.last_donation")}
        subtitle="Time since last visit"
        value={t("home.days_ago", { days: lastDonationDays })}
        icon="calendar"
        iconColor="#5F27CD"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  componentRow: {
    gap: 12,
  },
});
