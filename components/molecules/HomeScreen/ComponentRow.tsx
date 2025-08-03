import React from "react";
import { View, StyleSheet } from "react-native";
import ComponentInfoCard from "../../atoms/HomeScreen/ComponentInfoCard";

interface ComponentRowProps {
  bloodType: string;
  lastDonationDays: number;
}

export default function ComponentRow({
  bloodType,
  lastDonationDays,
}: ComponentRowProps) {
  return (
    <View style={styles.componentRow}>
      <ComponentInfoCard
        title="Blood Type"
        subtitle="O+ Universal donor"
        value={bloodType}
        icon="water"
        iconColor="#FF4757"
      />
      <ComponentInfoCard
        title="Last Donation"
        subtitle="Time since last visit"
        value={`${lastDonationDays} days`}
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
