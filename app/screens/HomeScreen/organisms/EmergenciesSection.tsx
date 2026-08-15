import React from "react";
import { View, StyleSheet } from "react-native";
import { SectionHeader } from "../../../design";
import EmergencyCard, { Emergency } from "../molecules/EmergencyCard";

interface EmergenciesSectionProps {
  emergencies: Emergency[];
  onDonate: (emergency: Emergency) => void;
  onViewDetails?: (emergency: Emergency) => void;
  onViewAll?: () => void;
}

export default function EmergenciesSection({
  emergencies,
  onDonate,
  onViewDetails,
  onViewAll,
}: EmergenciesSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Emergency" actionLabel={onViewAll ? "View All" : undefined} onAction={onViewAll} />

      <View style={styles.list}>
        {emergencies.map((emergency) => (
          <EmergencyCard key={emergency.id} emergency={emergency} onDonate={onDonate} onViewDetails={onViewDetails} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  list: { gap: 12 },
});
